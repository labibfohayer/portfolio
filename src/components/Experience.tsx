"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  Diamond, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw
} from "lucide-react";

interface BulletItem {
  text: string;
  highlight: string | null;
  postText?: string;
}

interface Milestone {
  id: string;
  phase: string;
  role: string;
  company: string;
  date: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  bulletItems: BulletItem[];
  tech: string[];
  metric: { value: string; label: string };
}

const experiences: Milestone[] = [
  {
    id: "01",
    phase: "PHASE 01",
    role: "FOUNDER & CEO",
    company: "WEBPULSE AUTOMATION",
    date: "2024 - Present",
    title: "ARCHITECTED PROPRIETARY MULTI-AGENT SYNTHESIS ENGINE",
    description: "Built the core infrastructure for an automation agency that replaces manual workflows with autonomous AI systems.",
    problem: "Businesses faced heavy operational friction from manual customer handling, repetitive inquiry queues, and slow delivery velocities.",
    solution: "Engineered an event-driven multi-agent synthesis engine with autonomous LLM bots, webhook triggers, and high-performance Next.js architectures.",
    impact: "Reduced client query response times by 90%, automated complex B2B inquiry pipelines, and scaled operations across multiple enterprise clients.",
    bulletItems: [
      { text: "Led full-stack development of enterprise web applications", highlight: null },
      { text: "Engineered automated chatbots ", highlight: "reducing response times by 90%", postText: "" },
      { text: "Scaled business operations to serve ", highlight: "multiple B2B enterprise clients", postText: "" }
    ],
    tech: ["Next.js", "Python", "FastAPI", "OpenAI / Claude", "Vercel"],
    metric: { value: "90%", label: "Faster Response Time" }
  },
  {
    id: "02",
    phase: "PHASE 02",
    role: "AI AUTOMATION ENGINEER",
    company: "FREELANCE / CONSULTING",
    date: "2023 - Present",
    title: "DEPLOYED AUTONOMOUS WORKFLOWS FOR 10+ BUSINESSES",
    description: "Consulted and developed specialized automation scripts to compress execution timelines for startups and SMEs.",
    problem: "Startups and small businesses were bogged down by manual data entry, fragmented third-party tools, and slow release cycles.",
    solution: "Integrated state-of-the-art OpenAI and Gemini APIs into bespoke web systems, creating self-healing web scrapers and automated serverless pipelines.",
    impact: "Successfully automated operations for 10+ businesses, eliminating 100+ weekly manual work hours with 99.9% pipeline reliability.",
    bulletItems: [
      { text: "Integrated ", highlight: "OpenAI/Gemini APIs", postText: " into custom SaaS platforms" },
      { text: "Automated end-to-end data pipelines for ", highlight: "10+ BUSINESSES", postText: "" },
      { text: "Optimized resilient cloud deployments on ", highlight: "Vercel and AWS Lambda", postText: "" }
    ],
    tech: ["OpenAI API", "Gemini", "Node.js", "AWS Lambda", "Puppeteer"],
    metric: { value: "10+", label: "Businesses Automated" }
  },
  {
    id: "03",
    phase: "PHASE 03",
    role: "LEAD DEVELOPER",
    company: "BD MESS (PRODUCT)",
    date: "2023 - 2024",
    title: "ENGINEERED A SMART MANAGEMENT PLATFORM FOR 500+ USERS",
    description: "Architected a comprehensive SaaS solution for student accommodations to manage meals, rent, and utility bills.",
    problem: "Shared accommodations suffered from contentious manual ledger sheets, recurring meal calculation disputes, and delayed utility collections.",
    solution: "Designed and built an automated multi-variable ledger algorithm with real-time Firebase state sync and an intuitive mobile-first React UI.",
    impact: "Scaled to 500+ active residents with zero calculation disputes, sub-second ledger updates, and automated digital receipts.",
    bulletItems: [
      { text: "Developed complex bill splitting algorithms with ", highlight: "zero drift", postText: "" },
      { text: "Implemented real-time state sync for ", highlight: "500+ ACTIVE RESIDENTS", postText: "" },
      { text: "Designed a high-conversion ", highlight: "mobile-first React interface", postText: "" }
    ],
    tech: ["React.js", "Firebase Realtime DB", "Tailwind CSS", "Algorithms"],
    metric: { value: "500+", label: "Active Residents" }
  },
  {
    id: "04",
    phase: "PHASE 04",
    role: "E-COMMERCE ARCHITECT",
    company: "PONYOPURI",
    date: "2022 - 2023",
    title: "BUILT AND SCALED A HIGH-CONVERSION E-COMMERCE STORE",
    description: "Developed a modern, responsive digital storefront focused on user experience and direct WhatsApp integrations.",
    problem: "Standard multi-step checkout funnels in the local market resulted in high cart abandonment due to payment friction and login walls.",
    solution: "Architected a high-speed digital storefront with a zero-friction 'Order via WhatsApp' checkout flow, instant catalog search, and optimized SEO.",
    impact: "Boosted direct sales conversion rates by 40%, achieved sub-second page transitions, and streamlined product inventory management.",
    bulletItems: [
      { text: "Engineered 1-tap WhatsApp checkout ", highlight: "boosting conversion by 40%", postText: "" },
      { text: "Optimized frontend for ", highlight: "sub-second render speeds", postText: " & SEO" },
      { text: "Streamlined inventory management with ", highlight: "zero transaction drift", postText: "" }
    ],
    tech: ["React", "Node.js", "WhatsApp Business API", "SEO Engine"],
    metric: { value: "+40%", label: "Conversion Rate" }
  }
];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLElement>(null);

  // Mouse spotlight coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const selectIndex = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const prevMilestone = () => {
    const next = activeIndex > 0 ? activeIndex - 1 : experiences.length - 1;
    setDirection(-1);
    setActiveIndex(next);
  };

  const nextMilestone = () => {
    const next = activeIndex < experiences.length - 1 ? activeIndex + 1 : 0;
    setDirection(1);
    setActiveIndex(next);
  };

  // Keyboard navigation when user is focused inside or over the component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if active element is an input or textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft") {
        prevMilestone();
      } else if (e.key === "ArrowRight") {
        nextMilestone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const activeExp = experiences[activeIndex];

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="scroll-mt-28 md:scroll-mt-32 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 relative z-10 bg-black overflow-hidden w-full max-w-full"
    >
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-blue-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header with Quick Stage Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-12 gap-6 sm:gap-8 pb-6 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-auto max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase mb-3 sm:mb-4 bg-cyan-950/20 backdrop-blur-md">
              <Diamond size={12} className="text-cyan-400 animate-pulse" /> CONNECTED ARCHITECTURE TIMELINE
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white mb-3">
              WHAT I'VE BUILT <br />
              <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">& SOLVED.</span>
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-lg">
              A chronological timeline connecting foundational business challenges with bespoke architectural solutions and quantifiable production outcomes.
            </p>
          </motion.div>

          {/* Interactive Stage Indicator & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase">STAGE:</span>
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1">
                {experiences.map((exp, idx) => (
                  <button
                    key={exp.id}
                    onClick={() => selectIndex(idx)}
                    aria-label={`Jump to ${exp.phase}`}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activeIndex 
                        ? "w-6 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                        : "w-2 h-2 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 ml-1">
                0{activeIndex + 1} / 0{experiences.length}
              </span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevMilestone}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-200 active:scale-95"
                aria-label="Previous milestone"
                title="Previous milestone (←)"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMilestone}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-200 active:scale-95"
                aria-label="Next milestone"
                title="Next milestone (→)"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Tab Strip (< 1024px) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x">
          {experiences.map((exp, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={exp.id}
                onClick={() => selectIndex(idx)}
                className={`snap-start shrink-0 px-3.5 py-2 rounded-xl text-left transition-all duration-300 flex items-center gap-2.5 border ${
                  isActive
                    ? "bg-cyan-950/40 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" : "bg-neutral-600"}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase whitespace-nowrap">
                  {exp.phase}
                </span>
                <span className="text-[11px] font-semibold text-neutral-300 whitespace-nowrap">
                  {exp.company}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Split Timeline Layout (>= 1024px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Left Column: Interactive Chronological Timeline Rail (lg:col-span-4) */}
          <div className="hidden lg:block lg:col-span-4 relative pl-7 space-y-3">
            
            {/* Continuous Vertical Connector Rail */}
            <div className="absolute left-[9px] top-6 bottom-6 w-[2px] bg-white/10 rounded-full overflow-hidden">
              {/* Dynamic Glowing Beam Tracking Active Progress */}
              <motion.div 
                className="w-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                initial={false}
                animate={{
                  height: `${(activeIndex / (experiences.length - 1)) * 100}%`
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            {/* Milestone Phase Selector Cards */}
            {experiences.map((exp, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div key={exp.id} className="relative">
                  {/* Timeline Node Indicator on the Rail */}
                  <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                    <div 
                      className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? "w-5 h-5 bg-black border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] scale-110"
                          : "w-3 h-3 bg-black border border-white/30 hover:border-cyan-400/60"
                      }`}
                    >
                      {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Interactive Tab Button */}
                  <button
                    onClick={() => selectIndex(idx)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 relative group overflow-hidden border ${
                      isActive
                        ? "bg-[#0a1219]/90 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.12)]"
                        : "bg-white/[0.02] border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Active Background Accent Glow */}
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-glow"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent pointer-events-none"
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                            isActive ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-white/5 text-neutral-400"
                          }`}>
                            {exp.phase}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {exp.date}
                          </span>
                        </div>

                        {/* Metric Micro-Badge */}
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                            : "bg-white/5 text-neutral-400"
                        }`}>
                          {exp.metric.value}
                        </span>
                      </div>

                      <h4 className={`text-sm font-display font-bold uppercase tracking-tight transition-colors ${
                        isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                      }`}>
                        {exp.company}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                        <span>{exp.role}</span>
                        <ChevronRight 
                          size={13} 
                          className={`transition-all duration-200 ${
                            isActive ? "text-cyan-400 translate-x-0.5" : "text-neutral-600 group-hover:text-neutral-300"
                          }`} 
                        />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Keyboard Hint */}
            <div className="pt-2 px-2 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>NAVIGATE VIA KEYBOARD</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 text-[9px]">
                ← / → KEYS
              </kbd>
            </div>
          </div>

          {/* Right Column: Active Executive Milestone Dossier (lg:col-span-8) */}
          <div className="w-full lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onMouseMove={handleMouseMove}
                className="glass-card rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-9 relative overflow-hidden group border border-white/10 hover:border-cyan-500/40 transition-all duration-500 bg-[#070b0e]/95 hover:bg-[#080e13] backdrop-blur-2xl w-full shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              >
                {/* Magnetic Spotlight Hover Effect */}
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-[1.75rem] sm:rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100"
                  style={{
                    background: useMotionTemplate`
                      radial-gradient(
                        650px circle at ${mouseX}px ${mouseY}px,
                        rgba(var(--theme-rgb), 0.12),
                        transparent 80%
                      )
                    `,
                  }}
                />

                {/* Card Content Area */}
                <div className="relative z-10 flex flex-col flex-grow">
                  
                  {/* 1. Header Information Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Company Badge */}
                      <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,rgb(var(--theme-rgb))_50%,#000000_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-cyan-950/80 px-3.5 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 backdrop-blur-3xl border border-cyan-500/30 group-hover:border-transparent transition-all duration-300">
                          {activeExp.company}
                        </span>
                      </div>

                      {/* Role Tag */}
                      <span className="text-[10px] font-mono text-neutral-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        {activeExp.role}
                      </span>

                      {/* Phase Marker */}
                      <span className="text-[9px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                        {activeExp.phase}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Metric Highlight Pill */}
                      <div className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.18)]">
                        {activeExp.metric.value} <span className="text-[9px] text-neutral-400 font-normal">{activeExp.metric.label}</span>
                      </div>

                      {/* Date Tag */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <Calendar size={11} className="text-cyan-400" />
                        {activeExp.date}
                      </span>
                    </div>
                  </div>

                  {/* 2. Main Milestone Title & Executive Overview */}
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight mb-2.5 leading-snug group-hover:text-cyan-300 transition-colors duration-300">
                      {activeExp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
                      {activeExp.description}
                    </p>
                  </div>

                  {/* 3. Streamlined Problem ➔ Architecture ➔ Result Process Flow */}
                  <div className="mb-6 pt-5 border-t border-white/10">
                    <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2 mb-3">
                      <Sparkles size={12} className="text-cyan-400" /> SYSTEM EXECUTION PIPELINE
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Step 1: Challenge / Problem */}
                      <div className="bg-rose-950/15 border border-rose-500/20 rounded-xl p-3.5 flex flex-col justify-between hover:border-rose-500/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                              <AlertCircle size={10} className="text-rose-400" /> THE CHALLENGE
                            </span>
                            <span className="text-[9px] font-mono text-rose-400/60">STAGE 01</span>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed mt-1.5">
                            {activeExp.problem}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Architecture & Solution */}
                      <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-400 transition-colors shadow-[0_0_20px_rgba(var(--theme-rgb),0.06)]">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                              <Cpu size={10} className="text-cyan-400" /> ARCHITECTURE & SOLUTION
                            </span>
                            <span className="text-[9px] font-mono text-cyan-400/60">STAGE 02</span>
                          </div>
                          <p className="text-xs text-neutral-200 leading-relaxed mt-1.5">
                            {activeExp.solution}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Measurable Impact & Results */}
                      <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                              <TrendingUp size={10} className="text-emerald-400" /> MEASURABLE IMPACT
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400/60">STAGE 03</span>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed mt-1.5">
                            {activeExp.impact}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-emerald-500/15 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">OUTCOME</span>
                          <span className="text-[10px] font-mono text-emerald-300 font-bold">{activeExp.metric.value}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 4. Structured Impact Badges & Contributions */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck size={12} className="text-cyan-400" /> KEY MILESTONE CONTRIBUTIONS & IMPACT
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {activeExp.bulletItems.map((bullet, i) => (
                        <div 
                          key={i} 
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors"
                        >
                          <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                          <span className="text-xs text-neutral-300 leading-relaxed">
                            {bullet.text}
                            {bullet.highlight && (
                              <span className="text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 inline-block mx-0.5 shadow-sm">
                                {bullet.highlight}
                              </span>
                            )}
                            {bullet.postText}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 5. Executive Footer Bar with Quick Switch CTA */}
                <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">ROLE:</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">{activeExp.role}</span>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeExp.tech.map((t, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Action: Next Milestone or Restart */}
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
                      <ShieldCheck size={13} className="text-cyan-400" />
                      <span className="text-[9px] font-mono font-bold tracking-widest uppercase">VERIFIED MILESTONE</span>
                    </div>

                    <button
                      onClick={nextMilestone}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 group/btn"
                    >
                      {activeIndex < experiences.length - 1 ? (
                        <>
                          <span>NEXT PHASE</span>
                          <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>RESTART TIMELINE</span>
                          <RotateCcw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
