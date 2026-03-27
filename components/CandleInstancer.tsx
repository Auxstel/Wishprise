import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── Shaders ──────────────────────────────────────────────────────────────────

const flameVertexShader = `
  uniform float uTime;
  uniform float uIndex;
  uniform float uIntensity;
  uniform vec3 uCameraPos;

  varying vec2  vUv;
  varying float vFlicker;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vUv = uv;

    vec3  pos          = position;
    float heightFactor = 1.0 - clamp(uv.y, 0.0, 1.0);

    // Fast flicker
    float flicker1 = sin(uTime * 8.0 + uIndex * 3.7) * 0.04 * heightFactor * uIntensity;
    float flicker2 = cos(uTime * 6.5 + uIndex * 2.1) * 0.03 * heightFactor * uIntensity;
    
    // Slow wind sway
    float sway = sin(uTime * 1.8 + uIndex * 1.3) * 0.06 * heightFactor * uIntensity;
    
    // Tip turbulence
    float turbulence = smoothNoise(vec2(uTime * 2.0 + uIndex, uv.y * 3.0)) 
    * 0.05 * heightFactor * uIntensity;

    pos.x += flicker1 + sway + turbulence;
    pos.z += flicker2 + turbulence * 0.5;

    // Pinch tip
    float pinch = 1.0 - (heightFactor * heightFactor * 0.4);
    pos.x *= pinch;
    pos.z *= pinch;

    // Vertical breathing
    pos.y += sin(uTime * 5.0 + uIndex * 4.2) * 0.02 * heightFactor;

    vFlicker = 0.9 + sin(uTime * 10.0 + uIndex * 2.5) * 0.15;

    // ─── Billboard: neutralise the rotation block of modelViewMatrix ───
    mat4 mv = modelViewMatrix;
    mv[0][0] = 1.0;  mv[0][1] = 0.0;  mv[0][2] = 0.0;
    mv[1][0] = 0.0;  mv[1][1] = 1.0;  mv[1][2] = 0.0;
    mv[2][0] = 0.0;  mv[2][1] = 0.0;  mv[2][2] = 1.0;
    // ───────────────────────────────────────────────────────────────────

    gl_Position = projectionMatrix * mv * vec4(pos, 1.0);
  }
`;

