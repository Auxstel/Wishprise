import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Landing3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd700, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0xd946ef, 1, 10);
    purpleLight.position.set(-5, 0, 5);
    scene.add(purpleLight);

    // --- 1. Floating Balloons ---
    const balloonGroup = new THREE.Group();
    scene.add(balloonGroup);

    const balloonGeo = new THREE.SphereGeometry(1, 32, 32);
    const balloonMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1
    });

    const balloonColors = [0xFFD700, 0xD946EF, 0xFF69B4, 0x8A2BE2, 0x00BFFF];
    const balloons: { mesh: THREE.Group, speed: number, offset: number }[] = [];

    // Create 15 balloons
    for (let i = 0; i < 15; i++) {
        const group = new THREE.Group();
        
        // Balloon Body
        const mat = balloonMat.clone();
        mat.color.setHex(balloonColors[i % balloonColors.length]);
        const mesh = new THREE.Mesh(balloonGeo, mat);
        // Squash slightly
        mesh.scale.set(1, 1.1, 1);
        group.add(mesh);

        // String
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(Math.sin(i)*0.2, -3, Math.cos(i)*0.2),
            new THREE.Vector3(0, -4.5, 0)
        ]);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
        group.add(line);

        // Initial Position (spread out)
        const x = (Math.random() - 0.5) * 18;
        const y = (Math.random() - 0.5) * 10 - 5;
        const z = (Math.random() - 0.5) * 10 - 2;
        group.position.set(x, y, z);
        
        // Random scale
        const s = 0.8 + Math.random() * 0.5;
        group.scale.setScalar(s);

        balloonGroup.add(group);
        balloons.push({ 
            mesh: group, 
            speed: 0.01 + Math.random() * 0.02, 
            offset: Math.random() * 100 
        });
    }

    // --- 2. Confetti System ---
    const confettiCount = 300;
    const confettiGeo = new THREE.PlaneGeometry(0.12, 0.25);
    const confettiMat = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.7,
        vertexColors: true
    });
    const confettiMesh = new THREE.InstancedMesh(confettiGeo, confettiMat, confettiCount);
    scene.add(confettiMesh);

    const dummy = new THREE.Object3D();
    const colors = new Float32Array(confettiCount * 3);
    const cPalette = [new THREE.Color(0xFFD700), new THREE.Color(0xC0C0C0), new THREE.Color(0xFF69B4), new THREE.Color(0x00FFFF)];
    
    // Physics data for confetti
    const confettiData: { velocity: THREE.Vector3, rotSpeed: THREE.Vector3 }[] = [];

    for (let i = 0; i < confettiCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 25, Math.random() * 20 - 5, (Math.random() - 0.5) * 10);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.updateMatrix();
        confettiMesh.setMatrixAt(i, dummy.matrix);

        const col = cPalette[Math.floor(Math.random() * cPalette.length)];
        colors[i*3] = col.r;
        colors[i*3+1] = col.g;
        colors[i*3+2] = col.b;

        confettiData.push({
            velocity: new THREE.Vector3((Math.random()-0.5)*0.05, -0.02 - Math.random()*0.05, (Math.random()-0.5)*0.02),
            rotSpeed: new THREE.Vector3(Math.random()*0.1, Math.random()*0.1, Math.random()*0.1)
        });
    }
    confettiMesh.instanceMatrix.needsUpdate = true;
    confettiGeo.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));


    // --- Animation Loop ---
    let frameId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.01;

        // Animate Balloons (Float Up & Bob)
        balloons.forEach(b => {
            b.mesh.position.y += b.speed;
            b.mesh.rotation.z = Math.sin(time + b.offset) * 0.1; // Gentle sway
            b.mesh.rotation.y += 0.005;

            // Reset when out of view
            if (b.mesh.position.y > 10) {
                b.mesh.position.y = -10;
                b.mesh.position.x = (Math.random() - 0.5) * 18;
            }
        });

        // Animate Confetti (Fall & Tumble)
        for (let i = 0; i < confettiCount; i++) {
            confettiMesh.getMatrixAt(i, dummy.matrix);
            dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

            dummy.position.add(confettiData[i].velocity);
            dummy.rotation.x += confettiData[i].rotSpeed.x;
            dummy.rotation.y += confettiData[i].rotSpeed.y;

            // Reset
            if (dummy.position.y < -10) {
                dummy.position.y = 12;
                dummy.position.x = (Math.random() - 0.5) * 25;
            }

            dummy.updateMatrix();
            confettiMesh.setMatrixAt(i, dummy.matrix);
        }
        confettiMesh.instanceMatrix.needsUpdate = true;

        // Slight Camera Parallax
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
