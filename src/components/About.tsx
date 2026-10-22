"use client";

import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck, GraduationCap, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import MagneticButton from "./ui/MagneticButton";

function Counter({ from = 0, to, suffix = "", prefix = "", decimals = 0 }: { from?: number, to: number, suffix?: string, prefix?: string, decimals?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView && nodeRef.current) {
      animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = prefix + value.toFixed(decimals) + suffix;
          }
        },
      });
    }
  }, [from, to, inView, suffix, prefix, decimals]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
}

// ==========================================
// 1. 3D WebGL Holographic Cyber-Core Background
// ==========================================
function AboutHolographicCore() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === "undefined") return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 900;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Layer 1: Outer Rotating Wireframe Icosahedron ---
    const outerGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // --- Layer 2: Counter-Rotating Octahedron with Points & Lattice ---
    const midGeo = new THREE.OctahedronGeometry(2.1, 2);
    const midMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);

    const midPointsMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const midPoints = new THREE.Points(midGeo, midPointsMat);

    const midGroup = new THREE.Group();
    midGroup.add(midMesh);
    midGroup.add(midPoints);
    scene.add(midGroup);

    // --- Layer 3: Inner Glossy Dark Metallic Geometric Nucleus ---
    const innerGeo = new THREE.DodecahedronGeometry(1.2);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x041924,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x083344,
      emissiveIntensity: 0.4,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Lighting for Core Nucleus
    const corePointLight = new THREE.PointLight(0x06b6d4, 3.5, 14);
    corePointLight.position.set(0, 0, 3.5);
    scene.add(corePointLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(6, 6, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0e7490, 1.5);
    dirLight2.position.set(-6, -6, -4);
    scene.add(dirLight2);

    // --- 150 Floating 3D Depth Particles ---
    const particleCount = 150;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse & Scroll Dynamic Reactivity
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      targetMouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };
    window.addEventListener("pointermove", handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 900;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // Performance Safeguard: Pause when scrolled off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Render & Physics Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animateLoop = () => {
      animId = requestAnimationFrame(animateLoop);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Smooth lerp (0.05) toward target mouse coordinates
      currentRotX += (targetMouseY * 0.45 - currentRotX) * 0.05;
      currentRotY += (targetMouseX * 0.55 - currentRotY) * 0.05;

      // Outer Layer rotation
      outerMesh.rotation.x = time * 0.08 + currentRotX;
      outerMesh.rotation.y = time * 0.12 + currentRotY;

      // Middle Layer counter-rotation
      midGroup.rotation.x = -time * 0.12 - currentRotX * 0.8;
      midGroup.rotation.y = -time * 0.16 + currentRotY * 0.8;

      // Inner Core rotation
      innerMesh.rotation.x = time * 0.2 + currentRotX * 1.2;
      innerMesh.rotation.y = -time * 0.25 - currentRotY * 1.2;

      // Particle floating drift
      particles.rotation.y = time * 0.035;
      particles.rotation.x = time * 0.015;

      renderer.render(scene, camera);
    };

    animateLoop();

    // Clean Unmount & Resource Disposal
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      outerGeo.dispose();
      outerMat.dispose();
      midGeo.dispose();
      midMat.dispose();
      midPointsMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

