"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  Diamond, 
  ShieldCheck, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  TrendingUp, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

const experiences = [
  {
    id: "01",
    role: "FOUNDER & CEO",
    company: "WEBPULSE AUTOMATION",
    date: "2024 - Present",
    title: "ARCHITECTED PROPRIETARY MULTI-AGENT SYNTHESIS ENGINE",
    description: "Built the core infrastructure for an automation agency that replaces manual workflows with autonomous AI systems.",
    problem: "Businesses faced heavy operational friction from manual customer handling, repetitive inquiry queues, and slow delivery velocities.",
    solution: "Engineered an event-driven multi-agent synthesis engine with autonomous LLM bots, webhook triggers, and high-performance Next.js architectures.",
    impact: "Reduced client query response times by 90%, automated complex B2B inquiry pipelines, and scaled operations across multiple enterprise clients.",
    bullets: [
      "Led full-stack development of enterprise web applications",
      "Engineered automated chatbots reducing response times by 90%",
      "Scaled business operations to serve multiple B2B clients"
    ],
    tech: ["Next.js", "Python", "FastAPI", "OpenAI / Claude", "Vercel"],
    metric: { value: "90%", label: "Faster Response Time" }
  },
  {
    id: "02",
    role: "AI AUTOMATION ENGINEER",
    company: "FREELANCE / CONSULTING",
    date: "2023 - Present",
    title: "DEPLOYED AUTONOMOUS WORKFLOWS FOR 10+ BUSINESSES",
    description: "Consulted and developed specialized automation scripts to compress execution timelines for startups and SMEs.",
    problem: "Startups and small businesses were bogged down by manual data entry, fragmented third-party tools, and slow release cycles.",
    solution: "Integrated state-of-the-art OpenAI and Gemini APIs into bespoke web systems, creating self-healing web scrapers and automated serverless pipelines.",
    impact: "Successfully automated operations for 10+ businesses, eliminating 100+ weekly manual work hours with 99.9% pipeline reliability.",
    bullets: [
      "Integrated OpenAI/Gemini APIs into custom SaaS platforms",
      "Built automated data scraping and processing pipelines",
      "Optimized cloud deployments on Vercel and AWS"
    ],
    tech: ["OpenAI API", "Gemini", "Node.js", "AWS Lambda", "Puppeteer"],
    metric: { value: "10+", label: "Businesses Automated" }
  },
  {
    id: "03",
    role: "LEAD DEVELOPER",
    company: "BD MESS (PRODUCT)",
    date: "2023 - 2024",
    title: "ENGINEERED A SMART MANAGEMENT PLATFORM FOR 500+ USERS",
    description: "Architected a comprehensive SaaS solution for student accommodations to manage meals, rent, and utility bills.",
    problem: "Shared accommodations suffered from contentious manual ledger sheets, recurring meal calculation disputes, and delayed utility collections.",
    solution: "Designed and built an automated multi-variable ledger algorithm with real-time Firebase state sync and an intuitive mobile-first React UI.",
    impact: "Scaled to 500+ active residents with zero calculation disputes, sub-second ledger updates, and automated digital receipts.",
    bullets: [
      "Developed complex bill splitting algorithms",
      "Implemented real-time notification systems",
      "Designed a seamless mobile-first user interface"
    ],
    tech: ["React.js", "Firebase Realtime DB", "Tailwind CSS", "Algorithms"],
    metric: { value: "500+", label: "Active Residents" }
  },
  {
    id: "04",
    role: "E-COMMERCE ARCHITECT",
    company: "PONYOPURI",
    date: "2022 - 2023",
    title: "BUILT AND SCALED A HIGH-CONVERSION E-COMMERCE STORE",
    description: "Developed a modern, responsive digital storefront focused on user experience and direct WhatsApp integrations.",
    problem: "Standard multi-step checkout funnels in the local market resulted in high cart abandonment due to payment friction and login walls.",
    solution: "Architected a high-speed digital storefront with a zero-friction 'Order via WhatsApp' checkout flow, instant catalog search, and optimized SEO.",
    impact: "Boosted direct sales conversion rates by 40%, achieved sub-second page transitions, and streamlined product inventory management.",
    bullets: [
      "Implemented 'Order via WhatsApp' to boost local sales",
      "Optimized frontend performance and SEO",
      "Managed digital marketing and product inventory"
    ],
    tech: ["React", "Node.js", "WhatsApp Business API", "SEO Engine"],
    metric: { value: "+40%", label: "Conversion Rate" }
  }
];

