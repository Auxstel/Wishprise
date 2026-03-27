import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { useCandleInstancer } from './CandleInstancer';
import { CakeFlavor, CakeStyle, UpdatedCakeFlavor, UpdatedCakeShape } from '../types';

const FLAVOR_TEXTURE_URL: Record<UpdatedCakeFlavor, string> = {
  [UpdatedCakeFlavor.VANILLA]:    '/textures/cake/vanilla.png',
  [UpdatedCakeFlavor.CHOCOLATE]:  '/textures/cake/chocolate.png',
  [UpdatedCakeFlavor.STRAWBERRY]: '/textures/cake/strawberry.png',
  [UpdatedCakeFlavor.RED_VELVET]: '/textures/cake/red_velvet.png',
  [UpdatedCakeFlavor.CARAMEL]:    '/textures/cake/caramel.png',
  [UpdatedCakeFlavor.COFFEE]:     '/textures/cake/coffee.png',
  [UpdatedCakeFlavor.BLUEBERRY]:  '/textures/cake/blueberry.png',
  [UpdatedCakeFlavor.PISTACHIO]:  '/textures/cake/pistachio.png',
};

const SHAPE_MODEL_URL: Record<UpdatedCakeShape, string> = {
  [UpdatedCakeShape.ROUND]:  '/models/cake_round.glb',
  [UpdatedCakeShape.SQUARE]: '/models/cake_square.glb',
  [UpdatedCakeShape.HEART]:  '/models/cake_heart.glb',
  [UpdatedCakeShape.TIER]:   '/models/cake_tier.glb',
};

interface CakeMeshGroup {
  base: THREE.Object3D[];        // "001" but not decoration or drip
  decorations: THREE.Object3D[]; // "001" + "decoration"
  drips: THREE.Object3D[];       // "001" + "drip"
}

interface UpdatedCakeProps {
  modelUrl?: string;         // optional override
  shape?: UpdatedCakeShape;  // drives which GLB loads
  flavor: UpdatedCakeFlavor;
  cakeDecoration?: boolean;
  cakeDrip?: boolean;
  text?: string;
  textColor?: string;
  candleCount?: number;
  enableRotate?: boolean;
}

