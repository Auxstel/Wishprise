import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CakeFlavor, CakeStyle } from '../types';
import { CAKE_COLORS, POPPER_SOUND_URL } from '../constants';

interface CakeProps {
  flavor: CakeFlavor;
  style?: CakeStyle; 
  candles: number;
  candlesLit: boolean;
  isCut: boolean;
  onCut: () => void;
  senderName?: string;
  receiverName?: string;
}

export const Cake: React.FC<CakeProps> = ({ 
  flavor, 
  style = CakeStyle.CLASSIC, 
  candles, 
  candlesLit, 
  isCut, 
  onCut, 
  receiverName 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sliceGroupRef = useRef<THREE.Group | null>(null);
  const knifeGroupRef = useRef<THREE.Group | null>(null);
  const flamesRef = useRef<THREE.PointLight[]>([]);
  const poppersRef = useRef<{ left: THREE.Group, right: THREE.Group } | null>(null);
  const confettiRef = useRef<{ mesh: THREE.Mesh, velocity: THREE.Vector3, rotSpeed: THREE.Vector3 }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ref to store multiple characters
  const clappersRef = useRef<THREE.Group[]>([]);
  
  const isDragging = useRef(false);
  const dragPlane = useRef<THREE.Mesh | null>(null);

  // Helper to create text texture
  const createPlaqueTexture = (text: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#3E2723'; 
        ctx.fillRect(0, 0, 512, 256);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, 492, 236);
        ctx.font = 'bold 60px "Dancing Script", cursive';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = text.split('\n');
        const lineHeight = 70;
        const startY = 128 - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
            ctx.fillText(line, 256, startY + (i * lineHeight));
        });
    }
    return new THREE.CanvasTexture(canvas);
  };

  // Helper: Create Party Character
  const createPartyCharacter = (x: number, z: number, colorIndex: number) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const shirtColors = [0xD946EF, 0x00BFFF, 0xFF69B4, 0x32CD32, 0xFFA500, 0x9370DB, 0xF44336, 0xFFEB3B, 0x009688, 0x795548];
      const pantsColors = [0x4A148C, 0x1A237E, 0x01579B, 0x1B5E20, 0x3E2723, 0x212121];

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFD1AA, roughness: 0.3 }); 
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColors[colorIndex % shirtColors.length], roughness: 0.5 }); 
      const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColors[colorIndex % pantsColors.length], roughness: 0.6 }); 
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.8 }); 

      const headGroup = new THREE.Group();
      headGroup.position.y = 1.7;
      const face = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), skinMat);
      
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 0.75), hairMat);
      hair.position.y = 0.35;
      
      const eyeGeo = new THREE.SphereGeometry(0.08);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.15, 0.05, 0.35);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.15, 0.05, 0.35);
      
      const smile = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 8, 16, Math.PI), eyeMat);
      smile.rotation.z = Math.PI;
      smile.position.set(0, -0.1, 0.35);

      headGroup.add(face, hair, eyeL, eyeR, smile);
      group.add(headGroup);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.5), shirtMat);
      body.position.y = 0.85;
      group.add(body);

      const armGeo = new THREE.BoxGeometry(0.2, 0.9, 0.2);
      const lArmGroup = new THREE.Group();
      lArmGroup.position.set(-0.55, 1.3, 0); 
      const lArmMesh = new THREE.Mesh(armGeo, shirtMat);
      lArmMesh.position.y = -0.4; 
      const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), skinMat);
      lHand.position.y = -0.9;
      lArmGroup.add(lArmMesh, lHand);
      group.add(lArmGroup);

      const rArmGroup = new THREE.Group();
      rArmGroup.position.set(0.55, 1.3, 0); 
      const rArmMesh = new THREE.Mesh(armGeo, shirtMat);
      rArmMesh.position.y = -0.4; 
      const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), skinMat);
      rHand.position.y = -0.9;
      rArmGroup.add(rArmMesh, rHand);
      group.add(rArmGroup);

      const legGeo = new THREE.BoxGeometry(0.25, 1.0, 0.3);
      const lLeg = new THREE.Mesh(legGeo, pantsMat);
      lLeg.position.set(-0.2, -0.15, 0);
      const rLeg = new THREE.Mesh(legGeo, pantsMat);
      rLeg.position.set(0.2, -0.15, 0);
      group.add(lLeg, rLeg);

      group.userData = { lArm: lArmGroup, rArm: rArmGroup, head: headGroup, body: body, colorIndex };
      return group;
  };

  // Helper: Create Realistic 3D Popper (Canister)
  const createPopper = (color: number) => {
      const group = new THREE.Group();
      
      // Canister Body
      const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 32);
      const bodyMat = new THREE.MeshStandardMaterial({ 
          color: color, 
          roughness: 0.3, 
          metalness: 0.4 
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0;
      group.add(body);

      // Gold Decorative Band
      const bandGeo = new THREE.CylinderGeometry(0.205, 0.205, 0.2, 32);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.y = -0.2;
      group.add(band);

      // Top Nozzle (Dark interior)
      const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
      const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
      nozzle.position.y = 0.42;
      group.add(nozzle);

      // Pull String
      const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const string = new THREE.Mesh(stringGeo, stringMat);
      string.position.y = -0.55;
      group.add(string);

      // Ring on string
      const ringGeo = new THREE.TorusGeometry(0.05, 0.01, 8, 16);
      const ring = new THREE.Mesh(ringGeo, stringMat);
      ring.position.y = -0.7;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      return group;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Audio Setup ---
    audioRef.current = new Audio(POPPER_SOUND_URL);
    audioRef.current.volume = 0.6;

    // --- Scene & Camera ---
    const width = mountRef.current.clientWidth || 300;
    const height = mountRef.current.clientHeight || 300;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.SoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const rimLight = new THREE.SpotLight(0xffd700, 2);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // --- Drag Plane ---
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 1.5;
    scene.add(plane);
    dragPlane.current = plane;

    // --- Materials ---
    const flavorColor = new THREE.Color(CAKE_COLORS[flavor]);
    const spongeMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xf5e6c8).lerp(flavorColor, 0.2), roughness: 0.9 });
    const icingMaterial = new THREE.MeshStandardMaterial({ color: flavorColor, roughness: 0.4, metalness: 0.1 });
    const creamMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFF0, roughness: 0.3, metalness: 0.1 });
    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.3 });

    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Plate
    const isSquareStyle = style === CakeStyle.MODERN || style === CakeStyle.TIERED_SQUARE;
    const plateGeo = isSquareStyle ? new THREE.BoxGeometry(6, 0.2, 6) : new THREE.CylinderGeometry(3.5, 3.5, 0.2, 64);
    const plateMesh = new THREE.Mesh(plateGeo, plateMaterial);
    plateMesh.position.y = -0.6;
    plateMesh.receiveShadow = true;
    cakeGroup.add(plateMesh);

    // --- CAKE GEOMETRY FACTORY ---
    const cakeH = 1.5;
    const cakeR = 2.5;
    const sliceAngle = Math.PI / 4;
    const mainGroup = new THREE.Group();
    cakeGroup.add(mainGroup);

    // Common Slice Logic vars
    let mainMesh: THREE.Object3D | null = null;
    let sliceMesh: THREE.Object3D | null = null;
    
    // We construct based on style
    if (style === CakeStyle.HEART) {
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo( x + 2.5, y + 2.5 );
        heartShape.bezierCurveTo( x + 2.5, y + 2.5, x + 2.0, y, x, y );
        heartShape.bezierCurveTo( x - 3.0, y, x - 3.0, y + 3.5,x - 3.0, y + 3.5 );
        heartShape.bezierCurveTo( x - 3.0, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5 );
        heartShape.bezierCurveTo( x + 6.5, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5 );
        heartShape.bezierCurveTo( x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y );
        heartShape.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );

        const extrudeSettings = { depth: cakeH, bevelEnabled: false };
        const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        geo.center(); // Center the heart
        // Since Extrude creates it lying on Z, rotate
        geo.rotateX(Math.PI / 2);

        if (!isCut) {
            mainMesh = new THREE.Mesh(geo, icingMaterial);
            mainGroup.add(mainMesh);
        } else {
             // Split Heart roughly 
             mainMesh = new THREE.Mesh(geo, icingMaterial);
             mainMesh.scale.set(0.8, 1, 1);
             mainMesh.position.x = -0.5;
             mainGroup.add(mainMesh);

             sliceMesh = new THREE.Mesh(geo.clone(), icingMaterial);
             sliceMesh.scale.set(0.2, 1, 0.5);
             sliceMesh.position.set(1.5, 0, 1);
        }
    } else if (style === CakeStyle.HEXAGON) {
        const geo = new THREE.CylinderGeometry(cakeR, cakeR, cakeH, 6);
        if(!isCut) {
            mainMesh = new THREE.Mesh(geo, icingMaterial);
            mainGroup.add(mainMesh);
        } else {
            // Cut logic
            mainMesh = new THREE.Mesh(new THREE.CylinderGeometry(cakeR, cakeR, cakeH, 6, 1, false, sliceAngle, Math.PI*2-sliceAngle), icingMaterial);
            mainGroup.add(mainMesh);
            sliceMesh = new THREE.Mesh(new THREE.CylinderGeometry(cakeR, cakeR, cakeH, 6, 1, false, 0, sliceAngle), icingMaterial);
        }
    } else if (style === CakeStyle.BUNDT) { // Ring
        const geo = new THREE.TorusGeometry(2, 0.8, 16, 32);
        geo.rotateX(Math.PI/2);
        geo.translate(0, cakeH/2, 0);
        if(!isCut) {
            mainMesh = new THREE.Mesh(geo, icingMaterial);
            mainGroup.add(mainMesh);
        } else {
             mainMesh = new THREE.Mesh(new THREE.TorusGeometry(2, 0.8, 16, 32, Math.PI*1.8), icingMaterial);
             mainMesh.rotation.x = Math.PI/2;
             mainMesh.position.y = cakeH/2;
             mainMesh.rotation.z = 0.5;
             mainGroup.add(mainMesh);

             sliceMesh = new THREE.Mesh(new THREE.TorusGeometry(2, 0.8, 16, 10, 0.5), icingMaterial);
             sliceMesh.rotation.x = Math.PI/2;
             sliceMesh.position.y = cakeH/2;
        }
    } else if (style === CakeStyle.PILLOW) {
        // Rounded box
        const sGeo = new THREE.SphereGeometry(2.5, 32, 32);
        sGeo.scale(1, 0.4, 1);
        sGeo.translate(0, 0.5, 0);
        if(!isCut) {
             mainMesh = new THREE.Mesh(sGeo, icingMaterial);
             mainGroup.add(mainMesh);
        } else {
             mainMesh = new THREE.Mesh(sGeo, icingMaterial);
             mainMesh.scale.x = 0.8;
             mainMesh.position.x = -0.5;
             mainGroup.add(mainMesh);
             sliceMesh = new THREE.Mesh(sGeo.clone(), icingMaterial);
             sliceMesh.scale.set(0.2, 0.4, 1);
             sliceMesh.position.x = 2;
        }
    } else if (style === CakeStyle.SPHERE) {
         const geo = new THREE.SphereGeometry(2.2, 32, 32);
         if(!isCut) {
             mainMesh = new THREE.Mesh(geo, icingMaterial);
             mainMesh.position.y = 1.5;
             mainGroup.add(mainMesh);
         } else {
             mainMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32, 0, Math.PI*1.6), icingMaterial);
             mainMesh.position.y = 1.5;
             mainMesh.rotation.y = 0.5;
             mainGroup.add(mainMesh);
             
             sliceMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16, 0, 0.8), icingMaterial);
             sliceMesh.position.y = 1.5;
         }
    } else if (style === CakeStyle.TOWER) {
        // 3 Tiers
        const b = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 32), icingMaterial);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 32), icingMaterial);
        m.position.y = 1;
        const t = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 1, 32), icingMaterial);
        t.position.y = 2;
        
        if (!isCut) {
            const g = new THREE.Group();
            g.add(b, m, t);
            mainMesh = g;
            mainGroup.add(mainMesh);
        } else {
             // Just slice the bottom for visual
             const bCut = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 32, 1, false, sliceAngle, Math.PI*2-sliceAngle), icingMaterial);
             const g = new THREE.Group();
             g.add(bCut, m, t);
             mainGroup.add(g);
             sliceMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 32, 1, false, 0, sliceAngle), icingMaterial);
        }
    } else if (style === CakeStyle.TIERED_SQUARE) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1, 4.5), icingMaterial);
        const t = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), icingMaterial);
        t.position.y = 1;
        if (!isCut) {
            const g = new THREE.Group();
            g.add(b, t);
            mainMesh = g;
            mainGroup.add(mainMesh);
        } else {
            // Simple block cut visual
            b.scale.set(0.8, 1, 1);
            b.position.x = -0.5;
            const g = new THREE.Group();
            g.add(b, t);
            mainGroup.add(g);
            
            sliceMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), icingMaterial);
            sliceMesh.position.set(2, 0, 0);
        }
    } else if (style === CakeStyle.MODERN) { // Square
         if(!isCut){
             mainMesh = new THREE.Mesh(new THREE.BoxGeometry(4.5, cakeH, 4.5), icingMaterial);
             mainGroup.add(mainMesh);
         } else {
             mainMesh = new THREE.Mesh(new THREE.BoxGeometry(3.5, cakeH, 4.5), icingMaterial);
             mainMesh.position.x = -0.5;
             mainGroup.add(mainMesh);
             sliceMesh = new THREE.Mesh(new THREE.BoxGeometry(1, cakeH, 2), icingMaterial);
             sliceMesh.position.set(2, 0, 1);
         }
    } else if (style === CakeStyle.GRAND) { // 2 Tier Round
         const b = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 1.5, 32), icingMaterial);
         const t = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.5, 32), icingMaterial);
         t.position.y = 1.5;
         if(!isCut){
             const g = new THREE.Group(); g.add(b,t); mainMesh=g; mainGroup.add(g);
         } else {
             const bCut = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 1.5, 32, 1, false, sliceAngle, Math.PI*2-sliceAngle), icingMaterial);
             const g = new THREE.Group(); g.add(bCut, t); mainGroup.add(g);
             sliceMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 1.5, 32, 1, false, 0, sliceAngle), icingMaterial);
         }
    } else {
        // CLASSIC
        const geo = new THREE.CylinderGeometry(cakeR, cakeR, cakeH, 40);
        if (!isCut) {
            mainMesh = new THREE.Mesh(geo, icingMaterial);
            mainGroup.add(mainMesh);
        } else {
            mainMesh = new THREE.Mesh(new THREE.CylinderGeometry(cakeR, cakeR, cakeH, 40, 1, false, sliceAngle, Math.PI * 2 - sliceAngle), icingMaterial);
            mainGroup.add(mainMesh);
            sliceMesh = new THREE.Mesh(new THREE.CylinderGeometry(cakeR, cakeR, cakeH, 40, 1, false, 0, sliceAngle), icingMaterial);
        }
    }

    if (sliceMesh) {
        const g = new THREE.Group();
        g.add(sliceMesh);
        const dollop = new THREE.Mesh(new THREE.SphereGeometry(0.2), creamMaterial);
        dollop.position.set(1, cakeH/2, 1); 
        if(style === CakeStyle.CLASSIC) dollop.position.set(cakeR*0.6*Math.cos(sliceAngle/2), cakeH/2, cakeR*0.6*Math.sin(sliceAngle/2));
        g.add(dollop);
        cakeGroup.add(g);
        sliceGroupRef.current = g;
    }

    // --- PLAQUE ---
    const plaqueTex = createPlaqueTexture(`Happy Birthday\n${receiverName || "You"}`);
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 1), new THREE.MeshStandardMaterial({ map: plaqueTex }));
    plaque.position.set(0, (style === CakeStyle.TOWER ? 3 : (style === CakeStyle.GRAND ? 3 : cakeH + 0.05)), 1.5);
    plaque.rotation.x = -0.2;
    mainGroup.add(plaque);


    // --- CANDLES ---
    if (!isCut) {
        const candlesGroup = new THREE.Group();
        let yPos = cakeH;
        if(style === CakeStyle.GRAND) yPos = 3;
        if(style === CakeStyle.TOWER) yPos = 3;
        if(style === CakeStyle.SPHERE) yPos = 3.5;
        
        candlesGroup.position.y = yPos;
        cakeGroup.add(candlesGroup);
        flamesRef.current = [];
        
        for (let i = 0; i < candles; i++) {
            const x = (i-(candles-1)/2) * 0.4;
            const cw = new THREE.Group();
            cw.position.set(x, 0, 0);
            const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8), new THREE.MeshStandardMaterial({ color: 0xFF69B4 }));
            cw.add(wax);
            
            const flameG = new THREE.Group();
            flameG.position.y = 0.5;
            const fLight = new THREE.PointLight(0xffaa00, 1, 3);
            flameG.add(fLight);
            flameG.add(new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffaa00 })));
            flameG.visible = candlesLit;
            flamesRef.current.push(fLight);
            (flameG as any).isFlame = true;
            cw.add(flameG);
            candlesGroup.add(cw);
        }
    }

    // --- 10 PARTY CHARACTERS ---
    clappersRef.current = [];
    const positions = [
        { x: -5, z: -5 }, { x: -4, z: -4.5 }, { x: -3, z: -4 }, { x: -1.5, z: -3.5 }, { x: -0.5, z: -3.5 },
        { x: 0.5, z: -3.5 }, { x: 1.5, z: -3.5 }, { x: 3, z: -4 }, { x: 4, z: -4.5 }, { x: 5, z: -5 }
    ];
    positions.forEach((pos, i) => {
        const char = createPartyCharacter(pos.x, pos.z, i);
        char.lookAt(0, 0, 0);
        char.visible = !candlesLit || isCut;
        scene.add(char);
        clappersRef.current.push(char);
    });

    // --- REAL 3D POPPERS (Confetti Cannons) ---
    // Create left and right poppers
    const popperL = createPopper(0xFF4081); // Pink Canister
    const popperR = createPopper(0x40C4FF); // Blue Canister
    
    // Position them off to the sides
    popperL.position.set(-4, -5, 2); // Start hidden below
    popperR.position.set(4, -5, 2);
    
    // Angle them towards center up
    popperL.rotation.z = -Math.PI / 4;
    popperR.rotation.z = Math.PI / 4;

    scene.add(popperL);
    scene.add(popperR);
    poppersRef.current = { left: popperL, right: popperR };

    // --- Knife ---
    const knife = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2), new THREE.MeshStandardMaterial({ color: 0x5D4037 }));
    handle.rotation.z = Math.PI/2; handle.position.x = -1; knife.add(handle);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.05), new THREE.MeshStandardMaterial({ color: 0xE0E0E0, metalness: 0.9, roughness: 0.2 }));
    blade.position.x = 0.5; knife.add(blade);
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 2), new THREE.MeshBasicMaterial({ visible: false }));
    knife.add(hitBox);
    knife.position.set(3.5, 2, 2); knife.rotation.y = -Math.PI/4;
    
    if(!candlesLit && !isCut) scene.add(knife);
    knifeGroupRef.current = knife;

    // --- Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersects = (event: MouseEvent | TouchEvent, objects: THREE.Object3D[]) => {
        const rect = renderer.domElement.getBoundingClientRect();
        let clientX, clientY;
        if (event instanceof TouchEvent) {
             clientX = event.touches[0].clientX;
             clientY = event.touches[0].clientY;
        } else {
             clientX = (event as MouseEvent).clientX;
             clientY = (event as MouseEvent).clientY;
        }
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        return raycaster.intersectObjects(objects, true);
    };

    const handleStart = (event: MouseEvent | TouchEvent) => {
        if (isCut || !knifeGroupRef.current) return;
        const intersects = getIntersects(event, [knifeGroupRef.current]);
        if (intersects.length > 0) {
             isDragging.current = true;
             if (mountRef.current) mountRef.current.style.cursor = 'grabbing';
        }
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
        if (isDragging.current && !isCut && dragPlane.current && knifeGroupRef.current) {
            const intersects = getIntersects(event, [dragPlane.current]);
            if (intersects.length > 0) {
                const p = intersects[0].point;
                knifeGroupRef.current.position.set(p.x, 2, p.z);
                knifeGroupRef.current.rotation.z = -0.2;
                if (Math.sqrt(p.x * p.x + p.z * p.z) < 1.5) {
                    onCut();
                    isDragging.current = false;
                    if (mountRef.current) mountRef.current.style.cursor = 'default';
                }
            }
        }
    };
    const handleEnd = () => { isDragging.current = false; if(mountRef.current) mountRef.current.style.cursor = 'default'; };
    
    if(mountRef.current) {
        const el = mountRef.current;
        el.addEventListener('mousedown', handleStart); el.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleEnd);
        el.addEventListener('touchstart', handleStart); el.addEventListener('touchmove', handleMove); window.addEventListener('touchend', handleEnd);
    }

    // --- Animation Loop ---
    let frameId: number;
    let time = 0;
    
    const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.05;

        // Flames
        flamesRef.current.forEach((l, i) => {
            if(l.parent && l.parent.visible) l.intensity = 0.8 + Math.sin(time*10+i)*0.2;
            if(l.parent) l.parent.visible = candlesLit;
        });

        // Cut Animation
        if(isCut && sliceGroupRef.current) {
            sliceGroupRef.current.position.x += 0.02;
            sliceGroupRef.current.position.z += 0.02;
        }

        // POPPER ANIMATION
        if(isCut && poppersRef.current) {
             const { left, right } = poppersRef.current;
             // Animate them popping up
             left.position.y = THREE.MathUtils.lerp(left.position.y, 0, 0.1);
             right.position.y = THREE.MathUtils.lerp(right.position.y, 0, 0.1);
             
             // Trigger particles once they are up-ish
             if (left.position.y > -1 && confettiRef.current.length === 0) {
                 // Play Sound immediately
                 if(audioRef.current && audioRef.current.paused) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.log('Audio error:', e));
                 }

                 // Spawn Particles (Rectangular confetti)
                 for(let i=0; i<150; i++) {
                     // Rectangular geometry for confetti
                     const confGeo = new THREE.PlaneGeometry(0.08, 0.15);
                     const confMat = new THREE.MeshBasicMaterial({ 
                         color: Math.random() * 0xffffff, 
                         side: THREE.DoubleSide 
                     });
                     
                     // Left Source
                     const m = new THREE.Mesh(confGeo, confMat);
                     m.position.copy(left.position);
                     m.position.y += 0.5; // Top of popper
                     
                     // Velocity: Shoots towards center (Right-ish) and Up
                     // Left popper at x=-4. Target x=0.
                     const v = new THREE.Vector3(
                         0.5 + Math.random() * 1.5, // +X direction
                         3 + Math.random() * 2.5,   // +Y Up
                         (Math.random() - 0.5) * 2  // Z Spread
                     );
                     
                     // Rotation Speed
                     const rot = new THREE.Vector3(
                         Math.random() * 0.2, 
                         Math.random() * 0.2, 
                         Math.random() * 0.2
                     );

                     confettiRef.current.push({ mesh: m, velocity: v, rotSpeed: rot });
                     scene.add(m);

                     // Right Source
                     const m2 = new THREE.Mesh(confGeo.clone(), confMat.clone());
                     m2.position.copy(right.position);
                     m2.position.y += 0.5;
                     
                     // Velocity: Shoots towards center (Left-ish) and Up
                     const v2 = new THREE.Vector3(
                         -0.5 - Math.random() * 1.5, // -X direction
                         3 + Math.random() * 2.5,
                         (Math.random() - 0.5) * 2
                     );
                     
                     confettiRef.current.push({ mesh: m2, velocity: v2, rotSpeed: rot });
                     scene.add(m2);
                 }
             }

             // Animate Particles
             for (let i = confettiRef.current.length - 1; i >= 0; i--) {
                 const p = confettiRef.current[i];
                 p.mesh.position.add(p.velocity); 
                 
                 // Drag
                 p.velocity.multiplyScalar(0.96);
                 // Gravity
                 p.velocity.y -= 0.1; 
                 
                 // Spin
                 p.mesh.rotation.x += p.rotSpeed.x;
                 p.mesh.rotation.y += p.rotSpeed.y;
                 p.mesh.rotation.z += p.rotSpeed.z;

                 if(p.mesh.position.y < -5) {
                     scene.remove(p.mesh);
                     confettiRef.current.splice(i, 1);
                 }
             }
        }

        // Characters
        clappersRef.current.forEach((char, i) => {
             char.visible = !candlesLit || isCut;
             if(char.visible) {
                 const { lArm, rArm } = char.userData;
                 const offset = i * 0.5;
                 if(isCut) {
                     // CHEER
                     lArm.rotation.x = Math.PI; rArm.rotation.x = Math.PI;
                     lArm.rotation.z = Math.sin(time*8+offset)*0.5; rArm.rotation.z = -Math.sin(time*8+offset)*0.5;
                     char.position.y = Math.abs(Math.sin(time*6+offset))*0.4;
                 } else {
                     // CLAP
                     lArm.rotation.x = -Math.PI/2; rArm.rotation.x = -Math.PI/2;
                     lArm.rotation.z = 0.3 + Math.sin(time*12+offset)*0.3; rArm.rotation.z = -0.3 - Math.sin(time*12+offset)*0.3;
                 }
             }
        });

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if(mountRef.current) mountRef.current.innerHTML = '';
        renderer.dispose();
    };
  }, [flavor, style, candles, candlesLit, isCut]);

  return (
    <div className="relative w-full h-full min-h-[300px]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing outline-none" />
        {!candlesLit && !isCut && (
             <div className="absolute bottom-4 w-full text-center pointer-events-none animate-pulse">
                <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-white/20">
                    👆 Grab the knife and drag to cake center!
                </span>
             </div>
        )}
    </div>
  );
};