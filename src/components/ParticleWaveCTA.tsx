"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

interface Particle {
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

export default function ParticleWaveCTA() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Letter flip references
  const line1ContainerRef = useRef<HTMLSpanElement>(null);
  const line2ContainerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // ========================================================
    // 1. DYNAMIC LETTER FLIP ENGINE
    // ========================================================
    const line1Text = "Let's work";
    const line2Text = "together!";
    const line1El = line1ContainerRef.current;
    const line2El = line2ContainerRef.current;
    if (!line1El || !line2El) return;

    line1El.innerHTML = "";
    line2El.innerHTML = "";

    const allLetterSlots: { element: HTMLElement; state: number }[] = [];

    const createSlot = (char: string) => {
      if (char === " ") {
        const space = document.createElement("span");
        space.style.display = "inline-block";
        space.style.width = "0.3em";
        space.innerHTML = "&nbsp;";
        return space;
      }

      const slot = document.createElement("span");
      slot.className = "inline-block overflow-hidden h-[1.05em] leading-[1.05em] align-middle relative";

      const strip = document.createElement("span");
      strip.className = "flex flex-col will-change-transform";
      strip.style.transform = "translateY(0%)";
      strip.style.transition = "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)";

      // Primary Char
      const c1 = document.createElement("span");
      c1.className = "h-[1.05em] leading-[1.05em] flex items-center justify-center";
      c1.textContent = char;

      // Stylized Italic Serif Char
      const c2 = document.createElement("span");
      c2.className = "h-[1.05em] leading-[1.05em] flex items-center justify-center font-serif italic font-normal text-white";
      c2.textContent = char;

      // Repeat Primary Char
      const c3 = document.createElement("span");
      c3.className = "h-[1.05em] leading-[1.05em] flex items-center justify-center";
      c3.textContent = char;

      strip.appendChild(c1);
      strip.appendChild(c2);
      strip.appendChild(c3);

      slot.appendChild(strip);

      allLetterSlots.push({ element: strip, state: 0 });
      return slot;
    };

    for (const ch of line1Text) line1El.appendChild(createSlot(ch));
    for (const ch of line2Text) line2El.appendChild(createSlot(ch));

