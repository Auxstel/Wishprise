import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Landing3D: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- Scene Setup ---
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped at 1.5 for performance
        mountRef.current.appendChild(renderer.domElement);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffd700, 1.2);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        const purpleLight = new THREE.PointLight(0xd946ef, 1.5, 20);
        purpleLight.position.set(-5, 5, 5);
        scene.add(purpleLight);

        // --- 1. Floating Balloons (Optimized) ---
        const balloonGroup = new THREE.Group();
        scene.add(balloonGroup);

        // Shared Geometry and base material for performance
        const balloonGeo = new THREE.SphereGeometry(1, 16, 16); 
        const baseBalloonMat = new THREE.MeshStandardMaterial({
            roughness: 0.1,
            metalness: 0.3,
        });

        const balloonColors = [0xFFD700, 0xD946EF, 0xFF69B4, 0x8A2BE2, 0x00BFFF, 0xFF4500, 0x32CD32];
        const balloons: { mesh: THREE.Group, speed: number, offset: number }[] = [];

        // Balanced count (70) for visual density without lagging
        for (let i = 0; i < 70; i++) {
            const group = new THREE.Group();

            // Balloon Body
            const mat = baseBalloonMat.clone();
            mat.color.setHex(balloonColors[i % balloonColors.length]);
            const mesh = new THREE.Mesh(balloonGeo, mat);
            mesh.scale.set(1, 1.15, 1);
            group.add(mesh);

            // String
            const stringLen = 4 + Math.random() * 4;
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(Math.sin(i) * 0.2, -stringLen * 0.5, 0),
                new THREE.Vector3(0, -stringLen, 0)
            ]);
            const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
            group.add(line);

            // Spatially distributed
            const x = (Math.random() - 0.5) * 60;
            const y = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 40 - 15;
            group.position.set(x, y, z);

            const s = 0.5 + Math.random() * 1.2;
            group.scale.setScalar(s);

            balloonGroup.add(group);
            balloons.push({
                mesh: group,
                speed: 0.01 + Math.random() * 0.03,
                offset: Math.random() * 100
            });
        }

        // --- 2. Confetti System (Simplified) ---
        const confettiCount = 150; // Halved
        const confettiGeo = new THREE.PlaneGeometry(0.12, 0.2);
        const confettiMat = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            vertexColors: true
        });
        const confettiMesh = new THREE.InstancedMesh(confettiGeo, confettiMat, confettiCount);
        scene.add(confettiMesh);

        const dummy = new THREE.Object3D();
        const colors = new Float32Array(confettiCount * 3);
        const cPalette = [new THREE.Color(0xFFD700), new THREE.Color(0xFF69B4), new THREE.Color(0x00FFFF)];

        const confettiData: { velocity: THREE.Vector3, rotSpeed: THREE.Vector3 }[] = [];

        for (let i = 0; i < confettiCount; i++) {
            dummy.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20);
            dummy.updateMatrix();
            confettiMesh.setMatrixAt(i, dummy.matrix);

            const col = cPalette[Math.floor(Math.random() * cPalette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;

            confettiData.push({
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.03, -0.04 - Math.random() * 0.04, 0),
                rotSpeed: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, 0)
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

            balloons.forEach(b => {
                b.mesh.position.y += b.speed;
                b.mesh.rotation.z = Math.sin(time + b.offset) * 0.1;
                
                if (b.mesh.position.y > 35) {
                    b.mesh.position.y = -35;
                    b.mesh.position.x = (Math.random() - 0.5) * 60;
                }
            });

            for (let i = 0; i < confettiCount; i++) {
                confettiMesh.getMatrixAt(i, dummy.matrix);
                dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                dummy.position.add(confettiData[i].velocity);
                dummy.rotation.x += confettiData[i].rotSpeed.x;
                dummy.rotation.y += confettiData[i].rotSpeed.y;

                if (dummy.position.y < -30) {
                    dummy.position.y = 35;
                    dummy.position.x = (Math.random() - 0.5) * 40;
                }

                dummy.updateMatrix();
                confettiMesh.setMatrixAt(i, dummy.matrix);
            }
            confettiMesh.instanceMatrix.needsUpdate = true;

            // Simple parallax
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.02;
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

    return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
