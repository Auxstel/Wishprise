import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CakeFlavor, CakeStyle, UpdatedCakeFlavor } from '../types';

const FLAVOR_SUFFIX: Record<UpdatedCakeFlavor, string> = {
  [UpdatedCakeFlavor.Vanilla]:    '001',
  [UpdatedCakeFlavor.Chocolate]:  '002',
  [UpdatedCakeFlavor.Strawberry]: '003',
  [UpdatedCakeFlavor.Red_Velvet]: '004',
  [UpdatedCakeFlavor.Caramel]:    '005',
  [UpdatedCakeFlavor.Coffee]:     '006',
  [UpdatedCakeFlavor.Blueberry]:  '007',
  [UpdatedCakeFlavor.Pistachio]:  '008',
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
    controls.minDistance   = 2;
    controls.maxDistance   = 10;
    controls.target.set(0, 0, 0);

    // ─── Load GLB ─────────────────────────────────────────────────────────────
    const loader = new GLTFLoader();

    loader.load(
      modelUrl,

      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Auto-center and scale to fit view
        const box    = new THREE.Box3().setFromObject(model);
        const size   = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim      = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.5 / maxDim;
        model.scale.setScalar(scaleFactor);

        // Sit on y = 0
        model.position.sub(center.multiplyScalar(scaleFactor));
        model.position.y += size.y * scaleFactor * 0.5;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow    = true;
            child.receiveShadow = true;
          }
        });

        // Build one group per flavor
        const flavorGroups: FlavorMeshGroup[] = Object.values(UpdatedCakeFlavor)
          .filter((v) => typeof v === 'number') // enum gives both keys & values, keep numbers
          .map((v) => {
            const flavor = v as UpdatedCakeFlavor;
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

        // Log to verify during development
        // flavorGroups.forEach(({ flavor, suffix, children }) => {
        //   console.log(`${UpdatedCakeFlavor[flavor]} (${suffix}):`, children.map(c => c.name));
        // });

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