export const UpdatedCake: React.FC<UpdatedCakeProps> = ({
  shape = UpdatedCakeShape.ROUND,
  flavor,
  cakeDecoration = false,
  cakeDrip = false,
  text = '',
  textColor = '#FFD700',
  candleCount = 1,
}) => {
  const isModelLoadedRef = useRef(false);
  const modelUrl = SHAPE_MODEL_URL[shape];
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animationsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const cakeGroupRef = useRef<CakeMeshGroup>({ base: [], decorations: [], drips: [] });
  const texturesRef = useRef<Map<UpdatedCakeFlavor, THREE.Texture>>(new Map());
  const roughnessTextureRef = useRef<THREE.Texture | null>(null);
  const candleRef = useRef<THREE.Object3D | null>(null);
  const candleAnchorRef = useRef<THREE.Vector3 | null>(null);
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [candlePositions, setCandlePositions] = useState<THREE.Vector3[]>([]);

  const buildCandlePositions = (count: number): THREE.Vector3[] => {
    const anchor = candleAnchorRef.current ?? new THREE.Vector3(0, 2, 0);
    const positions: THREE.Vector3[] = [];
    const radius = 0.6;

    for (let i = 0; i < count; i++) {
      const angle = (i / (count - 1)) * Math.PI + Math.PI;

      positions.push(new THREE.Vector3(
        anchor.x + Math.cos(angle) * radius,
        anchor.y,
        anchor.z + Math.sin(angle) * radius
      ));
    }

    return positions;
  };

  useCandleInstancer(scene, candleCount, candlePositions);

  // Separate useEffect — runs once on mount
  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Color textures per flavor
    Object.values(UpdatedCakeFlavor).forEach((flavor) => {
      const texture = loader.load(FLAVOR_TEXTURE_URL[flavor]);
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texturesRef.current.set(flavor, texture);
    });

    // Single shared roughness map
    const roughness = loader.load('/textures/cake/roughness.png');
    roughness.minFilter = THREE.NearestFilter;
    roughness.magFilter = THREE.NearestFilter;
    roughnessTextureRef.current = roughness;

    return () => {
      texturesRef.current.forEach((tex) => tex.dispose());
      texturesRef.current.clear();
      roughnessTextureRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // ─── Dimensions ───────────────────────────────────────────────────────────
    const width  = mountRef.current.clientWidth  || 400;
    const height = mountRef.current.clientHeight || 400;

    // ─── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // ─── Scene ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    sceneRef.current = scene;
    setScene(scene);

    scene.background = null; // transparent so parent CSS shows through

    // ─── Camera ───────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 4);
    camera.lookAt(0, 0, 0);

    // ─── Lights ───────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 2);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width  = 512;
    keyLight.shadow.mapSize.height = 512;
    // keyLight.shadow.bias = 0.01;
    keyLight.shadow.normalBias = 0.1;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.8);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // ─── Orbit Controls ───────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan     = false;
    controls.minPolarAngle = Math.PI / 6;  // 30° — how far UP you can look
    controls.maxPolarAngle = Math.PI / 2;  // 90° — stops exactly at the equator (horizon level)
    controls.minDistance   = 4;
    controls.maxDistance   = 8;
    controls.target.set(0, 0.5, 0);

    // ─── Load GLB ─────────────────────────────────────────────────────────────
    const loader = new GLTFLoader();

    loader.load(
      modelUrl,

      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Mixer setup
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        // Save each animation by name
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          animationsRef.current.set(clip.name, action);
          console.log('Found animation:', clip.name); // 👈 log names to see what's in the GLB
        });

        // Shadow setup
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow    = true;
            child.receiveShadow = true;
          }
        });

        const group: CakeMeshGroup = { base: [], decorations: [], drips: [] };

        model.traverse((child) => {
          if (!child.name.includes('001')) return;

          const nameLower = child.name.toLowerCase();
          if (nameLower.includes('decoration')) {
            group.decorations.push(child);
          } else if (nameLower.includes('drip')) {
            group.drips.push(child);
          } else {
            group.base.push(child);
          }
        });

        cakeGroupRef.current = group;

        console.log('Base:', group.base.map(c => c.name));
        console.log('Decorations:', group.decorations.map(c => c.name));
        console.log('Drips:', group.drips.map(c => c.name));
        
        candleRef.current = findByName("candle") ?? null;
        const worldPos = new THREE.Vector3();
        candleRef.current?.getWorldPosition(worldPos);
        candleAnchorRef.current = worldPos;

        setCandlePositions(buildCandlePositions(candleCount));

        applyFlavor(flavor);
        applyVisibility(cakeDecoration, cakeDrip);
        isModelLoadedRef.current = true;
        
        addTextToScene(scene, text ?? '');
        showcaseAnimation();
        scene.add(model);
      },

      (xhr) => {
        if (xhr.lengthComputable) {
          console.log(`cake.glb loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`);
        }
      },

      (err) => {
        console.error('Failed to load cake.glb:', err);
      }
    );

    // ─── Animation Loop ───────────────────────────────────────────────────────
    let frameId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixerRef.current?.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize Handler ───────────────────────────────────────────────────────
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [shape]);

  useEffect(() => {
    applyFlavor(flavor);
  }, [flavor]);

  useEffect(() => {
    applyVisibility(cakeDecoration, cakeDrip);
  }, [cakeDecoration, cakeDrip]);

  useEffect(() => {
    if (!isModelLoadedRef.current) return;
    if (!sceneRef.current) return;
    addTextToScene(sceneRef.current, text ?? '');
  }, [text, textColor]);

  useEffect(() => {
    if (!candleAnchorRef.current) return; // anchor not loaded yet
    setCandlePositions(buildCandlePositions(candleCount));
  }, [candleCount]);

  const findByName = (searchTerm: string): THREE.Object3D | undefined => {
    let found: THREE.Object3D | undefined;
    modelRef.current?.traverse((child) => {
      if (child.name.includes(searchTerm)) {
        found = child;
      }
    });
    return found;
  };

  // ─── Cake Text ──────────────────────────────────────────────────────────
  const addTextToScene = (scene: THREE.Scene, content: string) => {
    // Remove existing text mesh if any
    if (textMeshRef.current) {
      scene.remove(textMeshRef.current);
      textMeshRef.current.geometry.dispose();
      textMeshRef.current = null;
    }

    if (!content.trim()) return;
    
    const textHeight = 0.03;

    const loader = new FontLoader();
    loader.load('/fonts/optimer_bold.typeface.json', (font) => {
      const geometry = new TextGeometry(content, {
      font,
      size: 0.125,
      height: textHeight,
      curveSegments: 3,
      bevelEnabled: false,
    });

      // Center the text
      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox!;
      const textWidth = bbox.max.x - bbox.min.x;

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(textColor),
        metalness: 0.4,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      if (candleRef.current) {
        mesh.position.x = candleRef.current.position.x - (textWidth / 2);
        mesh.position.y = candleRef.current.position.y;
        mesh.position.z = candleRef.current.position.z;
      } else {
        mesh.position.set(-textWidth / 2, 2, 0);
      }
      
      mesh.rotation.set(Math.PI / 2, Math.PI, Math.PI);
      mesh.castShadow = false;

      textMeshRef.current = mesh;
      scene.add(mesh);
    });
  };

  // ─── Toggle Groups ──────────────────────────────────────────────────────────
  // Master function — call this whenever any of the three props change
  const applyVisibility = (decoration: boolean, drip: boolean) => {
    if (!modelRef.current) return;
    cakeGroupRef.current.decorations.forEach(c => c.visible = decoration);
    cakeGroupRef.current.drips.forEach(c => c.visible = drip);
  };

  const applyFlavor = (targetFlavor: UpdatedCakeFlavor) => {
    if (!modelRef.current) return;

    const texture = texturesRef.current.get(targetFlavor);
    if (!texture) return;

    const material = new THREE.MeshStandardMaterial({
      map:          texture,
      roughnessMap: roughnessTextureRef.current ?? undefined, // 👈 shared
      roughness:    1.0,
      metalness:    0.0,
    });

    const allMeshes = [
      ...cakeGroupRef.current.base,
      ...cakeGroupRef.current.decorations,
      ...cakeGroupRef.current.drips,
    ];

    allMeshes.forEach((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material;
      }
    });
  };

  // ─── Animations ────────────────────────────────────────────────────────────
  const playAnimation = (name: string, loop: boolean = true) => {
    const action = animationsRef.current.get(name);
    if (!action) return;
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    action.clampWhenFinished = !loop; // freeze on last frame if not looping
    action.reset().play();
  };

  const pauseAnimation = (name: string) => {
    const action = animationsRef.current.get(name);
    if (!action) return;
    action.paused = true;
  };

  const resumeAnimation = (name: string) => {
    const action = animationsRef.current.get(name);
    if (!action) return;
    action.paused = false;
  };

  const stopAnimation = (name: string) => {
    const action = animationsRef.current.get(name);
    if (!action) return;
    action.stop();
  };

  const stopAllAnimations = () => {
    animationsRef.current.forEach((action) => action.stop());
  };

  const showcaseAnimation = () => {
    stopAllAnimations();
    playAnimation("showcase", false);
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
};
