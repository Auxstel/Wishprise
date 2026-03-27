import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── Shaders ──────────────────────────────────────────────────────────────────

const flameVertexShader = `
  uniform float uTime;
  uniform float uIndex;

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
    float heightFactor = clamp(uv.y, 0.0, 1.0);

    // Fast flicker
    float flicker1 = sin(uTime * 8.0  + uIndex * 3.7) * 0.04 * heightFactor;
    float flicker2 = cos(uTime * 6.5  + uIndex * 2.1) * 0.03 * heightFactor;

    // Slow wind sway
    float sway = sin(uTime * 1.8 + uIndex * 1.3) * 0.06 * heightFactor;

    // Tip turbulence
    float turbulence = smoothNoise(vec2(uTime * 2.0 + uIndex, uv.y * 3.0)) * 0.05 * heightFactor;

    pos.x += flicker1 + sway + turbulence;
    pos.z += flicker2 + turbulence * 0.5;

    // Pinch tip
    float pinch = 1.0 - (heightFactor * heightFactor * 0.4);
    pos.x *= pinch;
    pos.z *= pinch;

    // Vertical breathing
    pos.y += sin(uTime * 5.0 + uIndex * 4.2) * 0.02 * heightFactor;

    vFlicker = 0.8 + sin(uTime * 10.0 + uIndex * 2.5) * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
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
    // Scroll UVs upward for rising heat shimmer
    vec2 scrolledUv = vUv;
    scrolledUv.y = fract(vUv.y - uTime * 0.3 + uIndex * 0.1);

    vec4  baseColor = texture2D(uBaseMap,     scrolledUv);
    float alpha     = texture2D(uAlphaMap,    scrolledUv).r;
    vec3  emissive  = texture2D(uEmissiveMap, scrolledUv).rgb;

    vec3 finalColor = baseColor.rgb + emissive * uEmissiveIntensity * vFlicker;

    gl_FragColor = vec4(finalColor, alpha * vFlicker);
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandleData {
  geo:        THREE.BufferGeometry;
  candleMat:  THREE.Material;
  flameBaseMap:      THREE.Texture | null;
  flameAlphaMap:     THREE.Texture | null;
  flameEmissiveMap:  THREE.Texture | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const CandleInstancer = (
  scene:     THREE.Scene | null,
  count:     number,
  positions: THREE.Vector3[]
) => {
  const candleGroupRef = useRef<THREE.Group | null>(null);
  const flameMatsRef   = useRef<THREE.ShaderMaterial[]>([]);
  const frameIdRef     = useRef<number>(0);

  useEffect(() => {
    if (!scene) return;

    // ── Cleanup previous candles ─────────────────────────────────────────────
    if (candleGroupRef.current) {
      scene.remove(candleGroupRef.current);
      candleGroupRef.current = null;
    }
    flameMatsRef.current.forEach((m) => m.dispose());
    flameMatsRef.current = [];
    cancelAnimationFrame(frameIdRef.current);

    const group = new THREE.Group();
    candleGroupRef.current = group;

    const loader = new GLTFLoader();

    loader.load('/models/candle.glb', (gltf) => {
      // ── Extract geo and materials ───────────────────────────────────────────
      // The candle mesh has a single geometry with two materials:
      // index 0 = "candle", index 1 = "flame"
      let candleData: CandleData | null = null;

      gltf.scene.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;

        // Multi-material mesh — materials is an array
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        const candleMat = materials.find(
          (m) => m.name.toLowerCase().includes('candle')
        );
        const flameMat = materials.find(
          (m) => m.name.toLowerCase().includes('flame')
        ) as THREE.MeshStandardMaterial | undefined;

        if (candleMat && flameMat) {
          candleData = {
            geo:             mesh.geometry.clone(),
            candleMat:       candleMat,
            flameBaseMap:    flameMat.map            ?? null,
            flameAlphaMap:   flameMat.alphaMap       ?? flameMat.emissiveMap ?? null,
            flameEmissiveMap: flameMat.emissiveMap   ?? null,
          };
        }
      });

      if (!candleData) {
        console.error('Could not find candle mesh with candle+flame materials in GLB');
        return;
      }

      const { geo, candleMat, flameBaseMap, flameAlphaMap, flameEmissiveMap } = candleData;

      // ── Spawn instances ─────────────────────────────────────────────────────
      for (let i = 0; i < count; i++) {
        const pos = positions[i] ?? new THREE.Vector3(i * 0.4, 0, 0);

        // Candle body — uses original GLB material
        const candleMesh = new THREE.Mesh(geo, candleMat);
        candleMesh.position.copy(pos);
        candleMesh.castShadow = true;
        group.add(candleMesh);

        // Flame — custom shader material, same geo
        const flameShadeMat = new THREE.ShaderMaterial({
          vertexShader:   flameVertexShader,
          fragmentShader: flameFragmentShader,
          uniforms: {
            uTime:              { value: 0 },
            uIndex:             { value: i },
            uBaseMap:           { value: flameBaseMap },
            uAlphaMap:          { value: flameAlphaMap },
            uEmissiveMap:       { value: flameEmissiveMap },
            uEmissiveIntensity: { value: 2.0 },
          },
          transparent: true,
          depthWrite:  false,
          side:        THREE.DoubleSide,
        });

        flameMatsRef.current.push(flameShadeMat);

        const flameMesh = new THREE.Mesh(geo, flameShadeMat);
        flameMesh.position.copy(pos);
        group.add(flameMesh);
      }

      scene.add(group);

      // ── Animate shader time uniform ─────────────────────────────────────────
      const clock = new THREE.Clock();
      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        flameMatsRef.current.forEach((mat) => {
          mat.uniforms.uTime.value = t;
        });
      };
      animate();
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      if (candleGroupRef.current) {
        scene.remove(candleGroupRef.current);
      }
      flameMatsRef.current.forEach((m) => m.dispose());
    };
  }, [scene, count, JSON.stringify(positions)]);
};
