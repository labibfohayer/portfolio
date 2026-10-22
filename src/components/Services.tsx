"use client";

import { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  useMotionTemplate, 
  MotionValue 
} from "framer-motion";
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
      className="group relative rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between h-full min-h-[490px] bg-[#070b0e]/95 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(var(--theme-rgb),0.2)] backdrop-blur-2xl overflow-hidden pointer-events-auto"
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
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        
        {/* Top Header Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 group-hover:border-cyan-500/40 group-hover:bg-cyan-950/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-inner">
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

          <h3 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {service.desc}
          </p>
        </div>

        {/* Middle Deliverables Checklist */}
        <div className="pt-3 border-t border-white/10 space-y-2">
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
        <div className="pt-3 border-t border-white/10 space-y-3 mt-auto">
          
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
          <div className="bg-black/50 border border-white/10 rounded-xl p-3 group-hover:border-cyan-500/20 transition-colors">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                {service.stats.label}
              </span>
              <span className="text-base font-bold font-mono text-cyan-300">
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
// Card Back: Cybernetic Tucked Deck Aesthetic
// ==========================================
function CardBack({ service, index }: { service: typeof services[0]; index: number }) {
  return (
    <div className="relative w-full h-full min-h-[490px] rounded-[1.75rem] sm:rounded-[2rem] p-7 flex flex-col justify-between bg-[#070b10] border border-cyan-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(6,182,212,0.08)] backdrop-blur-3xl overflow-hidden select-none">
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
        {/* Hologram Circle */}
        <div className="relative w-24 h-24 rounded-full border border-cyan-500/40 flex items-center justify-center bg-cyan-950/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-4">
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/50 animate-[spin_12s_linear_infinite]" />
          <div className="relative z-10 text-cyan-300">
            {service.icon}
          </div>
        </div>

        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold mb-1">
          {service.category}
        </span>
        <h4 className="text-base font-display font-bold uppercase tracking-tight text-white max-w-[200px]">
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
// Desktop Deck Card with Framer Motion Fan-Out & 3D Flip
// ==========================================
function DesktopDeckCard({
  service,
  index,
  total,
  scrollYProgress,
  containerWidth,
}: {
  service: typeof services[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  containerWidth: number;
}) {
  const gap = 24;
  const colWidth = (containerWidth - (total - 1) * gap) / total;

  // Exact mathematically centered offsets (Stage 1: All cards stacked at exact center)
  const centerOffsets = [
    1.5 * (colWidth + gap),   // Card 0 translates right to center
    0.5 * (colWidth + gap),   // Card 1 translates right to center
    -0.5 * (colWidth + gap),  // Card 2 translates left to center
    -1.5 * (colWidth + gap),  // Card 3 translates left to center
  ];
  const initialOffset = centerOffsets[index] || 0;

  // Slight overlapping fan angles in deck stack
  const tilts = [-7.5, -2.5, 2.5, 7.5];
  const initialTilt = tilts[index] || 0;

  // Staggered 3D flip timings
  const flipStart = 0.22 + index * 0.04;
  const flipEnd = 0.72 + index * 0.035;

  // Framer Motion transforms
  // 1. Horizontal Fan-out translation
  const x = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [initialOffset, initialOffset, 0, 0]);

  // 2. Un-tilt Z-rotation
  const rotateZ = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [initialTilt, initialTilt, 0, 0]);

  // 3. 3D Flip (rotateY: 180deg [Back Facing] -> 0deg [Front Facing])
  const rotateY = useTransform(scrollYProgress, [0, flipStart, flipEnd, 1], [180, 180, 0, 0]);

  // 4. Subtle Scale Expansion
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [0.92, 0.92, 1, 1]);

  // 5. Dynamic Z-Index (when stacked, card 0 is on top; when fanned, equal)
  const zIndex = useTransform(scrollYProgress, (val) => (val > 0.65 ? 10 : 4 - index));

  return (
    <motion.div
      style={{
        x,
        rotateZ,
        rotateY,
        scale,
        zIndex,
      }}
      className="w-full h-full relative [transform-style:preserve-3d] will-change-transform"
    >
      {/* ======================================================== */}
      {/* BACK FACE (Visible initially at rotateY = 180deg) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <CardBack service={service} index={index} />
      </div>

      {/* ======================================================== */}
      {/* FRONT FACE (Revealed after 3D flip at rotateY = 0deg) */}
      {/* ======================================================== */}
      <div className="w-full h-full [backface-visibility:hidden] [transform:rotateY(0deg)]">
        <ServiceCard service={service} />
      </div>
    </motion.div>
  );
}

// ==========================================
// Main Services Component
// ==========================================
export default function Services() {
  const targetRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1300);
  const [isDesktop, setIsDesktop] = useState(true);

  // Monitor viewport width for clean mobile fallback
  useEffect(() => {
    const updateDimensions = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 1300);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Framer Motion Scroll Progress across the 300vh sticky container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Micro-hint that fades out once user starts expanding deck
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0]);

  return (
    <section 
      ref={targetRef} 
      id="services" 
      className="scroll-mt-28 md:scroll-mt-32 relative z-20 bg-black overflow-hidden w-full max-w-full lg:h-[300vh]"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />

      {/* Sticky Fullscreen Viewport for Desktop / Fluid Flow for Mobile */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center py-16 sm:py-20 lg:py-0 w-full overflow-hidden">
        <div 
          ref={containerRef}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10 my-auto flex flex-col justify-center"
        >
          
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3 sm:mb-4 bg-cyan-950/20 backdrop-blur-md">
              <Bot size={12} className="text-cyan-400" /> ARCHITECTURAL COMPETENCIES
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
              CORE <span className="text-cyan-500 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">CAPABILITIES</span>
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mt-3.5 leading-relaxed">
              Enterprise-grade web systems, autonomous LLM agent networks, and resilient cloud architectures built with precision and zero technical debt.
            </p>

            {/* Desktop Fan-Out & Flip Scroll Prompt */}
            {isDesktop && (
              <motion.div 
                style={{ opacity: hintOpacity }}
                className="hidden lg:flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono tracking-widest uppercase text-cyan-400"
              >
                <Layers size={11} className="animate-pulse" />
                <span>SCROLL TO EXPAND & FLIP DECK</span>
              </motion.div>
            )}
          </div>

          {/* ======================================================== */}
          {/* Desktop: Lusion-Style Card Deck Fan-Out & 3D Flip */}
          {/* ======================================================== */}
          {isDesktop ? (
            <div className="relative grid grid-cols-4 gap-6 w-full items-stretch [perspective:1500px]">
              {services.map((service, idx) => (
                <div key={service.id} className="w-full h-full flex flex-col">
                  <DesktopDeckCard
                    service={service}
                    index={idx}
                    total={services.length}
                    scrollYProgress={scrollYProgress}
                    containerWidth={containerWidth}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* ======================================================== */
            /* Mobile & Tablet (<1024px): Clean Responsive Stack */
            /* ======================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
                  className="w-full flex flex-col h-full"
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
