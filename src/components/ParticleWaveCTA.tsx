"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface FloatingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseXRatio: number;
  baseYRatio: number;
  radius: number;
  mass: number;
  phase: number;
  buoyancy: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  speed: number;
  wavelength: number;
  alpha: number;
}

export default function ParticleWaveCTA() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    // ========================================================
    // 1. Floating Particle Pool (1,300 Particles Floating on Water)
    // ========================================================
    const PARTICLE_COUNT = 1350;
    const particles: FloatingParticle[] = [];
    const sizes = [1.5, 2.2, 3.2, 4.4, 5.8];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseXRatio = Math.random();
      // Particles rest across the water bed, with denser foam in bottom 55%
      const depthCurve = Math.pow(Math.random(), 1.4);
      const baseYRatio = 0.52 + depthCurve * 0.42;
      const radius = sizes[Math.floor(Math.random() * sizes.length)];

      particles.push({
        x: baseXRatio * width,
        y: baseYRatio * height,
        vx: 0,
        vy: 0,
        baseXRatio,
        baseYRatio,
        radius,
        mass: radius * 0.6,
        phase: Math.random() * Math.PI * 2,
        buoyancy: 0.06 + Math.random() * 0.04,
      });
    }

    // ========================================================
    // 2. Liquid Ripple System (Water Waves on Cursor Move)
    // ========================================================
    const ripples: WaterRipple[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;
    let mouseSpeed = 0;
    let lastRippleTime = 0;

    const addRipple = (x: number, y: number, intensity: number) => {
      if (ripples.length > 25) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 8,
        maxRadius: Math.min(220 + intensity * 6, 420),
        amplitude: Math.min(18 + intensity * 1.5, 45),
        speed: 4.2 + Math.min(intensity * 0.25, 3.5),
        wavelength: 45,
        alpha: 0.65,
      });
    };

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

      // Drop water ripples as cursor sweeps through liquid
      const now = performance.now();
      if (now - lastRippleTime > 45 && mouseSpeed > 2.5) {
        addRipple(clientX, clientY, mouseSpeed);
        lastRippleTime = now;
      }
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      prevMouseX = -9999;
      prevMouseY = -9999;
      mouseSpeed = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    // ========================================================
    // 3. Resize Handling
    // ========================================================
    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ========================================================
    // 4. Performance Safeguard: IntersectionObserver
    // ========================================================
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(container);

    // ========================================================
    // 5. Water Surface & Buoyancy Simulation Loop
    // ========================================================
    let animId: number;
    let startTime = performance.now();

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const time = (performance.now() - startTime) * 0.001;
      mouseSpeed *= 0.93;

      // 1. Draw Deep Glowing Royal Blue Liquid Water Gradient
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, "#0e1ff3");
      waterGrad.addColorStop(0.5, "#1024f5");
      waterGrad.addColorStop(1, "#07129c");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Update and Render Expanding Water Waves / Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= 0.965;
        r.amplitude *= 0.965;

        // Render visible water wave ripples on the liquid surface
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.35})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Secondary concentric caustic echo
        if (r.radius > 25) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.72, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(90, 160, 255, ${r.alpha * 0.25})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        if (r.alpha < 0.015 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 3. Natural Oceanic Ambient Liquid Swell Equation
      const getAmbientSwell = (x: number, y: number) => {
        const normX = x / width;
        // Natural cradle: undulating wave crests
        const swell1 = Math.sin(normX * 6.5 + time * 1.8 + y * 0.003) * 16;
        const swell2 = Math.cos(normX * 10.2 - time * 2.3 + y * 0.004) * 10;
        const swell3 = Math.sin((x + y) * 0.008 + time * 3.1) * 6;
        return swell1 + swell2 + swell3;
      };

      // 4. Update Each Particle Floating on Water Surface
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Base resting coordinate on the liquid body
        const targetX = p.baseXRatio * width;
        const baseWaterY = p.baseYRatio * height;

        // Calculate cumulative water height and fluid slope at particle's location
        let waterHeightOffset = getAmbientSwell(p.x, p.y);
        let fluidPushX = 0;
        let fluidPushY = 0;

        for (let j = 0; j < ripples.length; j++) {
          const r = ripples[j];
          const dx = p.x - r.x;
          const dy = p.y - r.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Interaction with expanding wave front
          const distFromFront = dist - r.radius;
          if (Math.abs(distFromFront) < r.wavelength) {
            const phase = (distFromFront / r.wavelength) * Math.PI;
            const elevation = Math.cos(phase) * r.amplitude;
            waterHeightOffset += elevation;

            // Fluid wave slope pushes particles outward like real water
            const slope = Math.sin(phase) * (r.amplitude / r.wavelength);
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            fluidPushX += nx * slope * 2.4;
            fluidPushY += ny * slope * 2.4;
          }
        }

        // Target surface height for this floating droplet
        const surfaceY = baseWaterY + waterHeightOffset;

        // A. Archimedes Buoyancy: Particle wants to stay right on water surface
        const dy = surfaceY - p.y;
        const dx = targetX - p.x;
        p.vy += dy * p.buoyancy;
        p.vx += dx * 0.015;

        // B. Wave Advection: Water wave pushes particle along surface
        p.vx += fluidPushX;
        p.vy += fluidPushY;

        // C. Direct Mouse Repulsion Wake (Water Displacement)
        if (mouseX > -1000) {
          const cdx = p.x - mouseX;
          const cdy = p.y - mouseY;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          const pushRadius = Math.min(130 + mouseSpeed * 3.5, 240);

          if (cdist < pushRadius && cdist > 0.01) {
            const factor = Math.pow(1 - cdist / pushRadius, 1.8);
            const push = (factor * (18 + mouseSpeed * 1.8)) / p.mass;
            p.vx += (cdx / cdist) * push;
            p.vy += (cdy / cdist) * push - factor * 8; // upward splash
          }
        }

        // D. Fluid Friction / Viscous Damping
        p.vx *= 0.895;
        p.vy *= 0.895;

        // E. Position Integration
        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wrapping
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
      }

      // 5. Batched 60FPS Hardware Draw for All Floating White Beads
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    render();

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
      className="relative w-full min-h-[90vh] md:min-h-screen bg-gradient-to-b from-[#0e1ff3] via-[#1024f5] to-[#07129c] overflow-hidden flex flex-col justify-between items-center py-12 md:py-16 select-none cursor-crosshair"
      aria-label="Let's work together interactive call to action"
    >
      {/* Interactive Water Surface & Floating Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      />

      {/* Decorative Grid Crosshairs (+) */}
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

      {/* Top HUD Status */}
      <div className="relative z-10 w-full max-w-7xl px-8 sm:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/90 uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>LUSION FLUID BED // WATER SURFACE</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
          <span>BUOYANCY SIMULATION // 60 FPS</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Center Headline Rising from Beneath Water Surface */}
      {/* ======================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 text-center pointer-events-none select-none overflow-hidden py-6">
        {/* Top Micro-Heading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.28em] uppercase text-white/95 mb-4 sm:mb-6 font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        >
          IS YOUR BIG IDEA READY TO GO WILD?
        </motion.p>

        {/* Headline Emerging & Rising out of the Water Surface */}
        <motion.div
          initial={{ y: 110, opacity: 0, filter: "blur(10px)" }}
          animate={isSectionInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : { y: 110, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h2 className="text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[9.5rem] font-bold tracking-tight text-white leading-[0.92] text-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            Let&apos;s work<br />
            together!
          </h2>

          {/* Liquid Underline Expanding Across */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isSectionInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-56 sm:w-80 md:w-[32rem] lg:w-[40rem] h-2 sm:h-2.5 bg-white rounded-full mt-4 sm:mt-6 shadow-[0_0_25px_rgba(255,255,255,0.8)] origin-center"
          />
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* Bottom Interactive White Pill Button */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
        className="relative z-20 pb-4"
      >
        <a
          href="#contact"
          onClick={scrollToContact}
          className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[11px] font-mono tracking-[0.25em] uppercase font-bold shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1024f5] animate-ping" />
          <span>↓ CONTINUE TO SCROLL ↓</span>
          <ArrowDown size={14} className="text-black group-hover:translate-y-0.5 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
