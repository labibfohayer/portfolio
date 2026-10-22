"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  Bot, 
  Layout, 
  Briefcase, 
  ShoppingCart, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Cpu
} from "lucide-react";

// Register ScrollTrigger safely for Next.js SSR / Client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  { 
    id: "01", 
    category: "AUTONOMOUS AGENTS",
    title: "AI Automation & Smart Bots", 
    desc: "Custom AI-driven chatbots, workflow automations, and intelligent data-pipelines engineered for 24/7 autonomous operations.",
    icon: <Bot size={24} className="text-cyan-400" />,
    bgType: "AI",
    tech: ["Python", "OpenAI", "LangChain", "TensorFlow"],
    features: ["Custom LLM Chatbots", "Workflow Automation", "Data Pipeline Architecture", "API Integration"],
    stats: { value: "10X", label: "Faster Workflows", capacity: 96 },
    status: "SYSTEM OPERATIONAL"
  },
  { 
    id: "02", 
    category: "NEXT-GEN FULLSTACK",
    title: "Full-Stack Web Architecture", 
    desc: "Scalable, high-performance responsive web applications built with modern frameworks and sub-second render pipelines.",
    icon: <Layout size={24} className="text-cyan-400" />,
    bgType: "WEB",
    tech: ["React", "Next.js", "Node.js", "TailwindCSS"],
    features: ["Responsive UI/UX", "Scalable Backend APIs", "Database Optimization", "Secure Authentication"],
    stats: { value: "99.9%", label: "Uptime & Reliability", capacity: 99 },
    status: "PRODUCTION ACTIVE"
  },
  { 
    id: "03", 
    category: "CLOUD ENTERPRISE",
    title: "Business & SaaS Tools", 
    desc: "Cloud-based utility applications automating daily accounts, billing, resource management, and multi-tenant architectures.",
    icon: <Briefcase size={24} className="text-cyan-400" />,
    bgType: "SAAS",
    tech: ["MongoDB", "Express", "Firebase", "PostgreSQL"],
    features: ["Custom Dashboards", "Billing & Invoicing", "Multi-tenant Architecture", "Real-time Analytics"],
    stats: { value: "100%", label: "Client Satisfaction", capacity: 94 },
    status: "ENGINE ONLINE"
  },
  { 
    id: "04", 
    category: "COMMERCE INFRA",
    title: "E-Commerce Infrastructure", 
    desc: "End-to-end e-commerce solutions, high-converting product grids, and instant WhatsApp conversion checkout funnels.",
    icon: <ShoppingCart size={24} className="text-cyan-400" />,
    bgType: "ECOMMERCE",
    tech: ["Next.js", "Stripe", "Prisma", "AWS"],
    features: ["Seamless Cart Experience", "Payment Gateway Integration", "Inventory Management", "Order Tracking"],
    stats: { value: "50+", label: "Successful Deployments", capacity: 92 },
    status: "READY FOR SCALE"
  },
];

