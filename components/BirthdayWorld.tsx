import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CAKE_COLORS } from '../constants';

interface BirthdayWorldProps {
  onOpen: () => void;
}

export const BirthdayWorld: React.FC<BirthdayWorldProps> = ({ onOpen }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 1. Setup Scene ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.02); // Deep slate fog for depth

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mountRef.current.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffd700, 20);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const purpleLight = new THREE.PointLight(0xd946ef, 5, 20);
    purpleLight.position.set(-5, 2, 5);
    scene.add(purpleLight);

    // --- 3. Objects: Gift Box ---
    const giftGroup = new THREE.Group();
    
    // Box
    const boxGeo = new THREE.BoxGeometry(3, 3, 3);
    const boxMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x701a75, // Magical 900
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    giftGroup.add(boxMesh);

    // Ribbon (Cross)
    const ribbonMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xffd700, // Gold
      roughness: 0.2, 
      metalness: 0.8,
      emissive: 0xccaa00,
      emissiveIntensity: 0.2
    });
    
    const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(3.1, 3.1, 0.5), ribbonMat);
    giftGroup.add(ribbon1);
    
    const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.1, 3.1), ribbonMat);
    giftGroup.add(ribbon2);

    // Bow on top
    const bowGroup = new THREE.Group();
    bowGroup.position.y = 1.6;
    
    const loopGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 32, Math.PI * 1.5);
    const loop1 = new THREE.Mesh(loopGeo, ribbonMat);
    loop1.rotation.z = Math.PI / 4;
    loop1.position.x = 0.4;
    
    const loop2 = new THREE.Mesh(loopGeo, ribbonMat);
    loop2.rotation.z = -Math.PI / 4;
    loop2.rotation.y = Math.PI;
    loop2.position.x = -0.4;

    bowGroup.add(loop1, loop2);
    giftGroup.add(bowGroup);

    scene.add(giftGroup);


    // --- 4. Objects: Floating Balloons ---
    const balloonColors = [0xffd700, 0xd946ef, 0x86198f, 0xc026d3, 0xffffff];
    const balloonGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const balloonMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.15,
      metalness: 0.3,
      reflectivity: 1,
      clearcoat: 1.0
    });

    const balloons: { mesh: THREE.Group, speed: number, offset: number }[] = [];

    for (let i = 0; i < 40; i++) {
        const group = new THREE.Group();
        
        // Sphere
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const mat = balloonMat.clone();
        mat.color.setHex(color);
        
        const sphere = new THREE.Mesh(balloonGeo, mat);
        sphere.castShadow = true;
        group.add(sphere);

        // String
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.7, 0),
            new THREE.Vector3(0, -2.5, 0)
        ]);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
        group.add(line);

        // Position
        group.position.set(
            (Math.random() - 0.5) * 30, // Random X
            (Math.random() - 0.5) * 40 - 10, // Random Y
            (Math.random() - 0.5) * 20 - 5  // Random Z (mostly behind)
        );

        const scale = 0.5 + Math.random() * 0.8;
        group.scale.setScalar(scale);

        scene.add(group);
        balloons.push({ 
            mesh: group, 
            speed: 0.02 + Math.random() * 0.05,
            offset: Math.random() * 100
        });
    }

    // --- 5. Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleInput = (event: MouseEvent | TouchEvent) => {
        // Prevent default only if necessary, but we want to allow clicks
        let clientX, clientY;
        
        if (event instanceof TouchEvent) {
             clientX = event.touches[0].clientX;
             clientY = event.touches[0].clientY;
        } else {
             clientX = event.clientX;
             clientY = event.clientY;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        // Check intersection with gift box
        const intersects = raycaster.intersectObjects(giftGroup.children, true);
        if (intersects.length > 0) {
            onOpen();
        }
    };

    mountRef.current.addEventListener('click', handleInput);
    mountRef.current.addEventListener('touchstart', handleInput);

    // --- 6. Animation Loop ---
    let frameId: number;
    let time = 0;

    const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.01;

        // Animate Gift
        giftGroup.rotation.y = Math.sin(time) * 0.2;
        giftGroup.rotation.x = Math.cos(time * 0.5) * 0.1;
        giftGroup.position.y = Math.sin(time * 2) * 0.5; // Float

        // Animate Balloons
        balloons.forEach((b, i) => {
            b.mesh.position.y += b.speed;
            b.mesh.position.x += Math.sin(time + b.offset) * 0.01; // Sway
            
            // Reset if too high
            if (b.mesh.position.y > 20) {
                b.mesh.position.y = -20;
                b.mesh.position.x = (Math.random() - 0.5) * 30;
            }
        });

        renderer.render(scene, camera);
    };
    animate();

    // --- 7. Resize ---
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        mountRef.current?.removeEventListener('click', handleInput);
        mountRef.current?.removeEventListener('touchstart', handleInput);
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, [onOpen]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-pointer" />
    </div>
  );
};
