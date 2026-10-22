"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Sparkles } from "lucide-react";

interface PhysicsCross {
  group: THREE.Group;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  angularVelocity: THREE.Vector3;
  radius: number;
  scale: number;
  phase: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export default function Interactive3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rippleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || typeof window === "undefined") return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 540;

    // 1. Scene & Macro Camera Framing
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 3. Studio HDRI Reflection Generation (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;

    // 4. Subtle Studio Directional Lighting & Rim Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(7, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce7ff, 1.4);
    fillLight.position.set(-8, -5, 6);
    scene.add(fillLight);

    const blueRimLight = new THREE.DirectionalLight(0x2563eb, 1.2);
    blueRimLight.position.set(0, 8, -6);
    scene.add(blueRimLight);

    // 5. Authentic Hollow-End Industrial Cross Geometries (Merged for 60FPS)
    const armRadius = 0.42;
    const armLength = 2.3;
    const tipOffset = 1.12;

    const outerGeoms: THREE.BufferGeometry[] = [];

    // Orthogonal Cylinders
    const cylY = new THREE.CylinderGeometry(armRadius, armRadius, armLength, 32);
    outerGeoms.push(cylY);

    const cylX = new THREE.CylinderGeometry(armRadius, armRadius, armLength, 32);
    cylX.rotateZ(Math.PI / 2);
    outerGeoms.push(cylX);

    const cylZ = new THREE.CylinderGeometry(armRadius, armRadius, armLength, 32);
    cylZ.rotateX(Math.PI / 2);
    outerGeoms.push(cylZ);

    // Beveled Torus Rims at all 6 arm ends
    const torZ1 = new THREE.TorusGeometry(0.36, 0.06, 16, 32);
    torZ1.translate(0, 0, tipOffset);
    outerGeoms.push(torZ1);

    const torZ2 = new THREE.TorusGeometry(0.36, 0.06, 16, 32);
    torZ2.translate(0, 0, -tipOffset);
    outerGeoms.push(torZ2);

    const torY1 = new THREE.TorusGeometry(0.36, 0.06, 16, 32);
    torY1.rotateX(Math.PI / 2);
    torY1.translate(0, tipOffset, 0);
    outerGeoms.push(torY1);

    const torY2 = new THREE.TorusGeometry(0.36, 0.06, 16, 32);
    torY2.rotateX(Math.PI / 2);
    torY2.translate(0, -tipOffset, 0);
    outerGeoms.push(torY2);

    const torX1 = new THREE.TorusGeometry(0.36, 0.06, 16, 32);
    torX1.rotateY(Math.PI / 2);
    torX1.translate(tipOffset, 0, 0);
    outerGeoms.push(torX1);

    const torX2 = new THREE.TorusGeometry(0.36, 0.06, 16, 32);
    torX2.rotateY(Math.PI / 2);
    torX2.translate(-tipOffset, 0, 0);
    outerGeoms.push(torX2);

    const crossOuterGeo = mergeGeometries(outerGeoms, false) || new THREE.BufferGeometry();
    outerGeoms.forEach((g) => g.dispose());

    // Recessed Dark Inner Bore Cylinders (Hollow Pipe End Interiors)
    const innerBoreGeoms: THREE.BufferGeometry[] = [];
    const boreRadius = 0.28;
    const boreDepth = 0.05;
    const boreOffset = 1.13;

    const inY1 = new THREE.CylinderGeometry(boreRadius, boreRadius, boreDepth, 24);
    inY1.translate(0, boreOffset, 0);
    innerBoreGeoms.push(inY1);

    const inY2 = new THREE.CylinderGeometry(boreRadius, boreRadius, boreDepth, 24);
    inY2.translate(0, -boreOffset, 0);
    innerBoreGeoms.push(inY2);

    const inX1 = new THREE.CylinderGeometry(boreRadius, boreRadius, boreDepth, 24);
    inX1.rotateZ(Math.PI / 2);
    inX1.translate(boreOffset, 0, 0);
    innerBoreGeoms.push(inX1);

    const inX2 = new THREE.CylinderGeometry(boreRadius, boreRadius, boreDepth, 24);
    inX2.rotateZ(Math.PI / 2);
    inX2.translate(-boreOffset, 0, 0);
    innerBoreGeoms.push(inX2);

    const inZ1 = new THREE.CylinderGeometry(boreRadius, boreRadius, boreDepth, 24);
    inZ1.rotateX(Math.PI / 2);
    inZ1.translate(0, 0, boreOffset);
    innerBoreGeoms.push(inZ1);

    const inZ2 = new THREE.CylinderGeometry(boreRadius, boreRadius, boreDepth, 24);
    inZ2.rotateX(Math.PI / 2);
    inZ2.translate(0, 0, -boreOffset);
    innerBoreGeoms.push(inZ2);

    const crossInnerGeo = mergeGeometries(innerBoreGeoms, false) || new THREE.BufferGeometry();
    innerBoreGeoms.forEach((g) => g.dispose());

    // 6. Refined Studio PBR Materials
    const deepCobaltMat = new THREE.MeshPhysicalMaterial({
      color: 0x1638ff,
      roughness: 0.14,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.25,
    });

    const softCeramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8dce3,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.1,
    });

    const satinObsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x111216,
      roughness: 0.16,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.3,
    });

    const matteInnerMat = new THREE.MeshStandardMaterial({
      color: 0x050507,
      roughness: 0.9,
      metalness: 0.0,
    });

    // Helper: Composite Cross Group
    const createCrossGroup = (outerMat: THREE.Material): THREE.Group => {
      const group = new THREE.Group();
      const outerMesh = new THREE.Mesh(crossOuterGeo, outerMat);
      const innerMesh = new THREE.Mesh(crossInnerGeo, matteInnerMat);
      group.add(outerMesh);
      group.add(innerMesh);
      return group;
    };

    // 7. Spawn 20 Scaled Cross Objects with Wide Elliptical Spread
    const TOTAL_CROSSES = 20;
    const physicsObjects: PhysicsCross[] = [];

    // Curated material distribution matching reference
    const materialSequence = [
      satinObsidianMat,
      softCeramicMat,
      deepCobaltMat,
      satinObsidianMat,
      softCeramicMat,
      satinObsidianMat,
      softCeramicMat,
      deepCobaltMat,
      satinObsidianMat,
      softCeramicMat,
      deepCobaltMat,
      satinObsidianMat,
      softCeramicMat,
      satinObsidianMat,
      deepCobaltMat,
      softCeramicMat,
      satinObsidianMat,
      softCeramicMat,
      deepCobaltMat,
      satinObsidianMat,
    ];

    for (let i = 0; i < TOTAL_CROSSES; i++) {
      const mat = materialSequence[i % materialSequence.length];
      const group = createCrossGroup(mat);

      // Macro scale: 1.55 to 1.85 to boldly fill 80%-85% of viewport
      const scale = THREE.MathUtils.randFloat(1.55, 1.85);
      group.scale.set(scale, scale, scale);

      // Wide elliptical horizontal initial spread
      const angle = (i / TOTAL_CROSSES) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const radX = THREE.MathUtils.randFloat(0.8, 5.2);
      const radY = THREE.MathUtils.randFloat(0.5, 2.4);
      const x = Math.cos(angle) * radX;
      const y = Math.sin(angle) * radY;
      const z = THREE.MathUtils.randFloat(-1.2, 1.2);

      group.position.set(x, y, z);
      group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(group);

      physicsObjects.push({
        group,
        position: group.position,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ),
        rotation: group.rotation,
        angularVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        radius: 1.2 * scale,
        scale,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 8. 2D Chromatic Ripple Trail Setup
    const rippleCanvas = rippleCanvasRef.current;
    let rippleCtx: CanvasRenderingContext2D | null = null;
    if (rippleCanvas) {
      rippleCanvas.width = width;
      rippleCanvas.height = height;
      rippleCtx = rippleCanvas.getContext("2d");
    }
    const ripples: Ripple[] = [];

    // 9. Pointer Raycasting & Repulsion Mechanics
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-999, -999);
    const planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const targetMouseWorld = new THREE.Vector3(-999, -999, 0);
    const prevMouseWorld = new THREE.Vector3(-999, -999, 0);
    let isHovering = false;
    let mouseSpeed = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseNDC.x = (clientX / width) * 2 - 1;
      mouseNDC.y = -(clientY / height) * 2 + 1;
      isHovering = true;

      raycaster.setFromCamera(mouseNDC, camera);
      const intersectionPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(planeZ0, intersectionPoint)) {
        if (prevMouseWorld.x !== -999) {
          mouseSpeed = intersectionPoint.distanceTo(prevMouseWorld);
        }
        prevMouseWorld.copy(targetMouseWorld);
        targetMouseWorld.copy(intersectionPoint);
      }

      if (Math.random() > 0.4) {
        const colors = [
          "rgba(22, 56, 255, 0.75)",
          "rgba(59, 130, 246, 0.65)",
          "rgba(147, 197, 253, 0.5)",
        ];
        ripples.push({
          x: clientX,
          y: clientY,
          radius: 10,
          maxRadius: THREE.MathUtils.randFloat(35, 75),
          alpha: 0.65,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const onPointerLeave = () => {
      mouseNDC.set(-999, -999);
      targetMouseWorld.set(-999, -999, 0);
      prevMouseWorld.set(-999, -999, 0);
      isHovering = false;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // 10. Resize Observer & Handling
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 540;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (rippleCanvas) {
        rippleCanvas.width = width;
        rippleCanvas.height = height;
      }
    };
    window.addEventListener("resize", onResize);

    // 11. Physics Simulation & Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // ==========================================
      // A. Wide Elliptical Attractor & Float Drift
      // ==========================================
      for (let i = 0; i < physicsObjects.length; i++) {
        const obj = physicsObjects[i];

        // Rest/attractor force: gentle horizontal elliptical spread (x * 0.45, y * 0.85, z * 0.9)
        obj.velocity.x -= obj.position.x * 0.003 * 0.45;
        obj.velocity.y -= obj.position.y * 0.003 * 0.85;
        obj.velocity.z -= obj.position.z * 0.003 * 0.9;

        // Soft elastic containment bounds
        if (Math.abs(obj.position.x) > 6.5) {
          obj.velocity.x -= Math.sign(obj.position.x) * 0.02;
        }
        if (Math.abs(obj.position.y) > 3.2) {
          obj.velocity.y -= Math.sign(obj.position.y) * 0.02;
        }
        if (Math.abs(obj.position.z) > 1.8) {
          obj.velocity.z -= Math.sign(obj.position.z) * 0.02;
        }

        // Ambient fluid wave motion
        obj.velocity.y += Math.sin(time * 1.3 + obj.phase) * 0.0012;
        obj.velocity.x += Math.cos(time * 0.95 + obj.phase) * 0.0008;
      }

      // ==========================================
      // B. Mouse Raycast Dynamic Parting Wave
      // ==========================================
      if (isHovering && targetMouseWorld.x !== -999) {
        const repulsionRadius = 4.8;

        for (let i = 0; i < physicsObjects.length; i++) {
          const obj = physicsObjects[i];
          const diff = obj.position.clone().sub(targetMouseWorld);
          diff.z *= 0.35; // Flatten repulsion primarily along X/Y screen plane
          const distToCursor = diff.length();

          if (distToCursor < repulsionRadius && distToCursor > 0.001) {
            const pushDir = diff.normalize();
            const factor = 1 - distToCursor / repulsionRadius;
            const pushStrength = factor * factor * (0.55 + Math.min(mouseSpeed, 1.2) * 0.8);

            obj.velocity.addScaledVector(pushDir, pushStrength);

            // Dynamic tumble torque on parting wave
            obj.angularVelocity.x += (Math.random() - 0.5) * pushStrength * 1.1;
            obj.angularVelocity.y += (Math.random() - 0.5) * pushStrength * 1.1;
            obj.angularVelocity.z += (Math.random() - 0.5) * pushStrength * 1.1;
          }
        }
      }

      // ==========================================
      // C. Pairwise Object Collision (Elastic Repulsion & Interlock Prevention)
      // ==========================================
      const restitution = 0.65;
      for (let i = 0; i < physicsObjects.length; i++) {
        for (let j = i + 1; j < physicsObjects.length; j++) {
          const a = physicsObjects[i];
          const b = physicsObjects[j];

          const delta = a.position.clone().sub(b.position);
          const dist = delta.length();
          const minDist = 2.45 * ((a.scale + b.scale) / 3.4);

          if (dist < minDist && dist > 0.0001) {
            const normal = delta.normalize();
            const overlap = minDist - dist;

            // Positional separation
            a.position.addScaledVector(normal, overlap * 0.5);
            b.position.addScaledVector(normal, -overlap * 0.5);

            // Velocity impulse
            const relVel = a.velocity.clone().sub(b.velocity);
            const sepVel = relVel.dot(normal);

            if (sepVel < 0) {
              const impulse = -(1 + restitution) * sepVel * 0.5;
              a.velocity.addScaledVector(normal, impulse);
              b.velocity.addScaledVector(normal, -impulse);

              // Impart tumbling spin on impact
              a.angularVelocity.x += (Math.random() - 0.5) * impulse * 0.16;
              a.angularVelocity.y += (Math.random() - 0.5) * impulse * 0.16;
              a.angularVelocity.z += (Math.random() - 0.5) * impulse * 0.16;
            }
          }
        }
      }

      // ==========================================
      // D. Integrate Velocity & Damping
      // ==========================================
      for (let i = 0; i < physicsObjects.length; i++) {
        const obj = physicsObjects[i];

        // Linear movement
        obj.position.add(obj.velocity);
        obj.velocity.multiplyScalar(0.935); // Smooth fluid friction

        // Angular rotation
        obj.rotation.x += obj.angularVelocity.x + 0.002;
        obj.rotation.y += obj.angularVelocity.y + 0.003;
        obj.rotation.z += obj.angularVelocity.z + 0.0015;
        obj.angularVelocity.multiplyScalar(0.93);
      }

      renderer.render(scene, camera);

      // ==========================================
      // E. Render Liquid Ripple Trail Canvas
      // ==========================================
      if (rippleCtx && rippleCanvas) {
        rippleCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
        rippleCtx.globalCompositeOperation = "screen";

        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += (r.maxRadius - r.radius) * 0.12;
          r.alpha *= 0.92;

          rippleCtx.beginPath();
          rippleCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          rippleCtx.strokeStyle = r.color;
          rippleCtx.lineWidth = 1.5;
          rippleCtx.globalAlpha = r.alpha;
          rippleCtx.stroke();

          // Inner chromatic glow ring
          rippleCtx.beginPath();
          rippleCtx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          rippleCtx.strokeStyle = "rgba(22, 56, 255, 0.45)";
          rippleCtx.lineWidth = 2.5;
          rippleCtx.globalAlpha = r.alpha * 0.6;
          rippleCtx.stroke();

          if (r.alpha < 0.02) {
            ripples.splice(i, 1);
          }
        }
      }
    };

    animate();

    // 12. Resource Disposal on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();

      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);

      // Dispose Studio Environment
      pmremGenerator.dispose();
      roomEnv.dispose();
      envMap.dispose();

      // Dispose Geometries
      crossOuterGeo.dispose();
      crossInnerGeo.dispose();

      // Dispose Materials
      deepCobaltMat.dispose();
      softCeramicMat.dispose();
      satinObsidianMat.dispose();
      matteInnerMat.dispose();

      // Remove meshes from scene
      for (const obj of physicsObjects) {
        scene.remove(obj.group);
      }

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative py-12 md:py-20 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto w-full select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-3 bg-blue-950/25 backdrop-blur-md">
            <Sparkles size={11} className="text-blue-400 animate-pulse" />
            <span>// INTERACTIVE 3D ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white">
            AUTONOMOUS <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(22,56,255,0.4)]">SYSTEM DYNAMICS</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-neutral-400 max-w-md leading-relaxed">
          High-fidelity industrial PBR cross physics with studio HDRI environment reflections, beveled geometry, and fluid cursor repulsion.
        </p>
      </div>

      {/* Sleek Viewport Frame */}
      <div
        ref={containerRef}
        className="relative w-full h-[440px] sm:h-[540px] md:h-[640px] rounded-[2rem] overflow-hidden bg-[#070709] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(22,56,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

        {/* 3D WebGL Canvas Mount Container */}
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 touch-none"
        />

        {/* Liquid Chromatic Ripple 2D Canvas */}
        <canvas
          ref={rippleCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Top HUD Telemetry Overlay */}
        <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-neutral-400">PBR STUDIO:</span>
            <span className="text-blue-400 font-semibold">HDRI ENVIRONMENT</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-neutral-400">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">20 INDUSTRIAL BODIES</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">RAYCAST PARTING DYNAMICS</span>
          </div>
        </div>

        {/* Bottom HUD Bar */}
        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between z-30 pointer-events-none border-t border-white/5 pt-3">
          <span className="text-neutral-500 font-mono text-sm leading-none select-none">+</span>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            <span>SCROLL TO EXPLORE</span>
          </div>
          <span className="text-neutral-500 font-mono text-sm leading-none select-none">+</span>
        </div>
      </div>
    </section>
  );
}