function TimelineCard({ exp, idx }: { exp: typeof experiences[0]; idx: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className="relative group w-full">
      {/* Timeline Node on Left Rail (Tablet & Desktop) */}
      <div className="hidden md:flex absolute -left-[45px] top-8 z-20 items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-black border-2 border-cyan-500/40 group-hover:border-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--theme-rgb),0.8)] transition-all duration-300 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:animate-ping" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        onMouseMove={handleMouseMove}
        className="glass-card rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-10 relative overflow-hidden group border border-white/10 hover:border-cyan-500/40 transition-all duration-500 bg-[#070b0e]/90 hover:bg-[#080e13] backdrop-blur-xl w-full"
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

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col flex-grow">
          
          {/* 1. Header Information Bar */}
          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              {/* Company Badge */}
              <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,rgb(var(--theme-rgb))_50%,#000000_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-cyan-950/80 px-3.5 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 backdrop-blur-3xl border border-cyan-500/30 group-hover:border-transparent transition-all duration-300">
                  {exp.company}
                </span>
              </div>

              {/* Role Tag */}
              <span className="text-[10px] font-mono text-neutral-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                {exp.role}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Metric Highlight Pill */}
              <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                {exp.metric.value} <span className="text-[9px] text-neutral-400 font-normal">{exp.metric.label}</span>
              </div>

              {/* Date Tag */}
              <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
                <Calendar size={11} className="text-cyan-400" />
                {exp.date}
              </span>
            </div>
          </div>

          {/* 2. Main Milestone Title & Description */}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight mb-3 leading-tight group-hover:text-cyan-300 transition-colors duration-300">
              {exp.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-3xl">
              {exp.description}
            </p>
          </div>

          {/* 3. Interactive Problem ➔ Architecture ➔ Result Process Flow */}
          <div className="mb-8 pt-6 border-t border-white/10">
            <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2 mb-4">
              <Sparkles size={12} className="text-cyan-400" /> SYSTEM EXECUTION PIPELINE
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
              
              {/* Step 1: Challenge / Problem */}
              <div className="bg-rose-950/15 border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between group/step hover:border-rose-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                      <AlertCircle size={10} className="text-rose-400" /> THE CHALLENGE
                    </span>
                    <span className="text-[9px] font-mono text-rose-400/60">STAGE 01</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                    {exp.problem}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-rose-500/10 flex justify-end lg:hidden">
                  <ArrowDown size={14} className="text-rose-400/60 animate-bounce" />
                </div>
              </div>

              {/* Step 2: Architecture & Solution */}
              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between group/step hover:border-cyan-400 transition-colors shadow-[0_0_20px_rgba(var(--theme-rgb),0.06)]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                      <Cpu size={10} className="text-cyan-400" /> ARCHITECTURE & SOLUTION
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400/60">STAGE 02</span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed mt-2 font-normal">
                    {exp.solution}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyan-500/10 flex justify-end lg:hidden">
                  <ArrowDown size={14} className="text-cyan-400/60 animate-bounce" />
                </div>
              </div>

              {/* Step 3: Measurable Impact & Results */}
              <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between group/step hover:border-emerald-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                      <TrendingUp size={10} className="text-emerald-400" /> MEASURABLE IMPACT
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400/60">STAGE 03</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                    {exp.impact}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-500/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">OUTCOME</span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">{exp.metric.value}</span>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Bullets */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-2">
              <ShieldCheck size={12} className="text-cyan-400" /> KEY MILESTONE CONTRIBUTIONS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {exp.bullets.map((bullet, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-neutral-300 leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 5. Clean Non-Absolute Footer Bar (Eliminates overlap with bullets completely) */}
        <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">ROLE:</span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider text-cyan-300">{exp.role}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {exp.tech.map((t, tIdx) => (
              <span 
                key={tIdx} 
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-neutral-500 group-hover:text-cyan-400 transition-all duration-300">
            <ShieldCheck size={14} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">VERIFIED MILESTONE</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 relative z-10 bg-black overflow-hidden w-full max-w-full">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[400px] bg-cyan-500/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-blue-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-20 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 bg-cyan-950/20 backdrop-blur-md">
              <Diamond size={12} className="text-cyan-400 animate-pulse" /> CONNECTED ARCHITECTURE TIMELINE
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
              WHAT I'VE BUILT <br />
              <span className="text-cyan-500 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">& SOLVED.</span>
            </h2>
          </motion.div>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed">
            A chronological timeline connecting foundational business challenges with bespoke architectural solutions and quantifiable production outcomes.
          </p>
        </div>

        {/* Connected Vertical Timeline Container */}
        <div className="relative w-full">
          {/* Vertical Connecting Rail Line (Hidden on Mobile, Visible on md+) */}
          <div className="hidden md:block absolute left-[26px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-500 via-cyan-500/30 to-transparent pointer-events-none" />

          {/* Timeline Cards Stack */}
          <div className="space-y-8 md:space-y-12 md:pl-16 w-full">
            {experiences.map((exp, idx) => (
              <TimelineCard key={exp.id || idx} exp={exp} idx={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