    let flipTimeout: NodeJS.Timeout;
    const triggerFlip = () => {
      if (allLetterSlots.length > 0) {
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * allLetterSlots.length);
          const slot = allLetterSlots[idx];
          slot.state = (slot.state + 1) % 3;

          if (slot.state === 1) {
            slot.element.style.transition = "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)";
            slot.element.style.transform = "translateY(-33.333%)";
          } else if (slot.state === 2) {
            slot.element.style.transition = "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)";
            slot.element.style.transform = "translateY(-66.666%)";
          } else {
            slot.element.style.transition = "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)";
            slot.element.style.transform = "translateY(-66.666%)";
            setTimeout(() => {
              slot.element.style.transition = "none";
              slot.element.style.transform = "translateY(0%)";
            }, 820);
          }
        }
      }
      flipTimeout = setTimeout(triggerFlip, 1000 + Math.random() * 500);
    };

    flipTimeout = setTimeout(triggerFlip, 1200);

    return () => {
      clearTimeout(flipTimeout);
    };
  }, []);

  useEffect(() => {
    // ========================================================
    // 2. CANVAS FLUID PHYSICS (2,100 Particles + 180px Wave Wake)
    // ========================================================
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    const PARTICLE_COUNT = 2100;
    const particles: Particle[] = [];
    const sizes = [2.0, 2.8, 3.8, 5.2, 7.0, 9.0];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseXRatio = Math.random();
      const depthCurve = Math.pow(Math.random(), 1.5);
      const baseYRatio = 0.52 + depthCurve * 0.44;
      const radius = sizes[Math.floor(Math.random() * sizes.length)];

      particles.push({
        x: baseXRatio * width,
        y: baseYRatio * height,
        vx: 0,
        vy: 0,
        baseXRatio,
        baseYRatio,
        radius,
        mass: radius * 0.65,
        phase: Math.random() * Math.PI * 2,
        buoyancy: 0.055 + Math.random() * 0.045,
      });
    }

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

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animId: number;
    const startTime = performance.now();

    const getLiquidHeight = (x: number, y: number, time: number) => {
      const normX = x / width;
      const swell1 = Math.sin(normX * 6.2 + time * 1.8) * 20;
      const swell2 = Math.cos(normX * 10.5 - time * 2.4) * 14;
      const swell3 = Math.sin((x + y) * 0.007 + time * 3.2) * 8;
      return swell1 + swell2 + swell3;
    };

    const simulateAndRender = () => {
      animId = requestAnimationFrame(simulateAndRender);
      if (!isVisible) return;

      const time = (performance.now() - startTime) * 0.001;
      mouseSpeed *= 0.91;

      // 1. Pure Electric Royal Blue (#1A2FFB)
      ctx.fillStyle = "#1A2FFB";
      ctx.fillRect(0, 0, width, height);

      const REPULSION_RADIUS = 180;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        const targetX = p.baseXRatio * width;
        const waveElevation = getLiquidHeight(p.x, p.y, time);
        const surfaceY = p.baseYRatio * height + waveElevation;

        // Spring restoration toward resting wave baseline
        const dy = surfaceY - p.y;
        const dx = targetX - p.x;
        p.vy += dy * p.buoyancy;
        p.vx += dx * 0.018;

        // Mouse 180px fluid wave wake
        if (isHovering && mouseX > -1000) {
          const distX = p.x - mouseX;
          const distY = p.y - mouseY;
          const dist = Math.sqrt(distX * distX + distY * distY);

          if (dist < REPULSION_RADIUS && dist > 0.01) {
            const factor = Math.pow(1 - dist / REPULSION_RADIUS, 1.8);
            const push = (factor * (20 + mouseSpeed * 1.6)) / p.mass;
            const normX = distX / dist;
            const normY = distY / dist;

            p.vx += normX * push;
            p.vy += normY * push;

            // Fluid upward surge wake
            p.vy -= factor * (18 + mouseSpeed * 2.2) / p.mass;
          }
        }

        // Fluid friction damping
        p.vx *= 0.90;
        p.vy *= 0.90;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
      }

      // 2. Pure White Dots (#FFFFFF)
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    simulateAndRender();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
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
      className="relative w-full h-screen min-h-screen bg-[#1A2FFB] overflow-hidden flex flex-col justify-between items-center py-8 md:py-10 px-6 sm:px-12 select-none cursor-crosshair"
      aria-label="Let's work together interactive call to action"
    >
      {/* 2,100 Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-1"
      />

      {/* Ambient Radial Electric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(60,95,255,0.45)_0%,_transparent_70%)] pointer-events-none z-2" />

      {/* Decorative Grid Plus Markers (+) */}
      <span className="absolute top-24 left-8 sm:left-12 text-white/50 font-mono text-base pointer-events-none select-none z-10">+</span>
      <span className="absolute top-1/2 left-8 sm:left-12 -translate-y-1/2 text-white/50 font-mono text-base pointer-events-none select-none z-10">+</span>
      <span className="absolute bottom-24 left-8 sm:left-12 text-white/50 font-mono text-base pointer-events-none select-none z-10">+</span>
      <span className="absolute top-24 right-8 sm:right-12 text-white/50 font-mono text-base pointer-events-none select-none z-10">+</span>
      <span className="absolute top-1/2 right-8 sm:right-12 -translate-y-1/2 text-white/50 font-mono text-base pointer-events-none select-none z-10">+</span>
      <span className="absolute bottom-24 right-8 sm:right-12 text-white/50 font-mono text-base pointer-events-none select-none z-10">+</span>

      {/* ======================================================== */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ======================================================== */}
      <header className="relative z-10 w-full flex items-center justify-between pointer-events-auto">
        <a href="#" className="font-bold text-2xl tracking-tight text-white uppercase">
          LABIB
        </a>

        <div className="flex items-center gap-3">
          {/* Audio Sound-Wave Circle Button */}
          <button
            aria-label="Audio Wave"
            className="w-11 h-11 rounded-full border border-white/60 bg-transparent flex items-center justify-center gap-[3px] hover:bg-white/10 transition-colors"
          >
            <span className="w-[2px] h-2.5 bg-white rounded-full animate-pulse" />
            <span className="w-[2px] h-4 bg-white rounded-full animate-pulse delay-75" />
            <span className="w-[2px] h-2 bg-white rounded-full animate-pulse delay-150" />
            <span className="w-[2px] h-3.5 bg-white rounded-full animate-pulse delay-100" />
          </button>

          {/* Dark Blue Pill "LET'S TALK" */}
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E1CA3] border border-white/20 text-white text-xs font-bold tracking-widest uppercase hover:bg-[#0A1580] transition-colors shadow-lg"
          >
            <span>LET&apos;S TALK</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </a>

          {/* White Pill "MENU" */}
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-extrabold tracking-widest uppercase hover:bg-neutral-100 transition-colors shadow-lg"
          >
            <span>MENU</span>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-black" />
              <span className="w-1 h-1 rounded-full bg-black" />
            </div>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. CENTER TYPOGRAPHY & LETTER FLIP LOCKUP */}
      {/* ======================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 text-center pointer-events-none select-none">
        <p className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-white/95 mb-4 sm:mb-6 font-semibold">
          IS YOUR BIG IDEA READY TO GO WILD?
        </p>

        <h2 className="text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[8.5rem] font-extrabold tracking-tight text-white leading-[1.05] text-center drop-shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
          <span ref={line1ContainerRef} className="flex items-center justify-center" />
          <span ref={line2ContainerRef} className="flex items-center justify-center" />
        </h2>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM PILL BUTTON (SCROLLS TO CONTACT) */}
      {/* ======================================================== */}
      <div className="relative z-20 pb-2">
        <a
          href="#contact"
          onClick={scrollToContact}
          className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[11px] font-mono tracking-[0.25em] uppercase font-bold shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A2FFB] animate-ping" />
          <span>↓ CONTINUE TO SCROLL ↓</span>
          <ArrowDown size={14} className="text-black group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
