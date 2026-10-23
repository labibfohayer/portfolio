import * as THREE from "three";

export interface InteractiveTarget {
  id: string;
  name: string;
  mesh: THREE.Object3D;
  cameraStage: "overview" | "desk" | "projects" | "shelf" | "contact";
  label: string;
}

/**
 * Procedurally generates a warm dark walnut parquet wood texture
 */
function createParquetFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep rich walnut base
  ctx.fillStyle = "#181310";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 32;
  const plankWidth = 128;

  for (let y = 0; y < 1024; y += plankHeight) {
    const rowOffset = (Math.floor(y / plankHeight) % 2) * (plankWidth / 2);
    for (let x = -plankWidth; x < 1024 + plankWidth; x += plankWidth) {
      const plankX = x + rowOffset;

      const toneVar = Math.sin(x * 12.5 + y * 8.3) * 8;
      const r = Math.min(255, Math.max(0, 36 + toneVar));
      const g = Math.min(255, Math.max(0, 26 + toneVar * 0.8));
      const b = Math.min(255, Math.max(0, 20 + toneVar * 0.6));

      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      ctx.fillRect(plankX + 1, y + 1, plankWidth - 2, plankHeight - 2);

      // Subtle organic wood grain
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      for (let gIdx = 0; gIdx < 4; gIdx++) {
        const grainY = y + 3 + (gIdx * 7) + (Math.sin(plankX + gIdx) * 2);
        ctx.fillRect(plankX + 2, grainY, plankWidth - 4, 1);
      }

      // Plank bevel highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(plankX + 1, y + 1, plankWidth - 2, 1);
    }
  }

  // Seam grooves
  ctx.strokeStyle = "#0d0a08";
  ctx.lineWidth = 1.8;
  for (let y = 0; y <= 1024; y += plankHeight) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Procedural Dhaka midnight skyline with twinkling stars and city lights
 */
function createDhakaNightSkylineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Atmospheric midnight gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 768);
  skyGrad.addColorStop(0, "#010309");
  skyGrad.addColorStop(0.4, "#060d1e");
  skyGrad.addColorStop(0.7, "#0d1830");
  skyGrad.addColorStop(1, "#182542");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 768);

  // Twinkling stars
  for (let i = 0; i < 160; i++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 400;
    const radius = Math.random() * 1.5 + 0.3;
    const alpha = Math.random() * 0.85 + 0.15;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing Crescent Moon
  ctx.save();
  ctx.shadowColor = "#60a5fa";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#f0f9ff";
  ctx.beginPath();
  ctx.arc(760, 130, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(746, 122, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant silhouette layer
  ctx.fillStyle = "#070d1c";
  let distBx = 0;
  while (distBx < 1024) {
    const bw = 24 + Math.random() * 42;
    const bh = 160 + Math.random() * 240;
    ctx.fillRect(distBx, 768 - bh, bw, bh);

    // Warm distant office window dots
    ctx.fillStyle = "rgba(253, 230, 138, 0.45)";
    for (let wy = 768 - bh + 14; wy < 750; wy += 14) {
      for (let wx = distBx + 4; wx < distBx + bw - 4; wx += 8) {
        if (Math.random() > 0.6) {
          ctx.fillRect(wx, wy, 2.5, 3.5);
        }
      }
    }
    ctx.fillStyle = "#070d1c";
    distBx += bw + 4;
  }

  // Midground Dhaka skyline silhouette
  ctx.fillStyle = "#040712";
  let bx = 0;
  let towerCount = 0;
  while (bx < 1024) {
    const bw = 34 + Math.random() * 52;
    const bh = 200 + Math.random() * 340;
    ctx.fillRect(bx, 768 - bh, bw, bh);

    // Rooftop antenna with red warning beacon
    if (towerCount % 3 === 0) {
      ctx.fillStyle = "#020409";
      ctx.fillRect(bx + bw / 2 - 1.5, 768 - bh - 36, 3, 36);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(bx + bw / 2, 768 - bh - 36, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lit office windows
    for (let wy = 768 - bh + 16; wy < 740; wy += 16) {
      for (let wx = bx + 5; wx < bx + bw - 5; wx += 9) {
        if (Math.random() > 0.48) {
          const warm = Math.random() > 0.35;
          ctx.fillStyle = warm ? "rgba(254, 240, 138, 0.9)" : "rgba(186, 230, 253, 0.85)";
          ctx.fillRect(wx, wy, 4, 7);
        }
      }
    }

    ctx.fillStyle = "#040712";
    bx += bw + 6;
    towerCount++;
  }

  // Warm street light ambient wash
  const streetWash = ctx.createLinearGradient(0, 680, 0, 768);
  streetWash.addColorStop(0, "rgba(245, 158, 11, 0)");
  streetWash.addColorStop(1, "rgba(245, 158, 11, 0.35)");
  ctx.fillStyle = streetWash;
  ctx.fillRect(0, 680, 1024, 88);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Apple Magic Keyboard keycaps layout texture
 */
function createKeyboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#e4e4e7";
  ctx.fillRect(0, 0, 512, 180);

  ctx.fillStyle = "#f4f4f5";
  ctx.strokeStyle = "#d4d4d8";
  ctx.lineWidth = 1;

  const rowCount = 5;
  const keyH = 26;
  const keyPadY = 6;

  for (let r = 0; r < rowCount; r++) {
    const y = 8 + r * (keyH + keyPadY);
    const cols = r === 4 ? 8 : 14;
    const totalW = 492;
    const keyW = (totalW - (cols - 1) * 5) / cols;

    for (let c = 0; c < cols; c++) {
      let kw = keyW;
      let kx = 10 + c * (keyW + 5);

      if (r === 4 && c === 3) {
        kw = keyW * 3.2;
      } else if (r === 4 && c > 3 && c < 6) {
        continue;
      }

      ctx.fillStyle = "#fcfcfc";
      ctx.beginPath();
      ctx.roundRect(kx, y, kw, keyH, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#71717a";
      ctx.fillRect(kx + kw / 2 - 2, y + keyH / 2 - 1, 4, 2);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

/**
 * Procedural Smartphone lock screen texture with WhatsApp direct notification
 */
function createSmartphoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#09090b";
  ctx.fillRect(0, 0, 256, 512);

  // Status bar
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("02:45", 22, 28);
  ctx.font = "12px sans-serif";
  ctx.fillText("5G  98%", 192, 28);

  // Dynamic Clock
  ctx.font = "600 48px sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.fillText("02:45", 62, 110);
  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Wednesday, October 23 • Dhaka", 32, 136);

  // WhatsApp Notification Card
  ctx.fillStyle = "#18181b";
  ctx.beginPath();
  ctx.roundRect(14, 180, 228, 110, 16);
  ctx.fill();
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Green WhatsApp badge
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(42, 212, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("W", 36, 217);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("Md. Labib Fohayer", 66, 210);
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "11px sans-serif";
  ctx.fillText("now • WhatsApp", 66, 226);

  ctx.fillStyle = "#e4e4e7";
  ctx.font = "13px sans-serif";
  ctx.fillText("Ready to build something iconic?", 28, 256);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Tap to chat or call →", 28, 276);

  // Action Button
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.roundRect(24, 430, 208, 44, 22);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("Instant Contact", 68, 458);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Procedural Book Spines Texture for Technical Library
 */
function createBookSpinesTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const books = [
    { bg: "#7f1d1d", title: "SYSTEM ARCHITECTURE", author: "FOHAYER" },
    { bg: "#1e3a8a", title: "DISTRIBUTED SYSTEMS", author: "LABIB" },
    { bg: "#064e3b", title: "RUST ENGINE CORE", author: "WEBPULSE" },
    { bg: "#78350f", title: "DATA-INTENSIVE APPS", author: "FOUNDER" },
    { bg: "#312e81", title: "TYPESCRIPT DEEP DIVE", author: "PRODUCTION" },
    { bg: "#1f2937", title: "AI AGENT SWARMS", author: "AUTONOMY" },
  ];

  const spineW = 512 / books.length;
  books.forEach((b, i) => {
    const x = i * spineW;
    ctx.fillStyle = b.bg;
    ctx.fillRect(x, 0, spineW, 256);

    ctx.fillStyle = "#d4af37";
    ctx.fillRect(x + 2, 20, spineW - 4, 3);
    ctx.fillRect(x + 2, 26, spineW - 4, 2);
    ctx.fillRect(x + 2, 230, spineW - 4, 3);

    ctx.save();
    ctx.translate(x + spineW / 2 + 5, 128);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.title, 0, 0);

    ctx.fillStyle = "#d4af37";
    ctx.font = "10px sans-serif";
    ctx.fillText(b.author, 0, 16);
    ctx.restore();
  });

  return new THREE.CanvasTexture(canvas);
}

/**
 * Procedural Delivery Backpack texture with reflective safety bands
 */
function createDeliveryBagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#dc2626";
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "#991b1b";
  ctx.fillRect(0, 400, 512, 112);

  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 140, 512, 34);
  ctx.fillRect(0, 240, 512, 34);

  ctx.fillStyle = "#18181b";
  ctx.fillRect(40, 310, 432, 60);
  ctx.strokeStyle = "#52525b";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 310, 432, 60);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(100, 40, 312, 70);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 40, 312, 70);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.fillText("EXPRESS COURIER RIDER", 256, 70);
  ctx.font = "bold 13px monospace";
  ctx.fillStyle = "#facc15";
  ctx.fillText("#1042 // FOUNDER ORIGIN", 256, 95);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Soft circular radial texture for misty steam wisps
 */
function createSoftRadialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
  grad.addColorStop(0.4, "rgba(255, 255, 255, 0.35)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export function buildRoomScene(
  scene: THREE.Scene,
  textureLoader: THREE.TextureLoader
): {
  interactiveTargets: InteractiveTarget[];
  speakerMesh: THREE.Object3D;
  monitorScreenMesh: THREE.Mesh;
  steamParticles: THREE.Points;
  updateScene: (time: number) => void;
} {
  const interactiveTargets: InteractiveTarget[] = [];
  const roomGroup = new THREE.Group();
  scene.add(roomGroup);

  // =========================================================================
  // 1. ARCHITECTURAL STUDIO LOFT GEOMETRY (6.8m W x 5.6m D x 3.8m H)
  // =========================================================================
  const roomWidth = 6.8;
  const roomDepth = 5.6;
  const roomHeight = 3.8;
  const halfW = roomWidth / 2;
  const halfD = roomDepth / 2;

  // Parquet Hardwood Floor (Satin matte finish: eliminates harsh specular hotspots)
  const floorTexture = createParquetFloorTexture();
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.72,
    metalness: 0.02,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // Walls (Warm Dark Slate Plaster)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x181a20,
    roughness: 0.88,
    metalness: 0.05,
  });

  // Back Wall (Behind Desk & Gallery)
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
  backWall.position.set(0, roomHeight / 2, -halfD);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  // Left Wall (Origin Shelf & Accent lighting)
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
  leftWall.position.set(-halfW, roomHeight / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
  rightWall.position.set(halfW, roomHeight / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  roomGroup.add(rightWall);

  // Baseboard Skirting
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x0c0e12, roughness: 0.6 });
  const backBase = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.14, 0.04), baseboardMat);
  backBase.position.set(0, 0.07, -halfD + 0.02);
  roomGroup.add(backBase);

  const leftBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, roomDepth), baseboardMat);
  leftBase.position.set(-halfW + 0.02, 0.07, 0);
  roomGroup.add(leftBase);

  // Ceiling Exposed Rafters / Loft Beams
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x12141a, roughness: 0.8 });
  for (let bz = -halfD + 1.2; bz <= halfD - 0.5; bz += 1.4) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.18, 0.12), beamMat);
    beam.position.set(0, roomHeight - 0.09, bz);
    roomGroup.add(beam);
  }

  // =========================================================================
  // 2. LARGE ARCHITECTURAL LOFT WINDOW & DHAKA SKYLINE (Back-Left Wall)
  // Window sits at x = -2.25, z = -halfD + 0.02 (In front of wall, perfectly visible!)
  // =========================================================================
  const windowGroup = new THREE.Group();
  windowGroup.position.set(-2.25, 2.15, -halfD + 0.02);
  roomGroup.add(windowGroup);

  const winW = 1.7;
  const winH = 2.6;
  const frameThickness = 0.06;
  const frameDepth = 0.08;
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0d0f14, roughness: 0.35, metalness: 0.8 });

  // 1. Dhaka Midnight Skyline Backdrop (Sitting cleanly inside the window frame)
  const skylineTex = createDhakaNightSkylineTexture();
  const cityBackdropMat = new THREE.MeshBasicMaterial({ map: skylineTex });
  const cityBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), cityBackdropMat);
  cityBackdrop.position.set(0, 0, 0.005);
  windowGroup.add(cityBackdrop);

  // 2. Realistic Physical Window Glass Pane
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.14,
    roughness: 0.04,
    transmission: 0.88,
    ior: 1.52,
    reflectivity: 0.5,
  });
  const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(winW - 0.04, winH - 0.04), glassMat);
  glassPane.position.set(0, 0, 0.025);
  windowGroup.add(glassPane);

  // 3. Window Mullions & Outer Jambs (Hollow architectural casing)
  const topJamb = new THREE.Mesh(new THREE.BoxGeometry(winW, frameThickness, frameDepth), frameMat);
  topJamb.position.set(0, winH / 2 - frameThickness / 2, 0.04);
  windowGroup.add(topJamb);

  const sillMat = new THREE.MeshStandardMaterial({ color: 0x14161d, roughness: 0.4, metalness: 0.6 });
  const bottomSill = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.12, frameThickness * 1.5, frameDepth * 1.5), sillMat);
  bottomSill.position.set(0, -winH / 2 + frameThickness / 2, 0.06);
  windowGroup.add(bottomSill);

  const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, winH, frameDepth), frameMat);
  leftJamb.position.set(-winW / 2 + frameThickness / 2, 0, 0.04);
  windowGroup.add(leftJamb);

  const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, winH, frameDepth), frameMat);
  rightJamb.position.set(winW / 2 - frameThickness / 2, 0, 0.04);
  windowGroup.add(rightJamb);

  const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.03, winH, frameDepth * 0.9), frameMat);
  vMullion.position.set(0, 0, 0.04);
  windowGroup.add(vMullion);

  const hMullion1 = new THREE.Mesh(new THREE.BoxGeometry(winW, 0.03, frameDepth * 0.9), frameMat);
  hMullion1.position.set(0, 0.42, 0.04);
  windowGroup.add(hMullion1);

  const hMullion2 = new THREE.Mesh(new THREE.BoxGeometry(winW, 0.03, frameDepth * 0.9), frameMat);
  hMullion2.position.set(0, -0.42, 0.04);
  windowGroup.add(hMullion2);

  // Subtle, Soft Moonlight Streaming Through Window Panes
  const moonLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
  moonLight.position.set(-2.25, 3.8, -halfD + 1.2);
  moonLight.target.position.set(0.1, 0.75, -0.6);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 1024;
  moonLight.shadow.mapSize.height = 1024;
  moonLight.shadow.radius = 4;
  moonLight.shadow.bias = -0.0005;
  scene.add(moonLight);
  scene.add(moonLight.target);

  // Soft Scandinavian Rug Under Desk
  const rugGeo = new THREE.PlaneGeometry(3.6, 2.6);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0x1a1e28,
    roughness: 0.96,
    metalness: 0.02,
  });
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.1, 0.008, -0.4);
  rug.receiveShadow = true;
  roomGroup.add(rug);

  // =========================================================================
  // 3. THE WORKSTATION: SOLID WALNUT DESK & ERGONOMIC CHAIR
  // =========================================================================
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0.1, 0, -0.6);
  roomGroup.add(deskGroup);

  // American Walnut Slab (2.2m W x 0.95m D x 0.055m H)
  const deskTopGeo = new THREE.BoxGeometry(2.2, 0.055, 0.95);
  const deskTopMat = new THREE.MeshStandardMaterial({
    color: 0x2e1f18,
    roughness: 0.38,
    metalness: 0.06,
  });
  const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
  deskTop.position.set(0, 0.75, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  // Matte Black Steel Trestle Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.3, metalness: 0.85 });
  const legPositions = [
    [-0.95, 0.375, -0.38],
    [0.95, 0.375, -0.38],
    [-0.95, 0.375, 0.38],
    [0.95, 0.375, 0.38],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.75, 0.045), legMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    deskGroup.add(leg);
  });

  const stretcherL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.76), legMat);
  stretcherL.position.set(-0.95, 0.16, 0);
  deskGroup.add(stretcherL);

  const stretcherR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.76), legMat);
  stretcherR.position.set(0.95, 0.16, 0);
  deskGroup.add(stretcherR);

  // Charcoal Felt Desk Pad
  const deskMatMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.008, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x151822, roughness: 0.92 })
  );
  deskMatMesh.position.set(0, 0.782, 0.08);
  deskMatMesh.receiveShadow = true;
  deskGroup.add(deskMatMesh);

  // =========================================================================
  // 4. HARDWARE: APPLE MAC MINI M4 + STUDIO DISPLAY + KEYBOARD + TRACKPAD
  // =========================================================================
  // Apple Mac mini M4
  const macMiniGroup = new THREE.Group();
  macMiniGroup.position.set(-0.65, 0.812, 0.15);
  deskGroup.add(macMiniGroup);

  const macMiniMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.92,
    roughness: 0.22,
  });
  const macMiniMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.055, 0.24), macMiniMat);
  macMiniMesh.castShadow = true;
  macMiniMesh.receiveShadow = true;
  macMiniGroup.add(macMiniMesh);

  // Apple Logo on Top
  const appleLogo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, 0.002, 32),
    new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.96, roughness: 0.08 })
  );
  appleLogo.position.set(0, 0.029, 0);
  macMiniGroup.add(appleLogo);

  // Front Dual USB-C Ports
  const portMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
  const port1 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.005, 0.002), portMat);
  port1.position.set(-0.04, 0, 0.121);
  macMiniGroup.add(port1);

  const port2 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.005, 0.002), portMat);
  port2.position.set(-0.015, 0, 0.121);
  macMiniGroup.add(port2);

  // Breathing White Sleep/Power LED
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ledMesh = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 12, 12), ledMat);
  ledMesh.position.set(0.09, 0, 0.121);
  macMiniGroup.add(ledMesh);

  // Apple Studio Display
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 0.78, -0.15);
  deskGroup.add(monitorGroup);

  const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.01, 0.24), macMiniMat);
  standBase.position.set(0, 0.008, 0);
  standBase.castShadow = true;
  monitorGroup.add(standBase);

  const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 0.03), macMiniMat);
  standArm.position.set(0, 0.22, -0.04);
  standArm.rotation.x = -0.07;
  standArm.castShadow = true;
  monitorGroup.add(standArm);

  const screenChassis = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.7, 0.028), macMiniMat);
  screenChassis.position.set(0, 0.48, 0);
  screenChassis.castShadow = true;
  monitorGroup.add(screenChassis);

  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.13, 0.68, 0.008),
    new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.15 })
  );
  bezel.position.set(0, 0.48, 0.015);
  monitorGroup.add(bezel);

  const camLens = new THREE.Mesh(
    new THREE.CircleGeometry(0.004, 16),
    new THREE.MeshBasicMaterial({ color: 0x0284c7 })
  );
  camLens.position.set(0, 0.81, 0.02);
  monitorGroup.add(camLens);

  // High-Res Screen Texture (VS Code + Terminal)
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1024;
  screenCanvas.height = 640;
  const sctx = screenCanvas.getContext("2d");
  if (sctx) {
    sctx.fillStyle = "#0d1117";
    sctx.fillRect(0, 0, 1024, 640);

    // Sidebar
    sctx.fillStyle = "#161b22";
    sctx.fillRect(0, 0, 200, 640);
    sctx.fillStyle = "#58a6ff";
    sctx.font = "bold 15px monospace";
    sctx.fillText("WEBPULSE CORE", 20, 36);
    sctx.fillStyle = "#8b949e";
    sctx.font = "13px monospace";
    sctx.fillText("📁 src/architecture", 20, 75);
    sctx.fillText("  📄 agent_runtime.ts", 20, 102);
    sctx.fillText("  📄 madrasa_os.py", 20, 128);
    sctx.fillText("  📄 telemetry.rs", 20, 154);
    sctx.fillText("📁 shipped_platforms", 20, 190);
    sctx.fillText("  📄 al_madina.tsx", 20, 216);
    sctx.fillText("  📄 bd_mess.ts", 20, 242);
    sctx.fillText("  📄 ponyopuri.tsx", 20, 268);

    // Top Tab Bar
    sctx.fillStyle = "#21262d";
    sctx.fillRect(200, 0, 824, 40);
    sctx.fillStyle = "#0d1117";
    sctx.fillRect(200, 4, 230, 36);
    sctx.fillStyle = "#58a6ff";
    sctx.font = "bold 14px monospace";
    sctx.fillText("agent_runtime.ts ×", 218, 26);

    const lines = [
      { text: "// Webpulse Autonomous AI Engine v4.2", color: "#8b949e" },
      { text: "import { AutonomousAgent, SwarmCoordinator } from '@webpulse/core';", color: "#ff7b72" },
      { text: "import { MadrasaOS, AlMadinaEngine } from '@/platforms';", color: "#ff7b72" },
      { text: "", color: "" },
      { text: "export class LabibSystemEngine {", color: "#d2a8ff" },
      { text: "  private founder = 'Md. Labib Fohayer';", color: "#79c0ff" },
      { text: "  private mission = 'Eliminate manual business friction';", color: "#79c0ff" },
      { text: "  private status = 'DEPLOYING PRODUCTION PLATFORMS';", color: "#7ee787" },
      { text: "", color: "" },
      { text: "  async executeAutonomousWorkflow(pipelineId: string) {", color: "#d2a8ff" },
      { text: "    const agent = await SwarmCoordinator.spawn({ tier: 'enterprise' });", color: "#c9d1d9" },
      { text: "    return agent.optimizeWorkflow({ latencyMs: 12, uptime: 0.9999 });", color: "#c9d1d9" },
      { text: "  }", color: "#d2a8ff" },
      { text: "}", color: "#d2a8ff" },
    ];

    sctx.font = "16px monospace";
    let ly = 72;
    lines.forEach((l) => {
      if (l.text) {
        sctx.fillStyle = l.color;
        sctx.fillText(l.text, 225, ly);
      }
      ly += 24;
    });

    sctx.fillStyle = "#010409";
    sctx.fillRect(200, 460, 824, 180);
    sctx.fillStyle = "#21262d";
    sctx.fillRect(200, 460, 824, 26);
    sctx.fillStyle = "#8b949e";
    sctx.font = "bold 12px monospace";
    sctx.fillText("TERMINAL  |  zsh  |  Mac mini M4", 220, 478);

    sctx.fillStyle = "#3fb950";
    sctx.font = "14px monospace";
    sctx.fillText("labib@mac-mini-m4:~/webpulse $ bun run dev", 220, 515);
    sctx.fillStyle = "#79c0ff";
    sctx.fillText("[✓] 120 FPS Studio Loft Active. Click monitor to launch interactive terminal.", 220, 545);
    sctx.fillStyle = "#ffa657";
    sctx.fillText("⚡ Systems Online: Webpulse, Madrasa OS, Al-Madina, BD-Mess, Ponyopuri", 220, 575);
  }

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  const monitorScreenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.65),
    new THREE.MeshBasicMaterial({ map: screenTexture })
  );
  monitorScreenMesh.position.set(0, 0.48, 0.02);
  monitorGroup.add(monitorScreenMesh);

  interactiveTargets.push({
    id: "mac_monitor",
    name: "Mac Studio Display",
    mesh: monitorScreenMesh,
    cameraStage: "desk",
    label: "Mac mini M4 & Studio Display (Click to open terminal & skills)",
  });

  const monitorGlow = new THREE.PointLight(0x60a5fa, 1.1, 2.2);
  monitorGlow.position.set(0, 0.48, 0.22);
  monitorGroup.add(monitorGlow);

  // Apple Magic Keyboard with Procedural Keys Texture
  const keyboardTex = createKeyboardTexture();
  const keyboardMat = new THREE.MeshStandardMaterial({
    map: keyboardTex,
    roughness: 0.35,
    metalness: 0.4,
  });
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.012, 0.14), keyboardMat);
  keyboard.position.set(-0.06, 0.792, 0.12);
  keyboard.castShadow = true;
  deskGroup.add(keyboard);

  // Apple Magic Trackpad
  const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.009, 0.13),
    new THREE.MeshStandardMaterial({ color: 0xd8d8db, metalness: 0.88, roughness: 0.22 })
  );
  trackpad.position.set(0.28, 0.792, 0.12);
  trackpad.castShadow = true;
  deskGroup.add(trackpad);

  // =========================================================================
  // 5. ACCESSORIES: WARM ARCHITECT LAMP, RETRO SPEAKER, COFFEE MUG, SMARTPHONE
  // =========================================================================
  // Warm Architect Desk Lamp
  const lampGroup = new THREE.Group();
  lampGroup.position.set(0.85, 0.78, -0.22);
  deskGroup.add(lampGroup);

  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24),
    new THREE.MeshStandardMaterial({ color: 0x161820, metalness: 0.75, roughness: 0.25 })
  );
  lampGroup.add(lampBase);

  const lampArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.45, 12),
    new THREE.MeshStandardMaterial({ color: 0xc49b45, metalness: 0.85, roughness: 0.2 })
  );
  lampArm.position.set(-0.06, 0.2, 0.08);
  lampArm.rotation.z = -0.32;
  lampGroup.add(lampArm);

  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.16, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x161820, metalness: 0.65, roughness: 0.3, side: THREE.DoubleSide })
  );
  lampShade.position.set(-0.18, 0.38, 0.15);
  lampShade.rotation.z = 0.75;
  lampGroup.add(lampShade);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe0a0 })
  );
  bulb.position.set(-0.16, 0.36, 0.14);
  lampGroup.add(bulb);

  // Soft Desk Warm Spotlight (High penumbra to prevent hard cutoff)
  const deskLampLight = new THREE.SpotLight(0xffa638, 3.2, 3.5, Math.PI / 3.8, 0.85, 1.2);
  deskLampLight.position.set(-0.18, 0.36, 0.15);
  deskLampLight.target.position.set(-0.35, 0, 0.32);
  deskLampLight.castShadow = true;
  deskLampLight.shadow.bias = -0.001;
  lampGroup.add(deskLampLight);
  lampGroup.add(deskLampLight.target);

  // Retro Desktop Speaker
  const speakerGroup = new THREE.Group();
  speakerGroup.position.set(-0.85, 0.81, -0.15);
  deskGroup.add(speakerGroup);

  const speakerCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.18, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x3d271a, roughness: 0.45, metalness: 0.08 })
  );
  speakerCabinet.castShadow = true;
  speakerGroup.add(speakerCabinet);

  const speakerFront = new THREE.Mesh(
    new THREE.PlaneGeometry(0.21, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.92 })
  );
  speakerFront.position.set(0, 0, 0.081);
  speakerGroup.add(speakerFront);

  const knob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.015, 16),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
  );
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.06, 0.045, 0.086);
  speakerGroup.add(knob);

  interactiveTargets.push({
    id: "speaker",
    name: "Lo-Fi Speaker",
    mesh: speakerCabinet,
    cameraStage: "desk",
    label: "Lo-Fi Desktop Speaker (Click to Toggle Chill Music)",
  });

  // Ceramic Coffee Mug with Open Rim, Crema Liquid & Side Handle
  const mugGroup = new THREE.Group();
  mugGroup.position.set(0.62, 0.812, 0.22);
  deskGroup.add(mugGroup);

  const mugMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.04, side: THREE.DoubleSide });
  
  // Open-ended outer cylinder wall
  const mugWall = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.09, 24, 1, true), mugMat);
  mugWall.castShadow = true;
  mugGroup.add(mugWall);

  // Closed bottom
  const mugBottom = new THREE.Mesh(new THREE.CircleGeometry(0.038, 24), mugMat);
  mugBottom.rotation.x = Math.PI / 2;
  mugBottom.position.y = -0.045;
  mugGroup.add(mugBottom);

  // Rounded top rim torus
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.003, 12, 24), mugMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.045;
  mugGroup.add(rim);

  // Curved Handle (Angled towards viewer)
  const handleGeo = new THREE.TorusGeometry(0.026, 0.006, 12, 24, Math.PI);
  const handle = new THREE.Mesh(handleGeo, mugMat);
  handle.rotation.z = Math.PI / 2;
  handle.rotation.y = -Math.PI / 3;
  handle.position.set(0.042, 0.005, 0.02);
  mugGroup.add(handle);

  // Dark espresso coffee with golden crema ring
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.042, 24),
    new THREE.MeshStandardMaterial({ color: 0x271406, roughness: 0.12 })
  );
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.032; // Sits 13mm below the rim
  mugGroup.add(coffee);

  const crema = new THREE.Mesh(
    new THREE.RingGeometry(0.028, 0.042, 24),
    new THREE.MeshStandardMaterial({ color: 0x925222, roughness: 0.35 })
  );
  crema.rotation.x = -Math.PI / 2;
  crema.position.y = 0.0325;
  mugGroup.add(crema);

  // Rising Soft Misty Steam Wisps
  const steamGeo = new THREE.BufferGeometry();
  const steamCount = 35;
  const steamPositions = new Float32Array(steamCount * 3);
  for (let i = 0; i < steamCount; i++) {
    steamPositions[i * 3] = (Math.random() - 0.5) * 0.035;
    steamPositions[i * 3 + 1] = 0.05 + Math.random() * 0.25;
    steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
  }
  steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
  
  const steamTexture = createSoftRadialTexture();
  const steamParticles = new THREE.Points(
    steamGeo,
    new THREE.PointsMaterial({
      map: steamTexture,
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    })
  );
  mugGroup.add(steamParticles);

  // Smartphone with Titanium Frame & WhatsApp Lockscreen
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(0.52, 0.792, 0.08);
  phoneGroup.rotation.y = -0.22;
  deskGroup.add(phoneGroup);

  const phoneBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.092, 0.01, 0.174),
    new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.94, roughness: 0.2 })
  );
  phoneBody.castShadow = true;
  phoneGroup.add(phoneBody);

  const phoneScreenTex = createSmartphoneTexture();
  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.082, 0.162),
    new THREE.MeshBasicMaterial({ map: phoneScreenTex })
  );
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.y = 0.006;
  phoneGroup.add(phoneScreen);

  interactiveTargets.push({
    id: "smartphone",
    name: "Labib's Smartphone",
    mesh: phoneBody,
    cameraStage: "contact",
    label: "Direct Contact Hotline (WhatsApp, Email & Schedule Meeting)",
  });

  // Ergonomic Mesh Office Chair
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0.1, 0, 0.12);
  chairGroup.rotation.y = Math.PI;
  roomGroup.add(chairGroup);

  const chairMat = new THREE.MeshStandardMaterial({ color: 0x181a22, roughness: 0.85 });
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.48), chairMat);
  chairSeat.position.set(0, 0.48, 0);
  chairGroup.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 0.04), chairMat);
  chairBack.position.set(0, 0.82, -0.22);
  chairBack.rotation.x = 0.06;
  chairGroup.add(chairBack);

  const chairStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.44, 16),
    new THREE.MeshStandardMaterial({ color: 0x222225, metalness: 0.85, roughness: 0.25 })
  );
  chairStem.position.set(0, 0.22, 0);
  chairGroup.add(chairStem);

  for (let a = 0; a < 5; a++) {
    const angle = (a * Math.PI * 2) / 5;
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.02, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x1b1c22, metalness: 0.8 })
    );
    spoke.position.set(Math.sin(angle) * 0.13, 0.03, Math.cos(angle) * 0.13);
    spoke.rotation.y = angle;
    chairGroup.add(spoke);
  }

  // =========================================================================
  // 6. THE WALL OF PROJECTS: SALON GALLERY (Feature Wall, ZERO Window Overlap!)
  // Perfectly positioned from x = -0.45 to x = +2.55
  // =========================================================================
  const projectsData = [
    // Top Row (3 Frames)
    {
      id: "webpulse",
      title: "Webpulse Automation System",
      category: "Autonomous Multi-Agent AI Core",
      image: "/projects/webpulse.png",
      pos: [-0.45, 2.72, -halfD + 0.04],
      size: [1.22, 0.74],
    },
    {
      id: "al_madina",
      title: "Al Madina Model Madrasa",
      category: "1,200+ Student Institutional Management",
      image: "/projects/al-madina.png",
      pos: [1.05, 2.72, -halfD + 0.04],
      size: [1.22, 0.74],
    },
    {
      id: "madrasa_os",
      title: "Madrasa OS Platform",
      category: "Multi-Tenant Cloud SaaS Architecture",
      image: "/projects/madrasa-os.png",
      pos: [2.55, 2.72, -halfD + 0.04],
      size: [1.22, 0.74],
    },
    // Bottom Row (2 Frames flanking monitor right)
    {
      id: "bd_mess",
      title: "BD Mess Automation",
      category: "Cross-Platform Meal & Accounts App",
      image: "/projects/bd-mess.jpg",
      pos: [0.3, 1.62, -halfD + 0.04],
      size: [1.22, 0.74],
    },
    {
      id: "ponyopuri",
      title: "Ponyopuri E-Commerce",
      category: "Modern High-Performance Online Store",
      image: "/projects/ponyopuri.png",
      pos: [1.8, 1.62, -halfD + 0.04],
      size: [1.22, 0.74],
    },
  ];

  projectsData.forEach((proj) => {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(proj.pos[0], proj.pos[1], proj.pos[2]);
    roomGroup.add(frameGroup);

    const [width, height] = proj.size;

    const outerFrame = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.08, height + 0.08, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.35, metalness: 0.5 })
    );
    outerFrame.castShadow = true;
    frameGroup.add(outerFrame);

    const matBoard = new THREE.Mesh(
      new THREE.PlaneGeometry(width + 0.02, height + 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
    );
    matBoard.position.z = 0.016;
    frameGroup.add(matBoard);

    const artMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.04,
      emissive: 0xffffff,
      emissiveIntensity: 0.36,
    });

    textureLoader.load(proj.image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      artMat.map = tex;
      artMat.emissiveMap = tex;
      artMat.needsUpdate = true;
    });

    const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.04, height - 0.04), artMat);
    artMesh.position.z = 0.017;
    frameGroup.add(artMesh);

    const lightBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, width * 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    lightBar.rotation.z = Math.PI / 2;
    lightBar.position.set(0, height / 2 + 0.09, 0.12);
    frameGroup.add(lightBar);

    const frameSpot = new THREE.SpotLight(0xfff3e0, 2.4, 2.8, Math.PI / 4, 0.65, 1.2);
    frameSpot.position.set(proj.pos[0], proj.pos[1] + 0.6, proj.pos[2] + 0.5);
    frameSpot.target.position.set(proj.pos[0], proj.pos[1], proj.pos[2]);
    scene.add(frameSpot.target);
    scene.add(frameSpot);

    interactiveTargets.push({
      id: `project_${proj.id}`,
      name: proj.title,
      mesh: outerFrame,
      cameraStage: "projects",
      label: `Framed Project: ${proj.title} (Click to inspect case study)`,
    });
  });

  // =========================================================================
  // 7. THE ORIGIN SHELF: BIKER HELMET, DELIVERY GEAR & TECH BOOKS (Left Wall)
  // Commemorating Md. Labib Fohayer's journey from food courier rider to tech founder
  // =========================================================================
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-halfW + 0.04, 1.85, -0.4);
  shelfGroup.rotation.y = Math.PI / 2;
  roomGroup.add(shelfGroup);

  const oakMat = new THREE.MeshStandardMaterial({ color: 0x3d271a, roughness: 0.45, metalness: 0.08 });

  // Top Shelf
  const topShelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.045, 0.38), oakMat);
  topShelf.position.set(0, 0.65, 0);
  shelfGroup.add(topShelf);

  // Bottom Shelf
  const bottomShelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.045, 0.38), oakMat);
  bottomShelf.position.set(0, 0, 0);
  shelfGroup.add(bottomShelf);

  // Metal Shelf Support Wall Brackets
  const bracketMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.4, metalness: 0.85 });
  [-0.85, 0.85].forEach((bx) => {
    const bTop = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.36), bracketMat);
    bTop.position.set(bx, 0.56, -0.01);
    shelfGroup.add(bTop);

    const bBot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.36), bracketMat);
    bBot.position.set(bx, -0.09, -0.01);
    shelfGroup.add(bBot);
  });

  // Top Shelf: Technical Hardcover Books
  const bookSpineTex = createBookSpinesTexture();
  const bookSpinesMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.28, 0.22),
    new THREE.MeshStandardMaterial({ map: bookSpineTex, roughness: 0.5 })
  );
  bookSpinesMesh.position.set(-0.5, 0.81, 0);
  shelfGroup.add(bookSpinesMesh);

  const leanBook = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.28, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 })
  );
  leanBook.position.set(-0.08, 0.81, 0);
  leanBook.rotation.z = -0.22;
  shelfGroup.add(leanBook);

  const bookend = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.18, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
  );
  bookend.position.set(-0.02, 0.74, 0);
  shelfGroup.add(bookend);

  // Founder Certificate Plaque (Gold Frame + Parchment)
  const certFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.32, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.92, roughness: 0.22 })
  );
  certFrame.position.set(0.55, 0.82, -0.06);
  certFrame.rotation.y = -0.15;
  shelfGroup.add(certFrame);

  const certPaper = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.28),
    new THREE.MeshStandardMaterial({ color: 0xfefce8, roughness: 0.8 })
  );
  certPaper.position.set(0.55, 0.82, -0.048);
  certPaper.rotation.y = -0.15;
  shelfGroup.add(certPaper);

  // Bottom Shelf: Authentic Full-Face Biker Helmet
  const helmetGroup = new THREE.Group();
  helmetGroup.position.set(-0.4, 0.2, 0);
  shelfGroup.add(helmetGroup);

  const helmetShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 28),
    new THREE.MeshPhysicalMaterial({
      color: 0x090b10,
      roughness: 0.08,
      metalness: 0.65,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })
  );
  helmetShell.scale.set(1.0, 1.08, 1.25);
  helmetShell.castShadow = true;
  helmetGroup.add(helmetShell);

  const chinBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.16, 0.12, 24, 1, false, -Math.PI / 3, (Math.PI * 2) / 3),
    new THREE.MeshStandardMaterial({ color: 0x090b10, roughness: 0.2, metalness: 0.6 })
  );
  chinBar.position.set(0, -0.08, 0.12);
  chinBar.rotation.y = Math.PI / 2;
  helmetGroup.add(chinBar);

  const visorMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.182, 28, 20, 0, Math.PI, Math.PI / 3.8, Math.PI / 2.2),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      metalness: 0.95,
      roughness: 0.04,
      transparent: true,
      opacity: 0.94,
    })
  );
  visorMesh.scale.set(1.01, 1.06, 1.28);
  visorMesh.rotation.x = -Math.PI / 2;
  visorMesh.position.set(0, 0.015, 0.018);
  helmetGroup.add(visorMesh);

  [-0.185, 0.185].forEach((px) => {
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.008, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(px, 0.02, 0.02);
    helmetGroup.add(pivot);
  });

  // Authentic Courier Delivery Backpack
  const bagTex = createDeliveryBagTexture();
  const deliveryBagMat = new THREE.MeshStandardMaterial({
    map: bagTex,
    roughness: 0.75,
    metalness: 0.05,
  });
  const deliveryBag = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.32, 0.24), deliveryBagMat);
  deliveryBag.position.set(0.42, 0.16, 0);
  deliveryBag.rotation.y = -0.16;
  deliveryBag.castShadow = true;
  shelfGroup.add(deliveryBag);

  interactiveTargets.push({
    id: "origin_shelf",
    name: "The Origin Shelf",
    mesh: helmetShell,
    cameraStage: "shelf",
    label: "Origin Shelf: Rider to Tech Founder (Click to Read Authentic Journey)",
  });

  // Concealed LED Warm Strip Under Top Shelf (Illuminates Helmet & Bag with zero floor spill!)
  const shelfLED = new THREE.PointLight(0xffeedd, 1.8, 1.2);
  shelfLED.position.set(0, 0.62, 0.1);
  shelfGroup.add(shelfLED);

  // Focused Studio Spotlight on the Shelf with Narrow Angle (Zero floor leakage!)
  const shelfSpot = new THREE.SpotLight(0xffeedd, 3.6, 2.5, Math.PI / 5, 0.6, 1.2);
  shelfSpot.position.set(-2.0, 2.2, -0.4);
  shelfSpot.target.position.set(-halfW + 0.04, 2.1, -0.4);
  scene.add(shelfSpot.target);
  scene.add(shelfSpot);

  // =========================================================================
  // 8. INDOOR LOFT PLANT (Monstera in Corner)
  // =========================================================================
  const plantGroup = new THREE.Group();
  plantGroup.position.set(-1.5, 0, -1.8);
  roomGroup.add(plantGroup);

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.16, 0.44, 24),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 })
  );
  pot.position.y = 0.22;
  pot.castShadow = true;
  plantGroup.add(pot);

  const soil = new THREE.Mesh(
    new THREE.CircleGeometry(0.21, 24),
    new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 })
  );
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.43;
  plantGroup.add(soil);

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });
  const leafAngles = [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6];
  leafAngles.forEach((ang, i) => {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.4 + (i % 3) * 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0x14532d })
    );
    stem.position.set(Math.sin(ang) * 0.08, 0.44 + (0.4 + (i % 3) * 0.1) / 2, Math.cos(ang) * 0.08);
    stem.rotation.y = ang;
    stem.rotation.z = 0.25;
    plantGroup.add(stem);

    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.36), leafMat);
    leaf.position.set(Math.sin(ang) * 0.24, 0.72 + (i % 3) * 0.08, Math.cos(ang) * 0.24);
    leaf.rotation.y = ang + Math.PI / 2;
    leaf.rotation.x = 0.45;
    plantGroup.add(leaf);
  });

  // =========================================================================
  // 9. CEILING PENDANT LAMP, GALLERY TRACK LIGHT & AMBIENT HARMONY
  // =========================================================================
  const galleryTrackLight = new THREE.DirectionalLight(0xfff3e0, 2.0);
  galleryTrackLight.position.set(1.0, 3.6, -1.0);
  galleryTrackLight.target.position.set(1.0, 2.2, -halfD);
  scene.add(galleryTrackLight.target);
  scene.add(galleryTrackLight);

  const pendantGroup = new THREE.Group();
  pendantGroup.position.set(0.1, roomHeight - 0.05, -0.6);
  roomGroup.add(pendantGroup);

  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x050505 })
  );
  cord.position.y = -0.3;
  pendantGroup.add(cord);

  const pendantShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.18, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.88, roughness: 0.22, side: THREE.DoubleSide })
  );
  pendantShade.position.y = -0.6;
  pendantGroup.add(pendantShade);

  const pendantLight = new THREE.PointLight(0xffdfa9, 2.2, 4.2);
  pendantLight.position.y = -0.65;
  pendantGroup.add(pendantLight);

  // Balanced Studio Loft Ambient (Harmonious warm-cool balance)
  const ambientLight = new THREE.AmbientLight(0x282320, 1.6);
  scene.add(ambientLight);

  // Warm Ground Bounce Ambient (Softly unifies floor, walnut furniture & walls)
  const warmBounceLight = new THREE.HemisphereLight(0x28303f, 0x302016, 1.1);
  scene.add(warmBounceLight);

  // Architectural Corner Sconce Accent (Warm perimeter glow)
  const cornerSconce = new THREE.PointLight(0xffeedd, 1.2, 4.5);
  cornerSconce.position.set(-3.1, 2.9, 1.2);
  scene.add(cornerSconce);

  // =========================================================================
  // 10. ANIMATION LOOP (Steam Wisps & Breathing Mac mini LED)
  // =========================================================================
  const updateScene = (time: number) => {
    const positions = steamGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < steamCount; i++) {
      positions[i * 3 + 1] += 0.0011;
      positions[i * 3] += Math.sin(time * 2.8 + i) * 0.00018;
      if (positions[i * 3 + 1] > 0.3) {
        positions[i * 3 + 1] = 0.05;
        positions[i * 3] = (Math.random() - 0.5) * 0.035;
      }
    }
    steamGeo.attributes.position.needsUpdate = true;

    const pulse = 0.82 + Math.sin(time * 2.2) * 0.18;
    ledMat.color.setRGB(pulse, pulse, 1.0);
  };

  return {
    interactiveTargets,
    speakerMesh: speakerCabinet,
    monitorScreenMesh,
    steamParticles,
    updateScene,
  };
}
