import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ExperienceStep } from '../types';

interface ImmersiveSceneProps {
  step: ExperienceStep;
  onInteract?: () => void;
  explosionTrigger?: number; // Increments to trigger a blast
}

export const ImmersiveScene: React.FC<ImmersiveSceneProps> = ({ step, onInteract, explosionTrigger = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef(explosionTrigger);

  useEffect(() => {
    if (!mountRef.current) return;

    // Define cleanup variables
    let boxGeo: THREE.BoxGeometry | null = null;
    let boxMat: THREE.MeshPhysicalMaterial | null = null;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Deep fog for depth
    scene.fog = new THREE.FogExp2(0x020617, 0.02);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xd946ef, 2, 20); 
    pointLight.position.set(2, 5, 5);
    scene.add(pointLight);

    // --- Objects Container ---
    const world = new THREE.Group();
    scene.add(world);

    // --- GLOBAL: GALAXY BACKGROUND ---
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
        
        // Gold (#FFD700) and Purple (#D946EF) mix
        const isGold = Math.random() > 0.6;
        if (isGold) {
            colors[i] = 1; colors[i+1] = 0.84; colors[i+2] = 0;
        } else {
            colors[i] = 0.85; colors[i+1] = 0.27; colors[i+2] = 0.93;
        }
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    const galaxy = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(galaxy);

    // --- MODE: LANDING (Gift Box & Ribbon) ---
    const giftGroup = new THREE.Group();
    
    if (step === ExperienceStep.LANDING) {
        // Gift Box
        boxGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        boxMat = new THREE.MeshPhysicalMaterial({ color: 0x701a75, roughness: 0.2, metalness: 0.6 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        giftGroup.add(box);

        // Ribbon
        const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
        const r1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 0.4), ribbonMat);
        const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.6, 2.6), ribbonMat);
        giftGroup.add(r1, r2);
        
        // Only add gift to world if all balloons popped? 
        // Logic handled in parent: The ImmersiveScene shows the box if step is LANDING. 
        // The parent controls visibility of DOM elements over it.
        // We'll scale the box down initially or keep it there.
        world.add(giftGroup);
    }

    // --- MODE: BREATHING / INTRO (Pulsing Orb) ---
    const orbGroup = new THREE.Group();
    // We want the orb for INTRO and CHECK
    if (step === ExperienceStep.INTERACTIVE_CHECK || step === ExperienceStep.INTRO_ANIMATION) {
        // Outer Wireframe
        const orbGeo = new THREE.IcosahedronGeometry(2.5, 2);
        const orbMat = new THREE.MeshBasicMaterial({ 
            color: 0xD946EF, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orbGroup.add(orb);
        
        // Inner Glow Sphere
        const innerGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.1 });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        orbGroup.add(inner);

        // Particles swirling around orb
        const ringGeo = new THREE.BufferGeometry();
        const ringCount = 200;
        const ringPos = new Float32Array(ringCount * 3);
        for(let i=0; i<ringCount; i++){
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 0.5;
            ringPos[i*3] = Math.cos(angle) * radius;
            ringPos[i*3+1] = (Math.random() - 0.5) * 1;
            ringPos[i*3+2] = Math.sin(angle) * radius;
        }
        ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
        const ringMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6 });
        const ring = new THREE.Points(ringGeo, ringMat);
        orbGroup.add(ring);

        world.add(orbGroup);
    }

    // --- FIREWORKS SYSTEM ---
    const fireworks: { mesh: THREE.Points, velocity: THREE.Vector3[], life: number }[] = [];
    const launchFirework = (colorHex?: number) => {
        const pCount = 200;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(pCount * 3);
        const col = new Float32Array(pCount * 3);
        const velocities: THREE.Vector3[] = [];
        
        // Random start position near center (or spread out)
        const startX = (Math.random() - 0.5) * 8;
        const startY = (Math.random() - 0.5) * 4;
        
        const baseColor = new THREE.Color(colorHex || (Math.random() > 0.5 ? 0xFFD700 : 0xD946EF));

        for(let i=0; i<pCount; i++) {
            pos[i*3] = startX;
            pos[i*3+1] = startY;
            pos[i*3+2] = (Math.random() - 0.5) * 4;
            
            col[i*3] = baseColor.r;
            col[i*3+1] = baseColor.g;
            col[i*3+2] = baseColor.b;

            // Explosion velocity
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const speed = 0.1 + Math.random() * 0.2;
            
            velocities.push(new THREE.Vector3(
                speed * Math.sin(phi) * Math.cos(theta),
                speed * Math.sin(phi) * Math.sin(theta),
                speed * Math.cos(phi)
            ));
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        
        const mat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true });
        const mesh = new THREE.Points(geo, mat);
        scene.add(mesh);
        fireworks.push({ mesh, velocity: velocities, life: 1.0 });
    };

    // --- Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleInput = (e: MouseEvent | TouchEvent) => {
        if (!onInteract) return;
        // Simple hit test could go here, but we rely on prop changes mostly for balloons
        onInteract();
    };
    mountRef.current.addEventListener('click', handleInput);


    // --- Animation Loop ---
    let frameId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.01;

        // Animate Galaxy
        galaxy.rotation.y += 0.0003;
        galaxy.rotation.x = mouseY * 0.02; 
        galaxy.rotation.y += mouseX * 0.02;

        // Animate Gift
        if (giftGroup.children.length > 0) {
            giftGroup.rotation.y = Math.sin(time) * 0.1;
            giftGroup.rotation.x = Math.sin(time * 0.5) * 0.05;
            giftGroup.position.y = Math.sin(time * 1.5) * 0.2;
        }

        // Animate Orb
        if (orbGroup.children.length > 0) {
            // Breathing scale
            const scale = 1 + Math.sin(time * 1.5) * 0.1; 
            orbGroup.scale.setScalar(scale);
            
            // Rotation
            orbGroup.rotation.y += 0.002;
            orbGroup.rotation.z += 0.001;

            // Pulse inner core opacity
            const inner = orbGroup.children[1] as THREE.Mesh;
            (inner.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 3) * 0.05;
        }

        // Check for explosion trigger
        if (explosionTrigger !== triggerRef.current) {
            triggerRef.current = explosionTrigger;
            // Launch a few fireworks per trigger
            launchFirework();
            launchFirework();
            launchFirework(0xFFFFFF);
        }

        // Animate Fireworks
        // Also random fireworks during REVEAL
        if (step === ExperienceStep.REVEAL && Math.random() < 0.03) launchFirework();
            
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            fw.life -= 0.015; // Fade out
            const positions = fw.mesh.geometry.attributes.position.array as Float32Array;
            
            for(let j=0; j<fw.velocity.length; j++) {
                positions[j*3] += fw.velocity[j].x;
                positions[j*3+1] += fw.velocity[j].y;
                positions[j*3+2] += fw.velocity[j].z;
                
                // Gravity
                fw.velocity[j].y -= 0.003;
                // Drag
                fw.velocity[j].multiplyScalar(0.99);
            }
            fw.mesh.geometry.attributes.position.needsUpdate = true;
            (fw.mesh.material as THREE.PointsMaterial).opacity = fw.life;

            if (fw.life <= 0) {
                scene.remove(fw.mesh);
                fw.mesh.geometry.dispose();
                fireworks.splice(i, 1);
            }
        }

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
        mountRef.current?.removeEventListener('click', handleInput);
        document.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
        boxGeo?.dispose(); boxMat?.dispose();
        particlesGeometry.dispose(); particlesMaterial.dispose();
    };
  }, [step, onInteract, explosionTrigger]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};