// ==========================================
// 2. Multi-Plane 3D Parallax Spatial Card
// ==========================================
function Spatial3DCard({
  children,
  className = "",
  maxTilt = 8,
  glowColor = "rgba(var(--theme-rgb),0.2)",
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.7,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative [perspective:1200px] h-full"
    >
      <motion.div
        animate={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 25 }}
        className={`relative h-full [transform-style:preserve-3d] ${className}`}
      >
        {/* Specular Glare Spotlight following cursor */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(550px circle at ${glare.x}% ${glare.y}%, ${glowColor}, transparent 60%)`,
          }}
        />

        {/* Dynamic Edge Highlight Border */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-30 border border-cyan-400/50"
          style={{
            opacity: glare.opacity > 0 ? 1 : 0,
            maskImage: `radial-gradient(350px circle at ${glare.x}% ${glare.y}%, black, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(350px circle at ${glare.x}% ${glare.y}%, black, transparent 100%)`,
          }}
        />

        {/* 3D Multi-Layered Content Canvas */}
        <div className="relative z-20 h-full [transform-style:preserve-3d]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// 3. Main About Component
// ==========================================
export default function About() {
  return (
    <section id="about" className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 relative bg-black overflow-hidden w-full max-w-full">
      {/* Three.js Interactive 3D Holographic Cyber-Core Background */}
      <AboutHolographicCore />

      {/* Ambient Radial Depth Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] bg-cyan-900/15 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full [perspective:1400px]">
        
        {/* Section Header with 3D Scroll Emergence */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8 [transform-style:preserve-3d]">
          <motion.div
            initial={{ opacity: 0, rotateX: 25, z: -100 }}
            whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-auto [transform-style:preserve-3d]"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 shadow-[0_0_15px_rgba(var(--theme-rgb),0.1)] [transform:translateZ(20px)]">
              <ShieldCheck size={12} className="text-cyan-500 animate-pulse" /> BIOGRAPHY & TARGET ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.95] break-words [transform:translateZ(35px)]">
              ABOUT MD LABIB <br />
              <span className="text-gradient-flow">FOHAYER</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, z: -60 }}
            whileInView={{ opacity: 1, x: 0, z: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[400px] [transform-style:preserve-3d]"
          >
            <h3 className="text-3xl text-cyan-500 font-serif italic mb-2 drop-shadow-[0_0_10px_rgba(var(--theme-rgb),0.3)] [transform:translateZ(25px)]">
              Driven by Passion & Resilience.
            </h3>
            <p className="text-sm text-neutral-400 [transform:translateZ(15px)] leading-relaxed">
              Specialized in engineering robust automation pipelines and high-performance web platforms that replace manual friction with resilient, self-operating intelligence.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid: 3D Spatial Layout */}
        <div className="grid lg:grid-cols-12 gap-6 relative [transform-style:preserve-3d]">
          
          {/* Main Card: The Founder's Story in 3D Multi-Layered Space */}
          <div className="lg:col-span-7 h-auto">
            <motion.div
              initial={{ opacity: 0, rotateY: 18, scale: 0.94 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Spatial3DCard
                maxTilt={7}
                className="glass-card rounded-[2rem] p-8 md:p-12 pb-10 md:pb-12 flex flex-col justify-between h-auto min-h-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden backdrop-blur-2xl bg-black/60"
              >
                {/* 3D Grid & Watermark on Z=0 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[120px] md:text-[160px] text-white/[0.025] opacity-[0.025] pointer-events-none select-none tracking-tighter rotate-[-5deg] [transform:translateZ(0px)] z-0">
                  VISION
                </div>

                {/* Card Header on Z=35px */}
                <div className="relative z-10 [transform-style:preserve-3d]">
                  <h3 className="text-xl font-bold tracking-widest uppercase mb-6 text-white flex items-center gap-3 [transform:translateZ(35px)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping shadow-[0_0_12px_#06b6d4]" />
                    THE FOUNDER'S STORY
                  </h3>

                  {/* Body Text floating on Z=25px */}
                  <div className="space-y-4 text-neutral-300 text-sm md:text-base leading-relaxed [transform:translateZ(25px)]">
                    <p>
                      My journey into tech wasn't conventional. It was driven by pure passion and resilience—transitioning from working hard as a <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(var(--theme-rgb),0.8)] font-medium">delivery rider</span> and salesman to establishing my own tech agency, <strong className="text-cyan-400 drop-shadow-[0_0_8px_rgba(var(--theme-rgb),0.8)] text-lg">Webpulse Automation</strong>.
                    </p>
                    <p>
                      I didn't take the traditional route. By collaborating with advanced AI assistants, I've accelerated my development capabilities to architect systems that compress execution timelines. Instead of relying on slow, manual cycles, I build digital ecosystems that operate autonomously.
                    </p>
                    <p>
                      I have engineered and deployed a wide range of massive platforms from scratch. My portfolio includes the <span className="text-cyan-300 font-medium">Webpulse Automation System</span>, the complete digital transformation of <span className="text-cyan-300 font-medium">Al Madina Model Madrasa</span>, and the <span className="text-cyan-300 font-medium">Madrasa OS Platform</span>. I have also built robust applications like <span className="text-cyan-300 font-medium">BD Mess</span>, <span className="text-cyan-300 font-medium">Ponyopuri E-commerce</span>, and custom <span className="text-cyan-300 font-medium">Expense Trackers</span>—all tailored to deliver high-impact results in record time.
                    </p>
                  </div>
                </div>

                {/* Founder & CEO Subcard floating high on Z=50px with Heavy 3D Shadow */}
                <div className="mt-12 pt-8 border-t border-white/10 relative z-10 [transform:translateZ(50px)] [transform-style:preserve-3d]">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-black/80 border border-cyan-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)]">
                      <GraduationCap className="text-cyan-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm tracking-widest uppercase mb-1">
                        FOUNDER & CEO @ WEBPULSE
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Strong foundational expertise in full-stack architecture, automation algorithms, and building digital solutions that scale.
                      </p>
                    </div>
                  </div>
                </div>
              </Spatial3DCard>
            </motion.div>
          </div>

          {/* Right Cards Stack with 3D Glowing Energy Conduit */}
          <div className="lg:col-span-5 relative [transform-style:preserve-3d]">
            
            {/* 3D Glowing Energy Conduit Guide Rail & Laser Pulse */}
            <div className="absolute left-[24px] top-6 bottom-6 w-[3px] bg-cyan-950/40 border-x border-cyan-500/20 hidden md:block overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)] z-0 rounded-full">
              {/* Traveling High-Intensity Laser Pulse */}
              <motion.div 
                className="absolute top-0 w-full h-[180px] bg-gradient-to-b from-transparent via-cyan-400 to-white shadow-[0_0_25px_#22d3ee] z-10"
                animate={{ top: ["-25%", "125%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Pulsating Energy Nodes Aligned with Targets 01, 02, 03 */}
              {[15, 50, 85].map((top, i) => (
                <div key={i} className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: `${top}%` }}>
                  {/* Outer Ripple */}
                  <motion.div
                    className="absolute -inset-2 rounded-full border border-cyan-400/50"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
                  />
                  {/* Core Node */}
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 h-full md:pl-12 [transform-style:preserve-3d]">
              {/* TARGET 01 */}
              <motion.div
                initial={{ opacity: 0, rotateY: -18, x: 30 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <Spatial3DCard
                  maxTilt={8}
                  className="glass-card rounded-[2rem] p-8 flex-1 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl bg-black/60"
                >
                  <div className="flex justify-between items-center mb-4 [transform:translateZ(35px)]">
                    <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> TARGET 01
                    </span>
                    <span className="px-2.5 py-1 bg-cyan-500/15 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(var(--theme-rgb),0.2)]">
                      <Counter to={10} suffix="X FASTER" />
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2 [transform:translateZ(25px)]">
                    <Counter to={10} suffix="X" /> EXECUTION VELOCITY
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed [transform:translateZ(20px)]">
                    Compressing conventional manual business processes into minutes using custom automation bots and intelligent scripts.
                  </p>
                </Spatial3DCard>
              </motion.div>

              {/* TARGET 02 */}
              <motion.div
                initial={{ opacity: 0, rotateY: -18, x: 30 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <Spatial3DCard
                  maxTilt={8}
                  className="glass-card rounded-[2rem] p-8 flex-1 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl bg-black/60"
                >
                  <div className="flex justify-between items-center mb-4 [transform:translateZ(35px)]">
                    <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> TARGET 02
                    </span>
                    <span className="px-2.5 py-1 bg-cyan-500/15 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(var(--theme-rgb),0.2)]">
                      <Counter to={70} suffix="% SAVINGS" />
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2 [transform:translateZ(25px)]">
                    <Counter to={70} suffix="%" /> COST COMPRESSION
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed [transform:translateZ(20px)]">
                    Eliminating recurring manual overhead and inefficient retainers through deterministic, automated web pipelines.
                  </p>
                </Spatial3DCard>
              </motion.div>

              {/* TARGET 03 */}
              <motion.div
                initial={{ opacity: 0, rotateY: -18, x: 30 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <Spatial3DCard
                  maxTilt={8}
                  className="glass-card rounded-[2rem] p-8 flex-1 border border-white/15 border-t-2 border-t-cyan-500 shadow-[0_20px_40px_rgba(0,0,0,0.7)] bg-gradient-to-br from-black to-cyan-950/30 backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center mb-4 [transform:translateZ(35px)]">
                    <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> TARGET 03
                    </span>
                    <span className="px-2.5 py-1 bg-cyan-500/15 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(var(--theme-rgb),0.2)]">
                      <Counter to={99.9} decimals={1} suffix="% RELIABLE" />
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2 [transform:translateZ(25px)]">
                    PRODUCTION RESILIENCE
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed [transform:translateZ(20px)]">
                    Engineering strict architectures, clean React UI, and automated backends to ensure zero friction in production.
                  </p>
                </Spatial3DCard>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wide Quote Card with Running Border & 3D Lighting */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 relative overflow-hidden rounded-[2rem] p-[1.5px] group w-full max-w-full [transform-style:preserve-3d]"
        >
          {/* Animated Running Border Background */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[500%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(var(--theme-rgb),0.8)_360deg)] z-0 origin-center pointer-events-none"
          />
          
          <div className="relative z-10 w-full h-full bg-[#070b0e] backdrop-blur-2xl rounded-[calc(2rem-1.5px)] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Zap size={12} className="animate-pulse" /> CORE ENGINEERING PHILOSOPHY
              </span>
              <h4 className="text-lg sm:text-2xl md:text-3xl font-bold font-display uppercase tracking-wider text-white leading-relaxed">
                "Turning ideas and resilience into <span className="text-shine drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.8)]">high-impact</span> digital solutions that eliminate operational friction and scale effortlessly."
              </h4>
            </div>
            
            <div className="shrink-0 mt-6 md:mt-0 flex flex-col items-center">
              <div className="relative">
                {/* Ripple Effect Behind Button */}
                <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-20" />
                <div className="absolute inset-0 rounded-full border border-cyan-500 animate-pulse opacity-40 delay-150" />
                
                <MagneticButton>
                  <a href="https://wa.me/8801580506445" className="relative flex items-center gap-3 px-8 py-4 bg-black border border-cyan-500/50 text-cyan-400 text-sm font-bold tracking-widest uppercase rounded-full hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_30px_rgba(var(--theme-rgb),0.6)] transition-all overflow-hidden group/btn">
                    {/* Hover Light Sweep inside button */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover/btn:scale-110 transition-transform">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    WHATSAPP
                  </a>
                </MagneticButton>
              </div>
              <span className="text-[10px] text-neutral-500 tracking-widest uppercase mt-4 block text-center">
                Direct consultation
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
