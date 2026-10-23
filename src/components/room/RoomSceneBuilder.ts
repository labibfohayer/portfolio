import * as THREE from "three";

export interface InteractiveTarget {
  id: string;
  name: string;
  mesh: THREE.Object3D;
  cameraStage: "overview" | "desk" | "projects" | "shelf" | "contact";
  label: string;
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

  // =========================================================================
  // 1. ROOM ARCHITECTURE (Floor, Walls, Ceiling, Window, Rug)
  // =========================================================================
  const roomGroup = new THREE.Group();
  scene.add(roomGroup);

  // --- Floor (Polished Dark Hardwood Parquet) ---
  const floorGeo = new THREE.PlaneGeometry(14, 14);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x141210, // Dark walnut
    roughness: 0.35,
    metalness: 0.15,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // Base Floor Grid Lines for architectural depth
  const gridHelper = new THREE.GridHelper(14, 28, 0x222222, 0x181818);
  gridHelper.position.y = 0.005;
  roomGroup.add(gridHelper);

  // --- Back Wall (Main Gallery Wall with Window) ---
  const backWallGeo = new THREE.PlaneGeometry(14, 7);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x0f1115, // Dark slate charcoal
    roughness: 0.85,
    metalness: 0.05,
  });
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 3.5, -5);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  // --- Left Side Wall (The Origin Shelf Wall) ---
  const leftWallGeo = new THREE.PlaneGeometry(14, 7);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
  leftWall.position.set(-7, 3.5, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  // --- Right Side Wall ---
  const rightWallGeo = new THREE.PlaneGeometry(14, 7);
  const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
  rightWall.position.set(7, 3.5, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  roomGroup.add(rightWall);

  // --- Baseboards (Dark wood trim along floor) ---
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.5 });
  const backTrim = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 0.08), trimMat);
  backTrim.position.set(0, 0.1, -4.95);
  roomGroup.add(backTrim);

  const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 14), trimMat);
  leftTrim.position.set(-6.95, 0.1, 0);
  roomGroup.add(leftTrim);

  // --- Large Midnight Window (Back Wall Left Side) ---
  const windowGroup = new THREE.Group();
  windowGroup.position.set(-3.2, 3.6, -4.94);
  roomGroup.add(windowGroup);

  // Window Frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.4, metalness: 0.6 });
  const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.8, 0.12), frameMat);
  windowGroup.add(outerFrame);

  // Window Panes (Semi-transparent glass)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    transparent: true,
    opacity: 0.25,
    roughness: 0.1,
    transmission: 0.8,
    ior: 1.5,
  });
  const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 3.5), glassMat);
  glassPane.position.z = 0.05;
  windowGroup.add(glassPane);

  // Window Mullions (Dividers)
  const vertMullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.6, 0.14), frameMat);
  vertMullion.position.z = 0.05;
  windowGroup.add(vertMullion);

  const horizMullion = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.06, 0.14), frameMat);
  horizMullion.position.z = 0.05;
  windowGroup.add(horizMullion);

  // Outside Night Backdrop (Distant City & Starfield)
  const cityBackdropGeo = new THREE.PlaneGeometry(6.5, 5.0);
  const cityCanvas = document.createElement("canvas");
  cityCanvas.width = 512;
  cityCanvas.height = 384;
  const cctx = cityCanvas.getContext("2d");
  if (cctx) {
    // Midnight Sky Gradient
    const skyGrad = cctx.createLinearGradient(0, 0, 0, 384);
    skyGrad.addColorStop(0, "#030712");
    skyGrad.addColorStop(0.65, "#0b1528");
    skyGrad.addColorStop(1, "#111827");
    cctx.fillStyle = skyGrad;
    cctx.fillRect(0, 0, 512, 384);

    // Stars
    cctx.fillStyle = "#ffffff";
    for (let i = 0; i < 70; i++) {
      const sx = Math.random() * 512;
      const sy = Math.random() * 220;
      const sRadius = Math.random() * 1.2;
      cctx.globalAlpha = Math.random() * 0.8 + 0.2;
      cctx.beginPath();
      cctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      cctx.fill();
    }
    cctx.globalAlpha = 1.0;

    // Distant City Skyline Silhouettes
    cctx.fillStyle = "#050811";
    let bx = 0;
    while (bx < 512) {
      const bw = 16 + Math.random() * 28;
      const bh = 50 + Math.random() * 110;
      cctx.fillRect(bx, 384 - bh, bw, bh);

      // Random warm city windows
      cctx.fillStyle = "#ffdd88";
      for (let wy = 384 - bh + 10; wy < 370; wy += 12) {
        for (let wx = bx + 3; wx < bx + bw - 3; wx += 7) {
          if (Math.random() > 0.6) {
            cctx.globalAlpha = Math.random() * 0.7 + 0.3;
            cctx.fillRect(wx, wy, 2.5, 4);
          }
        }
      }
      cctx.globalAlpha = 1.0;
      cctx.fillStyle = "#050811";
      bx += bw + 3;
    }
  }
  const cityTexture = new THREE.CanvasTexture(cityCanvas);
  const cityMat = new THREE.MeshBasicMaterial({ map: cityTexture });
  const cityBackdrop = new THREE.Mesh(cityBackdropGeo, cityMat);
  cityBackdrop.position.set(-3.2, 3.6, -5.3);
  roomGroup.add(cityBackdrop);

  // --- Floor Rug (Under Workstation) ---
  const rugGeo = new THREE.PlaneGeometry(5.2, 4.2);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0x1e2029, // Deep slate rug
    roughness: 0.95,
    metalness: 0.05,
  });
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.6, 0.01, 0.4);
  rug.receiveShadow = true;
  roomGroup.add(rug);

  // Subtle Rug Border
  const rugBorderMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
  const rugBorder = new THREE.Mesh(new THREE.BoxGeometry(5.24, 0.015, 4.24), rugBorderMat);
  rugBorder.position.set(0.6, 0.007, 0.4);
  roomGroup.add(rugBorder);

  // =========================================================================
  // 2. THE WORKSTATION (Solid Walnut Desk, Steel Legs, Desk Mat)
  // =========================================================================
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0.6, 0, 0.2);
  roomGroup.add(deskGroup);

  // Desk Surface (Warm Walnut)
  const deskTopGeo = new THREE.BoxGeometry(3.2, 0.09, 1.6);
  const deskTopMat = new THREE.MeshStandardMaterial({
    color: 0x241812, // Walnut wood
    roughness: 0.45,
    metalness: 0.1,
  });
  const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
  deskTop.position.set(0, 1.45, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  // Desk Legs (Matte Black Minimalist Steel Trestle)
  const legMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.3, metalness: 0.8 });
  const legPositions = [
    [-1.45, 0.725, -0.65],
    [1.45, 0.725, -0.65],
    [-1.45, 0.725, 0.65],
    [1.45, 0.725, 0.65],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.45, 16), legMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    deskGroup.add(leg);
  });

  // Desk Mat (Felt Wool Dark Pad)
  const deskMatGeo = new THREE.BoxGeometry(2.0, 0.012, 0.85);
  const deskMatMaterial = new THREE.MeshStandardMaterial({ color: 0x16171d, roughness: 0.9 });
  const deskMat = new THREE.Mesh(deskMatGeo, deskMatMaterial);
  deskMat.position.set(0, 1.505, 0.08);
  deskMat.receiveShadow = true;
  deskGroup.add(deskMat);

  // =========================================================================
  // 3. HARDWARE: APPLE MAC MINI M4 + STUDIO DISPLAY + KEYBOARD + MOUSE
  // =========================================================================
  // --- Apple Mac mini M4 ---
  const macMiniGroup = new THREE.Group();
  macMiniGroup.position.set(-0.85, 1.54, 0.25);
  deskGroup.add(macMiniGroup);

  // Unibody Aluminum Casing (Compact rounded square: 12.7cm x 12.7cm x 5cm)
  const macMiniGeo = new THREE.BoxGeometry(0.32, 0.08, 0.32);
  const macMiniMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Apple Silver Aluminum
    metalness: 0.88,
    roughness: 0.25,
  });
  const macMiniMesh = new THREE.Mesh(macMiniGeo, macMiniMat);
  macMiniMesh.castShadow = true;
  macMiniMesh.receiveShadow = true;
  macMiniGroup.add(macMiniMesh);

  // Dark Apple Logo on top
  const appleLogoGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.002, 32);
  const appleLogoMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
  const appleLogo = new THREE.Mesh(appleLogoGeo, appleLogoMat);
  appleLogo.position.set(0, 0.041, 0);
  macMiniGroup.add(appleLogo);

  // Front White Power Indicator LED (Glowing)
  const ledGeo = new THREE.SphereGeometry(0.005, 12, 12);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.position.set(0.12, 0, 0.161);
  macMiniGroup.add(ledMesh);

  // --- Apple Studio Display / Pro Display XDR ---
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 1.5, -0.2);
  deskGroup.add(monitorGroup);

  // Aluminum Stand Base & Upright
  const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.32), macMiniMat);
  standBase.position.set(0, 0.01, 0);
  standBase.castShadow = true;
  monitorGroup.add(standBase);

  const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.04), macMiniMat);
  standArm.position.set(0, 0.3, -0.05);
  standArm.rotation.x = -0.08;
  standArm.castShadow = true;
  monitorGroup.add(standArm);

  // Display Chassis (Back)
  const screenChassisGeo = new THREE.BoxGeometry(1.4, 0.85, 0.04);
  const screenChassis = new THREE.Mesh(screenChassisGeo, macMiniMat);
  screenChassis.position.set(0, 0.65, 0);
  screenChassis.castShadow = true;
  monitorGroup.add(screenChassis);

  // Display Screen Bezel
  const bezelGeo = new THREE.BoxGeometry(1.37, 0.82, 0.01);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(0, 0.65, 0.02);
  monitorGroup.add(bezel);

  // Dynamic Screen Texture (VS Code + Terminal interface)
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1024;
  screenCanvas.height = 640;
  const sctx = screenCanvas.getContext("2d");
  if (sctx) {
    // VS Code dark theme background
    sctx.fillStyle = "#0d1117";
    sctx.fillRect(0, 0, 1024, 640);

    // Sidebar
    sctx.fillStyle = "#161b22";
    sctx.fillRect(0, 0, 180, 640);

    // Sidebar text
    sctx.fillStyle = "#8b949e";
    sctx.font = "bold 18px monospace";
    sctx.fillText("WEBPULSE CORE", 20, 40);
    sctx.font = "14px monospace";
    sctx.fillText("📁 src/architecture", 20, 80);
    sctx.fillText("  📄 agent_runtime.ts", 20, 110);
    sctx.fillText("  📄 madrasa_os.py", 20, 140);
    sctx.fillText("  📄 telemetry.rs", 20, 170);
    sctx.fillText("📁 platforms", 20, 210);
    sctx.fillText("  📄 al_madina.tsx", 20, 240);
    sctx.fillText("  📄 bd_mess.ts", 20, 270);
    sctx.fillText("  📄 ponyopuri.tsx", 20, 300);

    // Editor Tab bar
    sctx.fillStyle = "#21262d";
    sctx.fillRect(180, 0, 844, 45);
    sctx.fillStyle = "#0d1117";
    sctx.fillRect(180, 5, 240, 40);
    sctx.fillStyle = "#58a6ff";
    sctx.font = "bold 15px monospace";
    sctx.fillText("agent_runtime.ts  ×", 200, 30);

    // Code lines in Editor
    const codeLines = [
      { text: "// Webpulse Autonomous AI Engine v4.2", color: "#8b949e" },
      { text: "import { AutonomousAgent, SwarmCoordinator } from '@webpulse/core';", color: "#ff7b72" },
      { text: "import { MadrasaOS, AlMadinaEngine } from '@/platforms';", color: "#ff7b72" },
      { text: "", color: "" },
      { text: "export class LabibSystemEngine {", color: "#d2a8ff" },
      { text: "  private founder = 'Md. Labib Fohayer';", color: "#79c0ff" },
      { text: "  private mission = 'Eliminate manual business friction';", color: "#79c0ff" },
      { text: "  private status = 'DEPLOYING NEXT-GEN PLATFORMS';", color: "#7ee787" },
      { text: "", color: "" },
      { text: "  async executeAutonomousWorkflow(pipelineId: string) {", color: "#d2a8ff" },
      { text: "    const agent = await SwarmCoordinator.spawn({ tier: 'enterprise' });", color: "#c9d1d9" },
      { text: "    return agent.optimizeWorkflow({ latencyMs: 12, uptime: 0.9999 });", color: "#c9d1d9" },
      { text: "  }", color: "#d2a8ff" },
      { text: "}", color: "#d2a8ff" },
    ];

    sctx.font = "17px monospace";
    let lineY = 80;
    codeLines.forEach((line) => {
      if (line.text) {
        sctx.fillStyle = line.color;
        sctx.fillText(line.text, 210, lineY);
      }
      lineY += 26;
    });

    // Integrated Terminal at bottom of screen
    sctx.fillStyle = "#010409";
    sctx.fillRect(180, 460, 844, 180);
    sctx.fillStyle = "#21262d";
    sctx.fillRect(180, 460, 844, 28);
    sctx.fillStyle = "#8b949e";
    sctx.font = "bold 13px monospace";
    sctx.fillText("TERMINAL  |  zsh  |  node v22.23", 200, 479);

    sctx.fillStyle = "#3fb950";
    sctx.font = "15px monospace";
    sctx.fillText("labib@mac-mini-m4:~/webpulse $ bun run dev", 200, 520);
    sctx.fillStyle = "#79c0ff";
    sctx.fillText("[✓] 120 FPS WebGL Loft Initialized. Click screen to interact.", 200, 550);
    sctx.fillStyle = "#ffa657";
    sctx.fillText("⚡ Systems Online: Madrasa OS (Live), Al-Madina (Live), BD-Mess (Live)", 200, 580);
  }

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
  });
  const monitorScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.33, 0.78), screenMat);
  monitorScreenMesh.position.set(0, 0.65, 0.026);
  monitorGroup.add(monitorScreenMesh);

  // Screen interactive target
  interactiveTargets.push({
    id: "mac_monitor",
    name: "Mac Studio Display",
    mesh: monitorScreenMesh,
    cameraStage: "desk",
    label: "Mac mini M4 & Studio Display (Click to open terminal & skills)",
  });

  // Soft light emission from monitor onto keyboard and desk
  const monitorGlow = new THREE.PointLight(0x60a5fa, 1.8, 2.5);
  monitorGlow.position.set(0, 0.65, 0.25);
  monitorGroup.add(monitorGlow);

  // --- Magic Keyboard & Trackpad ---
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.012, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.8, roughness: 0.3 })
  );
  keyboard.position.set(-0.1, 1.515, 0.18);
  deskGroup.add(keyboard);

  // Trackpad
  const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.01, 0.16),
    new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.8, roughness: 0.25 })
  );
  trackpad.position.set(0.38, 1.515, 0.18);
  deskGroup.add(trackpad);

  // =========================================================================
  // 4. DESK ACCESSORIES: WARM LAMP, RETRO SPEAKER, COFFEE MUG, SMARTPHONE
  // =========================================================================
  // --- Warm Architect Desk Lamp ---
  const lampGroup = new THREE.Group();
  lampGroup.position.set(1.15, 1.5, -0.4);
  deskGroup.add(lampGroup);

  // Lamp Base
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.025, 24),
    new THREE.MeshStandardMaterial({ color: 0x1f242d, metalness: 0.7, roughness: 0.3 })
  );
  lampGroup.add(lampBase);

  // Lamp Arm
  const lampArm1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.55, 12),
    new THREE.MeshStandardMaterial({ color: 0xc49b45, metalness: 0.8, roughness: 0.2 })
  );
  lampArm1.position.set(-0.08, 0.25, 0.1);
  lampArm1.rotation.z = -0.35;
  lampGroup.add(lampArm1);

  // Lamp Shade (Conical)
  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.2, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x1f242d, metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide })
  );
  lampShade.position.set(-0.25, 0.5, 0.2);
  lampShade.rotation.z = 0.8;
  lampGroup.add(lampShade);

  // Warm Desk Spotlight (Golden Amber Cone)
  const lampLight = new THREE.SpotLight(0xffb347, 4.2, 5.0, Math.PI / 4, 0.35, 1.2);
  lampLight.position.set(-0.25, 0.48, 0.2);
  lampLight.target.position.set(-0.35, 0, 0.4);
  lampLight.castShadow = true;
  lampLight.shadow.bias = -0.001;
  lampLight.shadow.mapSize.width = 1024;
  lampLight.shadow.mapSize.height = 1024;
  lampGroup.add(lampLight);
  lampGroup.add(lampLight.target);

  // --- Retro Desktop Speaker (Braun / Marshall Style) ---
  const speakerGroup = new THREE.Group();
  speakerGroup.position.set(-1.18, 1.54, -0.15);
  deskGroup.add(speakerGroup);

  // Wooden Cabinet
  const speakerCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.24, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x3d271a, roughness: 0.5, metalness: 0.1 })
  );
  speakerCabinet.castShadow = true;
  speakerGroup.add(speakerCabinet);

  // Woven Mesh Front
  const speakerMeshGeo = new THREE.PlaneGeometry(0.28, 0.2);
  const speakerMeshMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.9 });
  const speakerFront = new THREE.Mesh(speakerMeshGeo, speakerMeshMat);
  speakerFront.position.set(0, 0, 0.111);
  speakerGroup.add(speakerFront);

  // Brass Volume Knob
  const knob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.02, 16),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
  );
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.08, 0.06, 0.116);
  speakerGroup.add(knob);

  interactiveTargets.push({
    id: "speaker",
    name: "Lo-Fi Speaker",
    mesh: speakerCabinet,
    cameraStage: "desk",
    label: "Lo-Fi Desktop Speaker (Click to Toggle Chill Music)",
  });

  // --- Ceramic Coffee Mug & Rising Steam ---
  const mugGroup = new THREE.Group();
  mugGroup.position.set(0.85, 1.55, 0.35);
  deskGroup.add(mugGroup);

  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.05, 0.12, 24),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2, metalness: 0.1 })
  );
  mug.castShadow = true;
  mugGroup.add(mug);

  // Coffee surface
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.055, 24),
    new THREE.MeshStandardMaterial({ color: 0x1e1208, roughness: 0.1 })
  );
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.055;
  mugGroup.add(coffee);

  // Steam Particle System
  const steamGeo = new THREE.BufferGeometry();
  const steamCount = 35;
  const steamPositions = new Float32Array(steamCount * 3);
  for (let i = 0; i < steamCount; i++) {
    steamPositions[i * 3] = (Math.random() - 0.5) * 0.05;
    steamPositions[i * 3 + 1] = 0.06 + Math.random() * 0.35;
    steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
  }
  steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
  const steamMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.025,
    transparent: true,
    opacity: 0.3,
  });
  const steamParticles = new THREE.Points(steamGeo, steamMat);
  mugGroup.add(steamParticles);

  // --- Sleek Smartphone (Direct Contact Hotline) ---
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(0.72, 1.515, 0.15);
  phoneGroup.rotation.y = -0.25;
  deskGroup.add(phoneGroup);

  const phoneBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.012, 0.21),
    new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.2 })
  );
  phoneBody.castShadow = true;
  phoneGroup.add(phoneBody);

  // Phone Screen with Notification Dot
  const phoneScreenCanvas = document.createElement("canvas");
  phoneScreenCanvas.width = 128;
  phoneScreenCanvas.height = 256;
  const pctx = phoneScreenCanvas.getContext("2d");
  if (pctx) {
    pctx.fillStyle = "#09090b";
    pctx.fillRect(0, 0, 128, 256);
    pctx.fillStyle = "#22c55e"; // WhatsApp green notification
    pctx.beginPath();
    pctx.arc(64, 110, 18, 0, Math.PI * 2);
    pctx.fill();
    pctx.fillStyle = "#ffffff";
    pctx.font = "bold 14px sans-serif";
    pctx.fillText("Let's Talk", 34, 150);
    pctx.font = "11px sans-serif";
    pctx.fillStyle = "#94a3b8";
    pctx.fillText("Click to Chat", 31, 172);
  }
  const phoneTexture = new THREE.CanvasTexture(phoneScreenCanvas);
  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.095, 0.19),
    new THREE.MeshBasicMaterial({ map: phoneTexture })
  );
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.y = 0.007;
  phoneGroup.add(phoneScreen);

  interactiveTargets.push({
    id: "smartphone",
    name: "Labib's Smartphone",
    mesh: phoneBody,
    cameraStage: "contact",
    label: "Direct Contact Hotline (WhatsApp, Email & Schedule Meeting)",
  });

  // --- Ergonomic Office Chair ---
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0.6, 0, 1.35);
  chairGroup.rotation.y = Math.PI;
  roomGroup.add(chairGroup);

  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.08, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x181920, roughness: 0.85 })
  );
  chairSeat.position.set(0, 0.95, 0);
  chairGroup.add(chairSeat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.75, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x13141a, roughness: 0.9 })
  );
  chairBack.position.set(0, 1.4, -0.27);
  chairBack.rotation.x = 0.08;
  chairGroup.add(chairBack);

  const chairStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x222225, metalness: 0.8, roughness: 0.3 })
  );
  chairStem.position.set(0, 0.45, 0);
  chairGroup.add(chairStem);

  // 5-Star Base
  for (let a = 0; a < 5; a++) {
    const angle = (a * Math.PI * 2) / 5;
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.03, 0.38),
      new THREE.MeshStandardMaterial({ color: 0x1b1c22, metalness: 0.8 })
    );
    spoke.position.set(Math.sin(angle) * 0.18, 0.06, Math.cos(angle) * 0.18);
    spoke.rotation.y = angle;
    chairGroup.add(spoke);
  }

  // =========================================================================
  // 5. THE WALL OF PROJECTS: ELEGANT FRAMED WALLMATES (Gallery)
  // =========================================================================
  const projectsData = [
    {
      id: "webpulse",
      title: "Webpulse Automation System",
      category: "Autonomous Multi-Agent AI Core",
      image: "/projects/webpulse.png",
      pos: [0.8, 4.4, -4.92],
      size: [1.9, 1.25],
    },
    {
      id: "al_madina",
      title: "Al Madina Model Madrasa",
      category: "1,200+ Student Institutional Management",
      image: "/projects/al-madina.png",
      pos: [3.3, 4.4, -4.92],
      size: [1.9, 1.25],
    },
    {
      id: "madrasa_os",
      title: "Madrasa OS Platform",
      category: "Multi-Tenant Cloud SaaS Architecture",
      image: "/projects/madrasa-os.png",
      pos: [0.8, 2.4, -4.92],
      size: [1.9, 1.25],
    },
    {
      id: "bd_mess",
      title: "BD Mess Automation",
      category: "Cross-Platform Meal & Accounts App",
      image: "/projects/bd-mess.jpg",
      pos: [3.3, 2.4, -4.92],
      size: [1.9, 1.25],
    },
    {
      id: "ponyopuri",
      title: "Ponyopuri E-Commerce",
      category: "Modern High-Performance Online Store",
      image: "/projects/ponyopuri.png",
      pos: [5.6, 3.4, -4.92],
      size: [1.7, 1.2],
    },
  ];

  projectsData.forEach((proj, idx) => {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(proj.pos[0], proj.pos[1], proj.pos[2]);
    roomGroup.add(frameGroup);

    const [width, height] = proj.size;

    // Matte Black Outer Frame
    const outerFrameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.14, height + 0.14, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.4, metalness: 0.3 })
    );
    outerFrameMesh.castShadow = true;
    frameGroup.add(outerFrameMesh);

    // White Museum Passe-Partout Mat
    const matBorder = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.04, height + 0.04, 0.055),
      new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.9 })
    );
    frameGroup.add(matBorder);

    // Textured Artwork Inside Frame
    const projectTexture = textureLoader.load(proj.image);
    projectTexture.colorSpace = THREE.SRGBColorSpace;
    const artMat = new THREE.MeshStandardMaterial({
      map: projectTexture,
      roughness: 0.25,
      metalness: 0.05,
    });
    const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), artMat);
    artMesh.position.z = 0.03;
    frameGroup.add(artMesh);

    // Individual Museum Spotlight illuminating each artwork
    const artSpot = new THREE.SpotLight(0xffffff, 2.2, 4.0, Math.PI / 5, 0.4, 1.0);
    artSpot.position.set(proj.pos[0], proj.pos[1] + 1.4, proj.pos[2] + 0.9);
    artSpot.target = artMesh;
    roomGroup.add(artSpot);
    roomGroup.add(artSpot.target);

    // Interactive Raycast Target
    interactiveTargets.push({
      id: `project_${proj.id}`,
      name: proj.title,
      mesh: outerFrameMesh,
      cameraStage: "projects",
      label: `Framed Project: ${proj.title} (Click to inspect case study)`,
    });
  });

  // =========================================================================
  // 6. THE ORIGIN SHELF: BIKER HELMET, DELIVERY GEAR & TECH BOOKS (Left Wall)
  // =========================================================================
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-6.92, 2.8, 0.5);
  shelfGroup.rotation.y = Math.PI / 2;
  roomGroup.add(shelfGroup);

  // 2 Oak Floating Shelves
  const oakMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.5, metalness: 0.1 });
  const topShelf = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.45), oakMat);
  topShelf.position.set(0, 0.9, 0);
  topShelf.castShadow = true;
  shelfGroup.add(topShelf);

  const bottomShelf = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.45), oakMat);
  bottomShelf.position.set(0, 0, 0);
  bottomShelf.castShadow = true;
  shelfGroup.add(bottomShelf);

  // --- Top Shelf: Curated Tech Books & Certificate Plaque ---
  const bookColors = [0x991b1b, 0x1e40af, 0x065f46, 0x854d0e, 0x374151, 0x4c1d95];
  for (let b = 0; b < 6; b++) {
    const bookGeo = new THREE.BoxGeometry(0.06 + Math.random() * 0.02, 0.36 + Math.random() * 0.08, 0.3);
    const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[b % bookColors.length], roughness: 0.6 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(-0.95 + b * 0.09, 1.15, -0.02);
    book.castShadow = true;
    shelfGroup.add(book);
  }

  // Framed Certification Plaque
  const certFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.42, 0.03),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 })
  );
  certFrame.position.set(0.65, 1.15, -0.08);
  certFrame.rotation.y = -0.15;
  shelfGroup.add(certFrame);

  // --- Bottom Shelf: The Iconic Motorbike Helmet (Delivery Rider to Tech Founder) ---
  const helmetGroup = new THREE.Group();
  helmetGroup.position.set(-0.5, 0.28, 0);
  shelfGroup.add(helmetGroup);

  // Glossy Black & Cyan Aerodynamic Helmet Shell
  const helmetGeo = new THREE.SphereGeometry(0.24, 28, 24);
  const helmetMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0c10, // Glossy pitch/slate
    roughness: 0.12,
    metalness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  const helmetMesh = new THREE.Mesh(helmetGeo, helmetMat);
  helmetMesh.scale.set(1.0, 1.08, 1.2);
  helmetMesh.castShadow = true;
  helmetGroup.add(helmetMesh);

  // Helmet Visor (Reflective Metallic Tint)
  const visorGeo = new THREE.SphereGeometry(0.242, 24, 16, 0, Math.PI, Math.PI / 4, Math.PI / 2);
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee, // Cyan tint reflection
    metalness: 0.95,
    roughness: 0.05,
    transparent: true,
    opacity: 0.9,
  });
  const visorMesh = new THREE.Mesh(visorGeo, visorMat);
  visorMesh.scale.set(1.01, 1.05, 1.22);
  visorMesh.rotation.x = -Math.PI / 2;
  visorMesh.position.set(0, 0.02, 0.02);
  helmetGroup.add(visorMesh);

  // Courier / Delivery Gear Backpack beside Helmet
  const deliveryBag = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.38, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.85 }) // Delivery Red badge
  );
  deliveryBag.position.set(0.55, 0.2, 0);
  deliveryBag.rotation.y = -0.2;
  deliveryBag.castShadow = true;
  shelfGroup.add(deliveryBag);

  // Interactive Target for Origin Story
  interactiveTargets.push({
    id: "origin_shelf",
    name: "The Origin Shelf",
    mesh: helmetMesh,
    cameraStage: "shelf",
    label: "Origin Shelf: Rider to Tech Founder (Click to Read Authentic Journey)",
  });

  // Dedicated spotlight for The Origin Shelf
  const shelfSpot = new THREE.SpotLight(0xfff1d0, 2.5, 4.5, Math.PI / 4, 0.5, 1.0);
  shelfSpot.position.set(-5.5, 4.2, 0.5);
  shelfSpot.target = helmetMesh;
  roomGroup.add(shelfSpot);
  roomGroup.add(shelfSpot.target);

  // =========================================================================
  // 7. ROOM LIGHTING & SHADOW ORCHESTRATION
  // =========================================================================
  // Midnight Ambient Light (Deep cool blue room tone)
  const ambientLight = new THREE.AmbientLight(0x0a101d, 1.1);
  scene.add(ambientLight);

  // Directional Moonlight pouring through the Window
  const moonLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  moonLight.position.set(-6.0, 6.5, -3.5);
  moonLight.target.position.set(0.6, 1.2, 0.2);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 2048;
  moonLight.shadow.mapSize.height = 2048;
  moonLight.shadow.camera.near = 0.5;
  moonLight.shadow.camera.far = 15;
  moonLight.shadow.camera.left = -6;
  moonLight.shadow.camera.right = 6;
  moonLight.shadow.camera.top = 6;
  moonLight.shadow.camera.bottom = -6;
  moonLight.shadow.bias = -0.0005;
  scene.add(moonLight);
  scene.add(moonLight.target);

  // Subtle Room Ceiling Warm Chandelier fill
  const ceilingFill = new THREE.PointLight(0xffeedd, 0.8, 9.0);
  ceilingFill.position.set(0, 5.2, 0);
  scene.add(ceilingFill);

  // =========================================================================
  // 8. UPDATE ANIMATION LOOP (120 FPS STEAM & ACCENTS)
  // =========================================================================
  const updateScene = (time: number) => {
    // Animate rising steam particles from coffee
    const positions = steamGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < steamCount; i++) {
      positions[i * 3 + 1] += 0.0015;
      positions[i * 3] += Math.sin(time * 3 + i) * 0.0003;
      if (positions[i * 3 + 1] > 0.4) {
        positions[i * 3 + 1] = 0.06;
        positions[i * 3] = (Math.random() - 0.5) * 0.05;
      }
    }
    steamGeo.attributes.position.needsUpdate = true;

    // Subtle gentle breathing glow on Mac mini LED
    ledMat.color.setRGB(
      0.9 + Math.sin(time * 2) * 0.1,
      0.9 + Math.sin(time * 2) * 0.1,
      1.0
    );
  };

  return {
    interactiveTargets,
    speakerMesh: speakerCabinet,
    monitorScreenMesh,
    steamParticles,
    updateScene,
  };
}