const flameFragmentShader = `
  uniform float     uTime;
  uniform float     uIndex;
  uniform sampler2D uBaseMap;
  uniform sampler2D uAlphaMap;
  uniform sampler2D uEmissiveMap;
  uniform float     uEmissiveIntensity;

  varying vec2  vUv;
  varying float vFlicker;

  void main() {
    vec4  baseColor  = texture2D(uBaseMap,     vUv);
    float alpha      = texture2D(uAlphaMap,    vUv).r;
    vec3  emissive   = texture2D(uEmissiveMap, vUv).rgb;

    vec3 finalColor  = baseColor.rgb + emissive * uEmissiveIntensity * vFlicker;

    gl_FragColor     = vec4(finalColor, alpha * vFlicker);
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtractedCandle {
  candleGeo:        THREE.BufferGeometry;
  candleMat:        THREE.Material;
  flameGeo:         THREE.BufferGeometry;
  flameBaseMap:     THREE.Texture | null;
  flameAlphaMap:    THREE.Texture | null;
  flameEmissiveMap: THREE.Texture | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCandleInstancer = (
  scene:     THREE.Scene | null,
  count:     number,
  positions: THREE.Vector3[]
) => {
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const flameMatsRef = useRef<THREE.ShaderMaterial[]>([]);
  const frameIdRef   = useRef<number>(0);

  useEffect(() => {
    if (!scene) return;
    if (positions.length === 0) return;

    let cancelled = false; // 👈 stale callback guard

    // ── Cleanup previous instances ───────────────────────────────────────────
    if (rootGroupRef.current) {
      scene.remove(rootGroupRef.current);
      rootGroupRef.current = null;
    }
    flameMatsRef.current.forEach((m) => m.dispose());
    flameMatsRef.current = [];
    cancelAnimationFrame(frameIdRef.current);

    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;

    const loader = new GLTFLoader();

    loader.load('/models/candle.glb', (gltf) => {
      if (cancelled) return;

      // GLB structure:
      //   Scene
      //   └── Group
      //       ├── CandleMesh  (material: "candle")
      //       └── FlameMesh   (material: "flame")

      let candleGeo:        THREE.BufferGeometry | null = null;
      let candleMat:        THREE.Material       | null = null;
      let flameGeo:         THREE.BufferGeometry | null = null;
      let flameBaseMap:     THREE.Texture        | null = null;
      let flameAlphaMap:    THREE.Texture        | null = null;
      let flameEmissiveMap: THREE.Texture        | null = null;
      let flamePosition = 0;

      // Log structure for debugging
      // console.log('--- Candle GLB structure ---');
      // gltf.scene.traverse((child) => {
      //   console.log(child.type, '|', child.name);
      // });

      // Find the inner group first, then pull the two meshes from it
      gltf.scene.traverse((child) => {
        if (child.type !== 'Group') return;

        child.children.forEach((node) => {
          if (!(node as THREE.Mesh).isMesh) return;
          const mesh = node as THREE.Mesh;

          const mat = Array.isArray(mesh.material)
            ? mesh.material[0]
            : mesh.material;

          const matName = mat?.name?.toLowerCase() ?? '';

          if (matName.includes('candle')) {
            candleGeo = mesh.geometry.clone();
            // Preserve world transform of the mesh relative to the group
            mesh.updateWorldMatrix(true, false);
            candleMat = mat;
            // console.log('Found candle mesh:', mesh.name, '| mat:', mat?.name);

          } else if (matName.includes('flame')) {
            flameGeo = mesh.geometry.clone();
            const stdMat     = mat as THREE.MeshStandardMaterial;
            flameBaseMap     = stdMat.map            ?? null;
            flameAlphaMap    = stdMat.alphaMap       ?? stdMat.emissiveMap ?? null;
            flameEmissiveMap = stdMat.emissiveMap    ?? null;
            flamePosition    = mesh.position.y;
            // console.log('Found flame mesh:', mesh.name, '| mat:', mat?.name);
          }
        });
      });

      if (!candleGeo || !candleMat || !flameGeo) {
        console.error('CandleInstancer: missing meshes.', { candleGeo, candleMat, flameGeo });
        return;
      }

      const extracted: ExtractedCandle = {
        candleGeo,
        candleMat,
        flameGeo,
        flameBaseMap,
        flameAlphaMap,
        flameEmissiveMap,
      };

      // ── Spawn instances ──────────────────────────────────────────────────
      for (let i = 0; i < count; i++) {
        const pos = positions[i] ?? new THREE.Vector3(i * 0.4, 0, 0);

        // Mirrors the GLB's inner group per candle instance
        const candleInstance = new THREE.Group();
        candleInstance.position.copy(pos);

        // Candle body — original GLB material
        const candleMesh = new THREE.Mesh(extracted.candleGeo, extracted.candleMat);
        candleMesh.castShadow = true;
        candleInstance.add(candleMesh);

        // Flame — custom shader material, flame geometry
        const flameShadeMat = new THREE.ShaderMaterial({
          vertexShader:   flameVertexShader,
          fragmentShader: flameFragmentShader,
          uniforms: {
            uTime:              { value: 0 },
            uIndex:             { value: i },
            uIntensity:         { value: 0.25 },
            uBaseMap:           { value: extracted.flameBaseMap },
            uAlphaMap:          { value: extracted.flameAlphaMap },
            uEmissiveMap:       { value: extracted.flameEmissiveMap },
            uEmissiveIntensity: { value: 2.0 },
          },
          transparent: true,
          depthWrite:  false,
          side:        THREE.DoubleSide,
        });

        flameMatsRef.current.push(flameShadeMat);

        const flameMesh = new THREE.Mesh(extracted.flameGeo, flameShadeMat);
        flameMesh.position.y = flamePosition;
        candleInstance.add(flameMesh);

        rootGroup.add(candleInstance);
      }

      scene.add(rootGroup);

      const clock = new THREE.Clock();
      const tick = () => {
        frameIdRef.current = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        flameMatsRef.current.forEach((mat) => {
          mat.uniforms.uTime.value = t;
        });
      };
      tick();
    });

    return () => {
      cancelled = true; // 👈 mark stale before next effect runs
      cancelAnimationFrame(frameIdRef.current);
      if (rootGroupRef.current) {
        scene.remove(rootGroupRef.current);
      }
      flameMatsRef.current.forEach((m) => m.dispose());
    };

  }, [scene, count, JSON.stringify(positions)]);
};
