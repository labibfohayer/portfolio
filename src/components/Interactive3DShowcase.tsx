"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Sparkles, Move } from "lucide-react";

interface PhysicsCross {
  group: THREE.Group;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  angularVelocity: THREE.Vector3;
  radius: number;
  scale: number;
  baseYOffset: number;
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
    let height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Dramatic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight1.position.set(8, 12, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight2.position.set(-10, -6, 6);
    scene.add(dirLight2);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 4.0, 25);
    cyanPointLight.position.set(0, -2, 5);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x3b82f6, 3.0, 20);
    bluePointLight.position.set(3, 4, 4);
    scene.add(bluePointLight);

    // 3. Shared Capsule Geometry & High-Craft PBR Materials
    const capsuleRadius = 0.38;
    const capsuleLength = 1.3;
    const capsuleGeo = new THREE.CapsuleGeometry(capsuleRadius, capsuleLength, 16, 32);

    // Obsidian Black Material
    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0d,
      roughness: 0.12,
      metalness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    // Ceramic Pure White Material
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
    });

    // Electric Cobalt / Cyan Material
    const cobaltCyanMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x083344,
      emissiveIntensity: 0.25,
      roughness: 0.12,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    // Helper: Build a single 3D rounded cross/jack from 3 intersecting orthogonal capsules
    const createCrossGroup = (mat: THREE.Material): THREE.Group => {
      const group = new THREE.Group();

      // Capsule 1: Along Y axis
      const meshY = new THREE.Mesh(capsuleGeo, mat);
      group.add(meshY);

      // Capsule 2: Along X axis
      const meshX = new THREE.Mesh(capsuleGeo, mat);
      meshX.rotation.z = Math.PI / 2;
      group.add(meshX);

      // Capsule 3: Along Z axis
      const meshZ = new THREE.Mesh(capsuleGeo, mat);
      meshZ.rotation.x = Math.PI / 2;
      group.add(meshZ);

      return group;
    };

    // 4. Spawn 20 Procedural 3D Cross Physics Objects
    const TOTAL_CROSSES = 20;
    const physicsObjects: PhysicsCross[] = [];

    for (let i = 0; i < TOTAL_CROSSES; i++) {
      let mat = obsidianMat;
      if (i % 3 === 1) mat = ceramicMat;
      else if (i % 3 === 2) mat = cobaltCyanMat;

      const group = createCrossGroup(mat);
      const scale = THREE.MathUtils.randFloat(0.85, 1.15);
      group.scale.set(scale, scale, scale);

      // Initial clustered distribution
      const angle = (i / TOTAL_CROSSES) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = THREE.MathUtils.randFloat(0.8, 3.8);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * 0.65;
      const z = THREE.MathUtils.randFloat(-1.8, 1.8);

      group.position.set(x, y, z);
      group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(group);

      const effectiveRadius = (capsuleRadius + capsuleLength * 0.5) * scale * 0.88;

      physicsObjects.push({
        group,
        position: group.position,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        rotation: group.rotation,
        angularVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
        radius: effectiveRadius,
        scale,
        baseYOffset: y,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 5. Mouse Interaction Tracking
    const mouseNDC = new THREE.Vector2(-999, -999);
    const targetMouseWorld = new THREE.Vector3(-999, -999, 0);
    const prevMouseWorld = new THREE.Vector3(-999, -999, 0);
    let mouseSpeed = 0;
    let isHovering = false;

    // 6. Liquid Ripple Trail Setup on 2D Canvas
    const rippleCanvas = rippleCanvasRef.current;
    let rippleCtx: CanvasRenderingContext2D | null = null;
    let ripples: Ripple[] = [];

    if (rippleCanvas) {
      rippleCanvas.width = width;
      rippleCanvas.height = height;
      rippleCtx = rippleCanvas.getContext("2d");
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseNDC.x = (clientX / width) * 2 - 1;
      mouseNDC.y = -(clientY / height) * 2 + 1;
      isHovering = true;

      // Project onto Z=0 plane in world coordinates
      const vector = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      if (prevMouseWorld.x !== -999) {
        mouseSpeed = worldPos.distanceTo(prevMouseWorld);
      }
      prevMouseWorld.copy(targetMouseWorld);
      targetMouseWorld.copy(worldPos);

      // Add chromatic liquid ripple
      if (Math.random() < 0.6) {
        const colors = [
          "rgba(6, 182, 212, 0.5)", // Cyan
          "rgba(59, 130, 246, 0.4)", // Cobalt Blue
          "rgba(147, 197, 253, 0.45)", // Ice Blue
          "rgba(255, 255, 255, 0.35)", // Liquid White
        ];
        ripples.push({
          x: clientX,
          y: clientY,
          radius: 8,
          maxRadius: THREE.MathUtils.randFloat(30, 65),
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

    // 7. Window Resize Listener
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 500;

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

    // 8. Animation & Physics Simulation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    // IntersectionObserver to pause rendering when section is out of viewport (Performance Safeguard)
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

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // ==========================================
      // A. Center Gravity & Floating Wave
      // ==========================================
      for (let i = 0; i < physicsObjects.length; i++) {
        const obj = physicsObjects[i];

        // Soft spring pull toward center cluster
        const toCenter = new THREE.Vector3(0, 0, 0).sub(obj.position);
        const distFromCenter = toCenter.length();

        // Gravitational force proportional to distance
        obj.velocity.addScaledVector(toCenter, 0.0065);

        // Keep depth bounded in front of camera
        if (Math.abs(obj.position.z) > 2.2) {
          obj.velocity.z -= Math.sign(obj.position.z) * 0.02;
        }

        // Ambient fluid wave motion
        obj.velocity.y += Math.sin(time * 1.6 + obj.phase) * 0.0018;
        obj.velocity.x += Math.cos(time * 1.2 + obj.phase) * 0.0012;
      }

      // ==========================================
      // B. Mouse Raycast Repulsion
      // ==========================================
      if (isHovering && targetMouseWorld.x !== -999) {
        const repulsionRadius = 3.6;

        for (let i = 0; i < physicsObjects.length; i++) {
          const obj = physicsObjects[i];
          const diff = obj.position.clone().sub(targetMouseWorld);
          diff.z *= 0.4; // Flatten repulsion primarily along X/Y
          const distToCursor = diff.length();

          if (distToCursor < repulsionRadius && distToCursor > 0.001) {
            const pushDir = diff.normalize();
            const factor = 1 - distToCursor / repulsionRadius;
            const pushStrength = factor * factor * (0.35 + Math.min(mouseSpeed, 0.8) * 0.5);

            obj.velocity.addScaledVector(pushDir, pushStrength);

            // Add dynamic tumble torque on mouse collision
            obj.angularVelocity.x += (Math.random() - 0.5) * pushStrength * 0.8;
            obj.angularVelocity.y += (Math.random() - 0.5) * pushStrength * 0.8;
            obj.angularVelocity.z += (Math.random() - 0.5) * pushStrength * 0.8;
          }
        }
      }

      // ==========================================
      // C. Pairwise Object Collision (Elastic Repulsion)
      // ==========================================
      const restitution = 0.65;
      for (let i = 0; i < physicsObjects.length; i++) {
        for (let j = i + 1; j < physicsObjects.length; j++) {
          const a = physicsObjects[i];
          const b = physicsObjects[j];

          const delta = a.position.clone().sub(b.position);
          const dist = delta.length();
          const minDist = a.radius + b.radius;

          if (dist < minDist && dist > 0.0001) {
            const normal = delta.normalize();
            const overlap = minDist - dist;

            // Positional separation
            a.position.addScaledVector(normal, overlap * 0.5);
            b.position.addScaledVector(normal, -overlap * 0.5);

            // Relative velocity & impulse calculation
            const relVel = a.velocity.clone().sub(b.velocity);
            const sepVel = relVel.dot(normal);

            if (sepVel < 0) {
              const impulse = -(1 + restitution) * sepVel * 0.5;
              a.velocity.addScaledVector(normal, impulse);
              b.velocity.addScaledVector(normal, -impulse);

              // Impart tumbling spin on impact
              a.angularVelocity.x += (Math.random() - 0.5) * impulse * 0.15;
              b.angularVelocity.y += (Math.random() - 0.5) * impulse * 0.15;
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
        obj.velocity.multiplyScalar(0.94); // Smooth fluid friction

        // Angular rotation
        obj.rotation.x += obj.angularVelocity.x + 0.0025;
        obj.rotation.y += obj.angularVelocity.y + 0.0035;
        obj.rotation.z += obj.angularVelocity.z + 0.0015;
        obj.angularVelocity.multiplyScalar(0.93);
      }

      // Soft light orbiting around scene for dynamic specular highlights
      cyanPointLight.position.x = Math.sin(time * 0.8) * 5;
      cyanPointLight.position.y = Math.cos(time * 0.6) * 4;
      bluePointLight.position.x = Math.cos(time * 0.7) * 6;
      bluePointLight.position.z = 4 + Math.sin(time * 0.5) * 2;

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
          rippleCtx.strokeStyle = "rgba(6, 182, 212, 0.4)";
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

    // 9. Comprehensive Cleanup & Resource Disposal on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();

      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);

      // Dispose Three.js geometries & materials
      capsuleGeo.dispose();
      obsidianMat.dispose();
      ceramicMat.dispose();
      cobaltCyanMat.dispose();

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/25 text-[10px] font-bold tracking-widest text-cyan-400 uppercase mb-3 bg-cyan-950/25 backdrop-blur-md">
            <Sparkles size={11} className="text-cyan-400 animate-pulse" />
            <span>INTERACTIVE 3D PHYSICS // LUSION LAB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white">
            PHYSICAL <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">MATERIAL LAB</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-neutral-400 max-w-md leading-relaxed">
          Procedural 3D rounded cross clusters with real-time PBR glossy shaders, elastic impulse mechanics, and fluid cursor repulsion.
        </p>
      </div>

      {/* Sleek Lusion Viewport Frame */}
      <div
        ref={containerRef}
        className="relative w-full h-[420px] sm:h-[520px] md:h-[620px] rounded-[2rem] overflow-hidden bg-[#070709] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08)_0%,_transparent_70%)] pointer-events-none" />

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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-neutral-400">PBR ENGINE:</span>
            <span className="text-cyan-400 font-semibold">60 FPS REAL-TIME</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-neutral-400">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">20 CLUSTER BODIES</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">RAYCAST REPULSION</span>
          </div>
        </div>

        {/* Center Floating Interaction Hint (Disappears on hover/move) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center gap-2 opacity-60 group-hover:opacity-0 transition-opacity duration-500">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 animate-bounce">
            <Move size={16} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            Hover & Drag to Disperse
          </span>
        </div>

        {/* Bottom HUD Bar matching Lusion Reference Frame */}
        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between z-30 pointer-events-none border-t border-white/5 pt-3">
          {/* Left '+' Marker */}
          <span className="text-neutral-500 font-mono text-sm leading-none select-none">+</span>

          {/* Centered Micro-Label */}
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            <span>SCROLL TO EXPLORE</span>
          </div>

          {/* Right '+' Marker */}
          <span className="text-neutral-500 font-mono text-sm leading-none select-none">+</span>
        </div>
      </div>
    </section>
  );
}
