import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CakeFlavor, CakeStyle, UpdatedCakeFlavor } from '../types';

const FLAVOR_SUFFIX: Record<UpdatedCakeFlavor, string> = {
  [UpdatedCakeFlavor.VANILLA]:    '001',
  [UpdatedCakeFlavor.CHOCOLATE]:  '002',
  [UpdatedCakeFlavor.STRAWBERRY]: '003',
  [UpdatedCakeFlavor.RED_VELVET]: '004',
  [UpdatedCakeFlavor.CARAMEL]:    '005',
  [UpdatedCakeFlavor.COFFEE]:     '006',
  [UpdatedCakeFlavor.BLUEBERRY]:  '007',
  [UpdatedCakeFlavor.PISTACHIO]:  '008',
};

// Each entry holds a flavor and all its matching children from the GLB
interface FlavorMeshGroup {
  flavor: UpdatedCakeFlavor;
  suffix: string;
  base: THREE.Object3D[];         // everything else in this flavor
  decorations: THREE.Object3D[];  // name includes suffix + "decoration"
  drips: THREE.Object3D[];        // name includes suffix + "drip"
}

interface UpdatedCakeProps {
  modelUrl?: string;
  flavor: UpdatedCakeFlavor;
  cakeDecoration?: boolean;
  cakeDrip?: boolean;
  text?: string; // 👈
}

export const UpdatedCake: React.FC<UpdatedCakeProps> = ({
  modelUrl = '/models/cake.glb',
  flavor,
  cakeDecoration = false,
  cakeDrip = false,
  text = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const flavorGroupsRef = useRef<FlavorMeshGroup[]>([]);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animationsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const candleRef = useRef<THREE.Object3D | null>(null);
  const isModelLoadedRef = useRef(false);

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
    scene.background = null; // transparent so parent CSS shows through
    sceneRef.current = scene;

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
    controls.target.set(0, 0, 0);

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

        // Build one group per flavor including decorations and drip
        const flavorGroups: FlavorMeshGroup[] = Object.values(UpdatedCakeFlavor).map((flavor) => {
          const suffix = FLAVOR_SUFFIX[flavor];
          const base: THREE.Object3D[] = [];
          const decorations: THREE.Object3D[] = [];
          const drips: THREE.Object3D[] = [];

          model.traverse((child) => {
            if (!child.name.includes(suffix)) return; // only objects belonging to this flavor

            if (child.name.toLowerCase().includes('decoration')) {
              decorations.push(child);
            } else if (child.name.toLowerCase().includes('drip')) {
              drips.push(child);
            } else {
              base.push(child);
            }
          });

          // console.log(`[${flavor}] base: ${base.map(c => c.name)}`);
          // console.log(`[${flavor}] decorations: ${decorations.map(c => c.name)}`);
          // console.log(`[${flavor}] drips: ${drips.map(c => c.name)}`);

          return { flavor, suffix, base, decorations, drips };
        });

        flavorGroupsRef.current = flavorGroups;
        candleRef.current = findByName("candle") ?? null;

        addTextToScene(scene, text);
        applyVisibility(flavor, cakeDecoration, cakeDrip);
        showcaseAnimation();

        isModelLoadedRef.current = true;
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
  }, [modelUrl]);

  useEffect(() => {
    applyVisibility(flavor, cakeDecoration, cakeDrip);
    showcaseAnimation();
  }, [flavor, cakeDecoration, cakeDrip]);

  useEffect(() => {
    if (!isModelLoadedRef.current) return;
    if (!sceneRef.current) return;
    addTextToScene(sceneRef.current, text ?? '');
  }, [text]);

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
      curveSegments: 12,
      bevelEnabled: false,
    });

      // Center the text
      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox!;
      const textWidth = bbox.max.x - bbox.min.x;

      const material = new THREE.MeshStandardMaterial({
        color: 0xe67022,    // gold
        metalness: 0.4,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      if (candleRef.current) {
        mesh.position.x = candleRef.current.position.x - (textWidth / 2);
        mesh.position.y = candleRef.current.position.y + (textHeight / 2);
        mesh.position.z = candleRef.current.position.z - 0.3;
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
  const applyVisibility = (
    targetFlavor: UpdatedCakeFlavor,
    decoration: boolean,
    drip: boolean
  ) => {
    if (!modelRef.current || flavorGroupsRef.current.length === 0) return;

    flavorGroupsRef.current.forEach((group) => {
      const isActiveFlavor = group.flavor === targetFlavor;

      // Base meshes — visible only for active flavor
      group.base.forEach((child) => {
        child.visible = isActiveFlavor;
      });

      // Decorations — visible only if active flavor AND decoration enabled
      group.decorations.forEach((child) => {
        child.visible = isActiveFlavor && decoration;
      });

      // Drips — visible only if active flavor AND drip enabled
      group.drips.forEach((child) => {
        child.visible = isActiveFlavor && drip;
      });
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
