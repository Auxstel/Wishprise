import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
  children: THREE.Object3D[];
}

interface UpdatedCakeProps {
  modelUrl?: string;
  flavor: UpdatedCakeFlavor;
}

export const UpdatedCake: React.FC<UpdatedCakeProps> = ({
  modelUrl = '/models/cake.glb',
  flavor,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const flavorGroupsRef = useRef<FlavorMeshGroup[]>([]);

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // ─── Scene ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null; // transparent so parent CSS shows through

    // ─── Camera ───────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // ─── Lights ───────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 2);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width  = 1024;
    keyLight.shadow.mapSize.height = 1024;
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

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow    = true;
            child.receiveShadow = true;
          }
        });

        // Build one group per flavor
        const flavorGroups: FlavorMeshGroup[] = Object.values(UpdatedCakeFlavor).map((flavor) => {
          const suffix = FLAVOR_SUFFIX[flavor];
          const children: THREE.Object3D[] = [];

          model.traverse((child) => {
            if (child.name.includes(suffix)) {
              children.push(child);
            }
          });

          return { flavor, suffix, children };
        });

        flavorGroupsRef.current = flavorGroups;

        // Log to verify
        flavorGroups.forEach(({ flavor, suffix, children }) => {
          console.log(`${flavor} (${suffix}):`, children.map(c => c.name));
        });

        showFlavor(flavor);
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
    const animate = () => {
      frameId = requestAnimationFrame(animate);
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
    showFlavor(flavor);
  }, [flavor]);

  const findByName = (searchTerm: string): THREE.Object3D | undefined => {
    let found: THREE.Object3D | undefined;
    modelRef.current?.traverse((child) => {
      if (child.name.includes(searchTerm)) {
        found = child;
      }
    });
    return found;
  };

  const showFlavor = (target: UpdatedCakeFlavor) => {
    // Guard: do nothing if model isn't loaded yet
    if (!modelRef.current || flavorGroupsRef.current.length === 0) return;

    flavorGroupsRef.current.forEach(({ flavor, children }) => {
      children.forEach((child) => {
        child.visible = flavor === target;
      });
    });
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
};