function AnimatedBackground({ type }: { type: string }) {
  switch (type) {
    case "AI":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(var(--theme-rgb),1)]"
              animate={{ 
                y: [Math.random() * 80, Math.random() * -80], 
                x: [Math.random() * 40, Math.random() * -40],
                opacity: [0.2, 0.9, 0.2]
              }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
              style={{ top: `${15 + i * 15}%`, left: `${20 + i * 12}%` }}
            />
          ))}
        </div>
      );
    case "WEB":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--theme-rgb),0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--theme-rgb),0.07)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div 
            animate={{ y: [-80, 400] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/3 w-[1px] h-[80px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent" 
          />
        </div>
      );
    case "SAAS":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden flex items-end justify-center gap-4 pb-12">
          {[35, 60, 45, 75, 50].map((h, i) => (
            <motion.div 
              key={i}
              className="w-2.5 bg-gradient-to-t from-cyan-900/40 via-cyan-500/30 to-cyan-400/50 rounded-t-sm"
              animate={{ height: [h/2, h, h/2] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      );
    case "ECOMMERCE":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden flex gap-6 justify-center">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-[1px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
              animate={{ y: [-100, 450] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

// ==========================================
// Card Front: Full Capability Details
// ==========================================
function ServiceCard({ service }: { service: typeof services[0] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-6 xl:p-7 flex flex-col justify-between h-full min-h-[450px] xl:min-h-[480px] bg-[#070b0e]/95 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_15px_45px_rgba(var(--theme-rgb),0.2)] backdrop-blur-2xl overflow-hidden pointer-events-auto"
    >
      {/* Interactive Radial Spotlight Hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[1.75rem] sm:rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--theme-rgb), 0.14),
              transparent 80%
            )
          `,
        }}
      />

      {/* Subtle Background Animation */}
      <AnimatedBackground type={service.bgType} />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-full space-y-3 xl:space-y-4">
        
        {/* Top Header Section */}
        <div>
          <div className="flex items-center justify-between mb-3 xl:mb-4">
            <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-black/60 border border-white/10 group-hover:border-cyan-500/40 group-hover:bg-cyan-950/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-inner">
              {service.icon}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/25 text-cyan-400">
                {service.category}
              </span>
              <span className="text-cyan-500/50 group-hover:text-cyan-400 font-mono text-sm font-bold transition-colors">
                #{service.id}
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg xl:text-xl font-display font-bold text-white uppercase tracking-tight mb-1.5 xl:mb-2 group-hover:text-cyan-300 transition-colors">
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {service.desc}
          </p>
        </div>

        {/* Middle Deliverables Checklist */}
        <div className="pt-2.5 xl:pt-3 border-t border-white/10 space-y-1.5 xl:space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1.5">
            <Sparkles size={11} className="text-cyan-400" /> CORE DELIVERABLES
          </div>
          {service.features.map((feature, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2 text-xs text-neutral-300">
              <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
              <span className="leading-tight">{feature}</span>
            </div>
          ))}
        </div>

        {/* Bottom Enriched Area */}
        <div className="pt-2.5 xl:pt-3 border-t border-white/10 space-y-2.5 xl:space-y-3 mt-auto">
          
          {/* Tech Stack Pills */}
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
              FRAMEWORKS & APIS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {service.tech.map((t, tIdx) => (
                <span 
                  key={tIdx} 
                  className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-cyan-300/80 group-hover:border-cyan-500/30 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Workflow Capacity Metric Bar */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 xl:p-3 group-hover:border-cyan-500/20 transition-colors">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                {service.stats.label}
              </span>
              <span className="text-sm xl:text-base font-bold font-mono text-cyan-300">
                {service.stats.value}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${service.stats.capacity}%` }}
              />
            </div>
          </div>

          {/* Bottom Status Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                {service.status}
              </span>
            </div>
            <a 
              href="#contact"
              className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 font-bold"
            >
              <span>EXPLORE</span>
              <ArrowRight size={12} />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// Card Back: Cybernetic Tucked Deck Face
// ==========================================
function CardBack({ service, index }: { service: typeof services[0]; index: number }) {
  return (
    <div className="relative w-full h-full min-h-[450px] xl:min-h-[480px] rounded-[1.75rem] sm:rounded-[2rem] p-6 xl:p-7 flex flex-col justify-between bg-[#070b10] border border-cyan-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.12)] backdrop-blur-2xl overflow-hidden select-none">
      {/* Geometric Circuit Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(6,182,212,0.18)_0%,_transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Crosshair Markers (+) */}
      <span className="absolute top-4 left-4 text-cyan-500/40 font-mono text-xs">+</span>
      <span className="absolute top-4 right-4 text-cyan-500/40 font-mono text-xs">+</span>
      <span className="absolute bottom-4 left-4 text-cyan-500/40 font-mono text-xs">+</span>
      <span className="absolute bottom-4 right-4 text-cyan-500/40 font-mono text-xs">+</span>

      {/* Top Header of Card Back */}
      <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 font-bold uppercase">
            DECK // {service.id}
          </span>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
          LUSION ENGINE
        </span>
      </div>

      {/* Center Holographic Cyber Emblem */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
        <div className="relative w-20 h-20 xl:w-24 xl:h-24 rounded-full border border-cyan-500/40 flex items-center justify-center bg-cyan-950/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-4">
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/50 animate-[spin_12s_linear_infinite]" />
          <div className="relative z-10 text-cyan-300 transform scale-125">
            {service.icon}
          </div>
        </div>

        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold mb-1">
          {service.category}
        </span>
        <h4 className="text-base xl:text-lg font-display font-bold uppercase tracking-tight text-white max-w-[220px]">
          {service.title}
        </h4>
      </div>

      {/* Bottom Technical Telemetry */}
      <div className="relative z-10 border-t border-cyan-500/20 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
          <Cpu size={12} className="text-cyan-400" />
          <span>STATUS: ARMED</span>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold">
          CARD {index + 1}/4
        </span>
      </div>
    </div>
  );
}

// ==========================================
// Main Services Component
// ==========================================
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backFaceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontFaceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Refresh ScrollTrigger calculations after initial render, fonts & preloader finish
    const refresh = () => ScrollTrigger.refresh();
    const timer1 = setTimeout(refresh, 250);
    const timer2 = setTimeout(refresh, 800);
    const timer3 = setTimeout(refresh, 2200);
    window.addEventListener("resize", refresh);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  useGSAP(() => {
    // Dynamic horizontal center calculation for each card relative to the container
    const getDeltaX = (card: HTMLElement, container: HTMLElement) => {
      const cRect = container.getBoundingClientRect();
      const kRect = card.getBoundingClientRect();
      const currentX = (gsap.getProperty(card, "x") as number) || 0;
      const naturalCardCenterX = (kRect.left - currentX) + kRect.width / 2;
      const containerCenterX = cRect.left + cRect.width / 2;
      return containerCenterX - naturalCardCenterX;
    };

    const mm = gsap.matchMedia();

    // ========================================================
    // 1. DESKTOP & TABLETS (min-width: 768px)
    // Pinned Deck Stack -> Fan-Out to 4 Columns & Staggered 180° 3D Flip
    // ========================================================
    mm.add("(min-width: 768px)", () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      const backs = backFaceRefs.current.filter(Boolean) as HTMLElement[];
      const fronts = frontFaceRefs.current.filter(Boolean) as HTMLElement[];
      const container = containerRef.current;
      const section = sectionRef.current;
      if (!container || cards.length === 0 || !section) return;

      const tilts = [-7.5, -2.5, 2.5, 7.5];

      // Pinned Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=240%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Staggered Fan-Out and Full 180° 3D Flip (Domino effect)
      cards.forEach((card, i) => {
        const back = backs[i];
        const front = fronts[i];

        // Domino flip timing
        const flipStart = 0.08 * i;
        const flipDuration = 0.84;
        const midPoint = flipStart + flipDuration / 2; // Exact 90° edge-on knife-edge

        // Set initial face visibility states
        if (back) gsap.set(back, { autoAlpha: 1 });
        if (front) gsap.set(front, { autoAlpha: 0 });

        // 1. Fan-out translation, rotationZ un-tilt, and scale
        tl.fromTo(
          card,
          {
            x: () => getDeltaX(card, container),
            rotationZ: tilts[i],
            scale: 0.92,
            transformPerspective: 1400,
            transformOrigin: "center center",
            zIndex: 4 - i,
            force3D: true,
          },
          {
            x: 0,
            rotationZ: 0,
            scale: 1,
            ease: "power2.out",
            duration: 1.0,
          },
          0
        );

        // 2. Full 180° 3D Flip (rotateY: 180 -> 0)
        tl.fromTo(
          card,
          {
            rotateY: 180,
          },
          {
            rotateY: 0,
            ease: "power2.inOut",
            duration: flipDuration,
          },
          flipStart
        );

        // 3. Seamless face swap at exact 90° edge-on midpoint (autoAlpha handles visibility:hidden)
        if (back && front) {
          tl.fromTo(
            back,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.04, ease: "none" },
            midPoint - 0.02
          );
          tl.fromTo(
            front,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.04, ease: "none" },
            midPoint - 0.02
          );
        }
      });
    });

    // ========================================================
    // 2. MOBILE (< 768px): Pinned Deck Stack & 180° 3D Flip!
    // ========================================================
    mm.add("(max-width: 767px)", () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      const backs = backFaceRefs.current.filter(Boolean) as HTMLElement[];
      const fronts = frontFaceRefs.current.filter(Boolean) as HTMLElement[];
      const container = containerRef.current;
      const section = sectionRef.current;
      if (!container || cards.length === 0 || !section) return;

      const tilts = [-4, -1.5, 1.5, 4];

      // Pinned Scroll Timeline on Mobile
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      cards.forEach((card, i) => {
        const back = backs[i];
        const front = fronts[i];

        const flipStart = 0.12 * i;
        const flipDuration = 0.78;
        const midPoint = flipStart + flipDuration / 2;

        if (back) gsap.set(back, { autoAlpha: 1 });
        if (front) gsap.set(front, { autoAlpha: 0 });

        // On mobile: cards start stacked in the center with slight tilt and scale
        tl.fromTo(
          card,
          {
            rotationZ: tilts[i],
            scale: 0.94 - i * 0.02,
            transformPerspective: 1200,
            transformOrigin: "center center",
            zIndex: 4 - i,
            force3D: true,
          },
          {
            rotationZ: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.9,
          },
          0
        );

        // Full 180° 3D Flip
        tl.fromTo(
          card,
          { rotateY: 180 },
          { rotateY: 0, ease: "power2.inOut", duration: flipDuration },
          flipStart
        );

        // Seamless knife-edge face swap
        if (back && front) {
          tl.fromTo(
            back,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.04, ease: "none" },
            midPoint - 0.02
          );
          tl.fromTo(
            front,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.04, ease: "none" },
            midPoint - 0.02
          );
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="relative z-20 bg-black w-full max-w-full flex flex-col justify-center h-screen min-h-[640px] overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div 
        ref={containerRef}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-10 my-auto flex flex-col justify-center h-full max-h-screen py-4 md:py-6"
      >
        
        {/* Section Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col items-center text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full border border-cyan-500/20 text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2 sm:mb-3 bg-cyan-950/20 backdrop-blur-md">
            <Bot size={12} className="text-cyan-400" /> ARCHITECTURAL COMPETENCIES
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
            CORE <span className="text-cyan-500 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">CAPABILITIES</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mt-2 leading-relaxed hidden sm:block">
            Enterprise-grade web systems, autonomous LLM agent networks, and resilient cloud architectures built with precision and zero technical debt.
          </p>

          <div className="flex items-center gap-2 mt-2.5 px-3 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-cyan-400">
            <Layers size={11} className="animate-pulse" />
            <span>SCROLL TO FAN & FLIP DECK</span>
          </div>
        </div>

        {/* Cards Container: Stacked relative deck on mobile, 4-column grid on md+ */}
        <div 
          className="relative w-full max-w-[340px] sm:max-w-sm md:max-w-none mx-auto h-[450px] md:h-auto md:grid md:grid-cols-4 md:gap-4 lg:gap-6 items-stretch"
        >
          {services.map((service, idx) => (
            <div 
              key={service.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="absolute inset-0 md:relative md:inset-auto w-full flex flex-col h-full [transform-style:preserve-3d] will-change-transform"
            >
              {/* ======================================================== */}
              {/* BACK FACE (Visible initially at rotateY: 180deg) */}
              {/* ======================================================== */}
              <div 
                ref={(el) => { backFaceRefs.current[idx] = el; }}
                className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
              >
                <CardBack service={service} index={idx} />
              </div>

              {/* ======================================================== */}
              {/* FRONT FACE (Revealed after 3D flip at rotateY: 0deg) */}
              {/* ======================================================== */}
              <div 
                ref={(el) => { frontFaceRefs.current[idx] = el; }}
                className="w-full h-full [backface-visibility:hidden] [transform:rotateY(0deg)]"
              >
                <ServiceCard service={service} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
