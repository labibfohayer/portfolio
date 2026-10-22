"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseXRatio: number;
  yOffset: number;
  radius: number;
  mass: number;
  phase: number;
}

export default function ParticleWaveCTA() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    // ========================================================
    // 1. Particle Pool Initialization (1,600 Dense White Particles)
    // ========================================================
    const PARTICLE_COUNT = 1600;
    const particles: Particle[] = [];
    const possibleRadii = [1.5, 2.2, 3.2, 4.2, 5.5];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseXRatio = (i + Math.random() * 0.9) / PARTICLE_COUNT;
      const radius = possibleRadii[Math.floor(Math.random() * possibleRadii.length)];

      // Vertical foam depth distribution: dense along the wave crest, spreading downward
      const depthDistribution = Math.pow(Math.random(), 1.6);
      const yOffset = depthDistribution * 260 - 80;

      particles.push({
        x: baseXRatio * width,
        y: height * 0.68 + yOffset,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseXRatio,
        yOffset,
        radius,
        mass: radius * 0.55,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ========================================================
    // 2. Mouse & Touch Velocity Tracking with Smooth Lerp
    // ========================================================
    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;
    let mouseSpeed = 0;
    let isHovering = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (prevMouseX !== -9999) {
        const dx = clientX - prevMouseX;
        const dy = clientY - prevMouseY;
        mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      }
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = clientX;
      mouseY = clientY;
      isHovering = true;
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      prevMouseX = -9999;
      prevMouseY = -9999;
      mouseSpeed = 0;
      isHovering = false;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    // ========================================================
    // 3. Dynamic Resize Handling
    // ========================================================
    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ========================================================
    // 4. Performance Safeguard: IntersectionObserver (Locked 60FPS)
    // ========================================================
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ========================================================
    // 5. Dynamic Multi-Frequency Wave Equilibrium Equation
    // ========================================================
    const getWaveBaseline = (x: number, w: number, h: number, time: number) => {
      const normX = x / w;
      // Parabolic cradle: high crests on left and right edges, undulating across center 55%
      const cradle = Math.pow(Math.abs(normX - 0.5) * 2, 1.85) * (h * 0.16);
      const baseHeight = h * 0.67 - cradle;

      // Multi-sine harmonic traveling waves
      const wave1 = Math.sin(normX * 5.5 + time * 1.8) * 26;
      const wave2 = Math.cos(normX * 9.8 - time * 2.4) * 16;
      const wave3 = Math.sin(normX * 16.5 + time * 3.5) * 8;

      return baseHeight + wave1 + wave2 + wave3;
    };

    // ========================================================
    // 6. Physics Simulation Loop
    // ========================================================
    let animId: number;
    let startTime = performance.now();

    const simulateAndRender = () => {
      animId = requestAnimationFrame(simulateAndRender);
      if (!isVisible) return;

      const time = (performance.now() - startTime) * 0.001;

      // Decay mouse speed smoothly
      mouseSpeed *= 0.92;

      // Clear Canvas to let the vibrant CSS royal-blue gradient glow through
      ctx.clearRect(0, 0, width, height);

      // Repulsion radius expands dynamically with higher cursor velocity
      const dynamicRepulsionRadius = Math.min(170 + mouseSpeed * 4.0, 300);

      // --- Spatial Particle Physics Calculation ---
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Equilibrium targets
        const targetX = p.baseXRatio * width;
        const targetY = getWaveBaseline(p.x, width, height, time) + p.yOffset;

        // A. Spring Restoration towards resting wave
        const dy = targetY - p.y;
        const dx = targetX - p.x;
        p.vy += dy * 0.045;
        p.vx += dx * 0.024;

        // B. Gravity Pull for airborne splash droplets
        if (p.y < targetY - 20) {
          p.vy += 0.52; // Gravity accelerates falling droplets back down
        } else if (p.y > targetY + 15) {
          // Buoyancy lift
          p.vy -= 0.18;
        }

        // C. Organic Breathing Turbulence (Liquid Foam Ripples)
        p.vy += Math.sin(time * 2.6 + p.phase) * 0.14;
        p.vx += Math.cos(time * 1.9 + p.phase) * 0.09;

        // D. Explosive Mouse Repulsion & Upward Fountain Splash
        if (isHovering && mouseX > -1000) {
          const distX = p.x - mouseX;
          const distY = p.y - mouseY;
          const dist = Math.sqrt(distX * distX + distY * distY);

          if (dist < dynamicRepulsionRadius && dist > 0.001) {
            const factor = Math.pow(1 - dist / dynamicRepulsionRadius, 1.75);
            const normX = distX / dist;
            const normY = distY / dist;

            // Radial outward blast
            const push = factor * (24 + mouseSpeed * 2.0) / p.mass;
            p.vx += normX * push;
            p.vy += normY * push;

            // Powerful upward splash wake shooting dots around the letters
            const upwardSplash = factor * (22 + mouseSpeed * 2.6) / p.mass;
            p.vy -= upwardSplash;
            p.vx += (Math.random() - 0.5) * factor * 14;
          }
        }

        // E. Damping / Fluid Friction
        p.vx *= 0.912;
        p.vy *= 0.912;

        // F. Integrate Position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
      }

      // --- Batched Single Draw Call for Maximum 60FPS Performance ---
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    simulateAndRender();

    // ========================================================
    // 7. Resource Cleanup on Unmount
    // ========================================================
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[85vh] md:min-h-screen bg-gradient-to-b from-[#0e1ff3] via-[#1024f5] to-[#0914be] overflow-hidden flex flex-col justify-between items-center py-12 md:py-16 select-none cursor-crosshair"
      aria-label="Let's work together interactive call to action"
    >
      {/* Ambient Radial Electric Glow in Center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,_rgba(80,120,255,0.45)_0%,_transparent_75%)] pointer-events-none z-0" />

      {/* Hardware-Accelerated 2D Particle Physics Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      />

      {/* ======================================================== */}
      {/* Lusion Signature Grid Crosshair Markers (+) */}
      {/* ======================================================== */}
      <span className="absolute top-8 left-8 sm:left-12 text-white/60 font-mono text-sm leading-none pointer-events-none select-none z-10">
        +
      </span>
      <span className="absolute top-1/2 left-8 sm:left-12 -translate-y-1/2 text-white/60 font-mono text-sm leading-none pointer-events-none select-none z-10">
        +
      </span>
      <span className="absolute bottom-8 left-8 sm:left-12 text-white/60 font-mono text-sm leading-none pointer-events-none select-none z-10">
        +
      </span>

      <span className="absolute top-8 right-8 sm:right-12 text-white/60 font-mono text-sm leading-none pointer-events-none select-none z-10">
        +
      </span>
      <span className="absolute top-1/2 right-8 sm:right-12 -translate-y-1/2 text-white/60 font-mono text-sm leading-none pointer-events-none select-none z-10">
        +
      </span>
      <span className="absolute bottom-8 right-8 sm:right-12 text-white/60 font-mono text-sm leading-none pointer-events-none select-none z-10">
        +
      </span>

      {/* Top HUD Telemetry Status */}
      <div className="relative z-10 w-full max-w-7xl px-8 sm:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/90 uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>LUSION DYNAMICS // PARTICLE FIELD</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
          <span>1,600 SIMULATED BODIES // 60 FPS</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Center Hero Typography Lockup */}
      {/* ======================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 text-center pointer-events-none select-none">
        {/* Top Micro-Heading */}
        <p className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.28em] uppercase text-white/95 mb-4 sm:mb-6 font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
          IS YOUR BIG IDEA READY TO GO WILD?
        </p>

        {/* Main Massive Hero Headline */}
        <h2 className="text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[9.5rem] font-bold tracking-tight text-white leading-[0.92] text-center drop-shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          Let&apos;s work<br />
          together!
        </h2>

        {/* Crisp Solid White Underline Beneath "together!" */}
        <div className="w-56 sm:w-80 md:w-[32rem] lg:w-[40rem] h-2 sm:h-2.5 bg-white rounded-full mt-4 sm:mt-6 shadow-[0_0_25px_rgba(255,255,255,0.7)]" />
      </div>

      {/* ======================================================== */}
      {/* Bottom Interactive White Pill Button (Scrolls to Contact) */}
      {/* ======================================================== */}
      <div className="relative z-20 pb-4">
        <a
          href="#contact"
          onClick={scrollToContact}
          className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[11px] font-mono tracking-[0.25em] uppercase font-bold shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1024f5] animate-ping" />
          <span>↓ CONTINUE TO SCROLL ↓</span>
          <ArrowDown size={14} className="text-black group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
