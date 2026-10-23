"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FloatingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseXRatio: number;
  baseYRatio: number;
  depthRatio: number;
  radius: number;
  mass: number;
  phase: number;
  frequency: number;
  alpha: number;
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
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSectionInView, setIsSectionInView] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // =========================================================================
  // 1. GSAP SCROLLTRIGGER PIN (LOCKS PAGE ON VIEW, UNPINS AFTER ~3 SEC OF SCROLL)
  // =========================================================================
  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=2100", // ~3 seconds of natural continuous scrolling
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
        onEnter: () => {
          setIsSectionInView(true);
        },
        onEnterBack: () => {
          setIsSectionInView(true);
        },
        onLeaveBack: () => {
          setIsSectionInView(false);
        }
      });
    }, sectionRef);

    // Refresh ScrollTrigger calculations after initial mount & layout settle
    const timer = setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  // =========================================================================
  // 2. 120 FPS FLUID WATER & FLOATING PARTICLE ENGINE
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupDimensions();

    // 1,400 White Particles Bobbing in the Water Bed
    const PARTICLE_COUNT = 1400;
    const particles: FloatingParticle[] = [];
    const sizes = [1.6, 2.3, 3.2, 4.2, 5.5];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseXRatio = Math.random();
      // Particles float strictly in the bottom portion of the section (from 60% down to 96%)
      const depthCurve = Math.pow(Math.random(), 1.25);
      const depthRatio = depthCurve;
      const radius = sizes[Math.floor(Math.random() * sizes.length)];
      const alpha = 0.8 + Math.random() * 0.2;

      particles.push({
        x: baseXRatio * width,
        y: (0.62 + depthCurve * 0.34) * height,
        vx: 0,
        vy: 0,
        baseXRatio,
        baseYRatio: 0.62 + depthCurve * 0.34,
        depthRatio,
        radius,
        mass: radius * 0.5 + 0.6,
        phase: Math.random() * Math.PI * 2,
        frequency: 0.85 + Math.random() * 0.45,
        alpha,
        buoyancy: 0.07 + Math.random() * 0.04,
      });
    }

    // Ripple & Pointer Interaction System
    const ripples: WaterRipple[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;
    let mouseSpeed = 0;
    let lastRippleTime = 0;

    const addRipple = (x: number, y: number, intensity: number) => {
      if (ripples.length > 20) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 6,
        maxRadius: Math.min(200 + intensity * 6, 380),
        amplitude: Math.min(16 + intensity * 1.4, 40),
        speed: 4.5 + Math.min(intensity * 0.2, 3.0),
        wavelength: 42,
        alpha: 0.65,
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
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

      const now = performance.now();
      if (now - lastRippleTime > 35 && mouseSpeed > 2.0 && clientY > height * 0.5) {
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

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", setupDimensions);

    // Animation Loop (120 FPS capable)
    let animId: number;
    let lastTime = performance.now();
    const startTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      const dt = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;
      const time = (now - startTime) * 0.001;

      mouseSpeed *= 0.94;

      // Draw Vibrant Glowing Royal Blue Water Gradient
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, "#0c1bf0");
      waterGrad.addColorStop(0.48, "#1024f5");
      waterGrad.addColorStop(1, "#07129c");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // Expanding Water Waves & Caustic Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed * (dt * 60);
        r.alpha *= Math.pow(0.965, dt * 60);
        r.amplitude *= Math.pow(0.965, dt * 60);

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.38})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        if (r.radius > 20) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.75, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100, 180, 255, ${r.alpha * 0.22})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }

        if (r.alpha < 0.015 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Trochoidal / Gerstner Water Wave Equation (Organic Living Sea Swell)
      const computeWaterSurface = (x: number, freq: number, phase: number) => {
        const normX = x / width;
        const w1 = Math.sin(normX * 5.8 + time * (1.6 * freq) + phase) * 15;
        const w2 = Math.cos(normX * 10.4 - time * (2.1 * freq) + phase * 1.2) * 9;
        const w3 = Math.sin((x * 0.008) + time * (2.8 * freq)) * 5;
        const verticalWave = w1 + w2 + w3;
        const horizontalWave = Math.cos(normX * 5.8 + time * (1.6 * freq) + phase) * 7;
        return { verticalWave, horizontalWave };
      };

      const fpsRatio = dt * 60;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        const targetBaseX = p.baseXRatio * width;
        const surfaceBaseY = height * 0.62;
        const particleRestingY = surfaceBaseY + p.depthRatio * (height * 0.34);

        const { verticalWave, horizontalWave } = computeWaterSurface(targetBaseX, p.frequency, p.phase);

        let waterY = particleRestingY + verticalWave;
        let waterX = targetBaseX + horizontalWave;

        // Dynamic Ripple Displacement
        for (let j = 0; j < ripples.length; j++) {
          const r = ripples[j];
          const dx = p.x - r.x;
          const dy = p.y - r.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const distFromWave = dist - r.radius;
          if (Math.abs(distFromWave) < r.wavelength) {
            const wavePhase = (distFromWave / r.wavelength) * Math.PI;
            const elevation = Math.cos(wavePhase) * r.amplitude;
            waterY += elevation;

            const pushSlope = Math.sin(wavePhase) * (r.amplitude / r.wavelength) * 2.0;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            p.vx += nx * pushSlope * fpsRatio;
            p.vy += ny * pushSlope * fpsRatio;
          }
        }

        // Archimedes Water Buoyancy Spring
        const distY = waterY - p.y;
        const distX = waterX - p.x;

        p.vy += distY * p.buoyancy * fpsRatio;
        p.vx += distX * 0.02 * fpsRatio;

        // Mouse Wake Repulsion
        if (mouseX > -1000) {
          const cdx = p.x - mouseX;
          const cdy = p.y - mouseY;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          const pushRadius = Math.min(120 + mouseSpeed * 3, 220);

          if (cdist < pushRadius && cdist > 0.01) {
            const factor = Math.pow(1 - cdist / pushRadius, 1.8);
            const force = (factor * (15 + mouseSpeed * 1.5)) / p.mass;
            p.vx += (cdx / cdist) * force * fpsRatio;
            p.vy += ((cdy / cdist) * force - factor * 6) * fpsRatio;
          }
        }

        // Viscous Fluid Damping
        const damping = Math.pow(0.895, fpsRatio);
        p.vx *= damping;
        p.vy *= damping;

        // Position Integration
        p.x += p.vx * fpsRatio;
        p.y += p.vy * fpsRatio;

        // Hard Water Surface Limit: Keep particles strictly floating in the bottom water bed
        const minSurfaceLimit = height * 0.58 + verticalWave;
        if (p.y < minSurfaceLimit) {
          p.y = minSurfaceLimit;
          p.vy = Math.abs(p.vy) * 0.25;
        }

        // Wrap around horizontal boundaries
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
      }

      // Draw Batched Floating Beads
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", setupDimensions);
    };
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      if (typeof window !== "undefined" && window.lenisInstance) {
        window.lenisInstance.scrollTo(contactSection as HTMLElement, { offset: -20, duration: 1.3 });
      } else {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="work-together"
      ref={sectionRef}
      className="relative w-full h-screen min-h-screen bg-gradient-to-b from-[#0c1bf0] via-[#1024f5] to-[#07129c] overflow-hidden select-none cursor-crosshair"
      aria-label="Let's work together interactive call to action"
    >
      <div 
        ref={containerRef}
        className="relative w-full h-full flex flex-col justify-between items-center py-10 sm:py-14"
      >
        {/* Interactive Water Surface & Floating Particles Canvas (120 FPS Unlocked) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-auto z-0 block"
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

        {/* Top HUD Status Bar */}
        <div className="relative z-10 w-full max-w-7xl px-8 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/90 uppercase font-medium">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>INTERACTIVE FLUID BED // WATER SURFACE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
            <span>LIQUID BUOYANCY ENGINE // 120 FPS</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Center Headline Rising from Beneath Water Surface */}
        {/* ======================================================== */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 text-center pointer-events-none select-none overflow-hidden py-6">
          {/* Top Micro-Heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.28em] uppercase text-white/95 mb-4 sm:mb-6 font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
          >
            IS YOUR BIG IDEA READY TO GO WILD?
          </motion.p>

          {/* Headline Emerging & Rising out of the Water Surface */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isSectionInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-56 sm:w-80 md:w-[32rem] lg:w-[40rem] h-2 sm:h-2.5 bg-white rounded-full mt-4 sm:mt-6 shadow-[0_0_25px_rgba(255,255,255,0.8)] origin-center"
            />
          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* Bottom Interactive Pill Button with Scroll Progress Gauge */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative z-20 pb-2"
        >
          <a
            href="#contact"
            onClick={scrollToContact}
            className="group relative flex items-center gap-3 px-8 py-3.5 sm:py-4 bg-white text-black rounded-full text-[11px] font-mono tracking-[0.25em] uppercase font-bold shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer overflow-hidden border border-white/40"
          >
            {/* Visual Scroll Lock Fill Bar: Shows progress through the ~3-second pin */}
            <div 
              className="absolute inset-0 bg-blue-100/70 pointer-events-none transition-all duration-150"
              style={{ width: `${Math.min(100, Math.round(scrollProgress * 100))}%` }}
            />

            <span className="w-1.5 h-1.5 rounded-full bg-[#1024f5] animate-ping relative z-10 shrink-0" />
            
            <span className="relative z-10 font-bold">
              {scrollProgress >= 0.95 ? "↓ ENTER CONTACT ↓" : "↓ CONTINUE TO SCROLL ↓"}
            </span>

            <span className="relative z-10 text-[9px] text-blue-900/80 font-mono hidden sm:inline-block">
              {Math.round(scrollProgress * 100)}%
            </span>

            <ArrowDown size={14} className="text-black group-hover:translate-y-0.5 transition-transform relative z-10 shrink-0" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
