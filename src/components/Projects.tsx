"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Code2, 
  CheckCircle2, 
  Terminal, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  Workflow,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";
import MagneticButton from "./ui/MagneticButton";

const defaultProjects = [
  {
    id: "01",
    title: "WEBPULSE AUTOMATION",
    role: "AGENCY PLATFORM & AUTOMATION",
    desc: "A scalable tech agency platform offering custom web development and smart workflow automations to help businesses scale effortlessly.",
    tech: ["NEXT.JS", "REACT", "TAILWIND CSS", "AUTOMATION"],
    image: "/projects/webpulse.png",
    isMobile: false,
    metricBadges: ["⚡ <100ms Latency", "🤖 Automated Pipeline", "99.9% Uptime"],
    contributions: [
      "Architected the entire agency landing page and service workflows.",
      "Integrated automated pipelines for lead generation and business scaling.",
      "Engineered ultra-fast UI with modern glassmorphism and animations."
    ],
    liveUrl: "https://webpulseautomation.com",
    githubUrl: "https://github.com/labibfohayer/webpulse-agency"
  },
  {
    id: "02",
    title: "AL MADINA MADRASA",
    role: "INSTITUTIONAL WEBSITE & MANAGEMENT",
    desc: "Complete digital presence and automation foundation for Al Madina Model Madrasa & Research Institute.",
    tech: ["REACT", "TAILWIND", "NODE.JS", "DATABASE"],
    image: "/projects/al-madina.png",
    isMobile: false,
    metricBadges: ["⚡ 99/100 Lighthouse", "🏛️ 100% Online Admissions"],
    contributions: [
      "Built a highly responsive and fast public-facing institutional website.",
      "Set up the foundational architecture for student and staff data routing.",
      "Modernized the digital branding and online admission processes."
    ],
    liveUrl: "https://almadinamodelmadrasa.com",
    githubUrl: "https://github.com/labibfohayer"
  },
  {
    id: "03",
    title: "MADRASA OS",
    role: "INSTITUTIONAL OPERATING SYSTEM",
    desc: "A comprehensive management dashboard for madrasas covering student tracking, attendance, fees, staff payroll, and daily operations.",
    tech: ["FULL-STACK", "DASHBOARD UI", "API ARCHITECTURE", "SECURITY"],
    image: "/projects/madrasa-os.png",
    isMobile: false,
    metricBadges: ["🛡️ Zero-Trust RBAC", "👥 1,000+ Active Base"],
    contributions: [
      "Engineered a centralized dashboard for managing 1000+ students and staff.",
      "Automated complex fee collection, daily accounting, and attendance tracking.",
      "Built role-based access control (RBAC) for admins, teachers, and parents."
    ],
    liveUrl: "https://madrasa-os-demo.vercel.app",
    githubUrl: "https://github.com/labibfohayer"
  },
  {
    id: "04",
    title: "BD MESS",
    role: "SMART LIVING & MEAL MANAGEMENT SYSTEM",
    desc: "A modern, high-craft living platform featuring automated utility splitting, meal calculation, and streamlined resident management flow.",
    tech: ["REACT.JS", "TAILWIND CSS", "FIREBASE", "ALGORITHMS"],
    image: "/projects/bd-mess.jpg",
    isMobile: true,
    metricBadges: ["⚡ <50ms Sync", "📊 Zero-Drift Ledger"],
    contributions: [
      "Architected an interactive dashboard with instant metrics and state persistence.",
      "Engineered responsive visual aesthetics with fluid mobile-first UX.",
      "Optimized build pipeline and automated complex billing calculations."
    ],
    liveUrl: "https://bd-mess.vercel.app",
    githubUrl: "https://github.com/labibfohayer"
  },
  {
    id: "05",
    title: "EXPENSE TRACKER",
    role: "FINANCIAL ANALYTICS & ACCOUNTING",
    desc: "Production financial tracking and analytics platform featuring daily safe limits, digital vaults, and real-time computation.",
    tech: ["NEXT.JS", "TYPESCRIPT", "REST API", "FRAMER MOTION"],
    image: "/projects/expense.jpg",
    isMobile: true,
    metricBadges: ["⚡ <100ms Ingestion", "📈 Real-Time Charts"],
    contributions: [
      "Built resilient microservices architecture for safe expense tracking.",
      "Engineered dynamic real-time expenditure charts with category breakdown.",
      "Ensured 99.9% uptime with zero-friction database communication."
    ],
    liveUrl: "https://expense-tracker-iota-blush.vercel.app",
    githubUrl: "https://github.com/labibfohayer"
  },
  {
    id: "06",
    title: "PONYOPURI E-COMMERCE",
    role: "SCALABLE DIGITAL STOREFRONT",
    desc: "Custom high-performance storefront that handles inventory management and direct WhatsApp ordering workflows.",
    tech: ["E-COMMERCE", "NODE.JS", "PAYMENT GATEWAYS", "REACT"],
    image: "/projects/ponyopuri.png",
    isMobile: true,
    metricBadges: ["⚡ Sub-Second Load", "🛍️ 1-Click WA Checkout"],
    contributions: [
      "Orchestrated seamless checkout flows with instant WhatsApp conversion.",
      "Created highly optimized product grids with sub-second render speeds.",
      "Designed responsive mobile layout ensuring maximum conversion and fast load speeds."
    ],
    liveUrl: "https://ponyopuri.com",
    githubUrl: "https://github.com/labibfohayer"
  }
];

// Rich SaaS metadata for live metrics & pipeline architecture
const projectMeta: Record<string, {
  status: string;
  urlDomain: string;
  pipeline: { label: string; tag: string }[];
}> = {
  "01": {
    status: "Production Ready",
    urlDomain: "system://webpulseautomation.live",
    pipeline: [
      { label: "Lead Ingestion", tag: "TRIGGER" },
      { label: "AI Reasoning", tag: "WORKER" },
      { label: "Pipeline Sync", tag: "DATA" },
      { label: "Instant Output", tag: "EMIT" }
    ]
  },
  "02": {
    status: "Active System",
    urlDomain: "system://almadinamodelmadrasa.live",
    pipeline: [
      { label: "Public Web", tag: "PORTAL" },
      { label: "Routing API", tag: "ROUTER" },
      { label: "Cloud Store", tag: "STORAGE" }
    ]
  },
  "03": {
    status: "Enterprise Live",
    urlDomain: "system://madrasa-os.live",
    pipeline: [
      { label: "Bio Tracker", tag: "TELEMETRY" },
      { label: "RBAC Controller", tag: "AUTH" },
      { label: "Fee Gateway", tag: "LEDGER" },
      { label: "Reports Gen", tag: "EXPORTER" }
    ]
  },
  "04": {
    status: "Deployed System",
    urlDomain: "system://bd-mess.live",
    pipeline: [
      { label: "Meal Records", tag: "INPUT" },
      { label: "Split Algorithm", tag: "COMPUTE" },
      { label: "Live Ledger", tag: "STORE" }
    ]
  },
  "05": {
    status: "Production Ready",
    urlDomain: "system://expense-tracker.live",
    pipeline: [
      { label: "TX Stream", tag: "HOOK" },
      { label: "Budget Vault", tag: "CALC" },
      { label: "Chart Worker", tag: "VIZ" }
    ]
  },
  "06": {
    status: "Active System",
    urlDomain: "system://ponyopuri.live",
    pipeline: [
      { label: "Catalog Grid", tag: "UI" },
      { label: "Cart Dispatch", tag: "ROUTER" },
      { label: "WhatsApp API", tag: "GATEWAY" }
    ]
  }
};

export default function Projects() {
  const [projects, setProjects] = useState<any[]>(defaultProjects);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const updated = data.projects.map((p: any) => {
            const fallback = defaultProjects.find(dp => dp.id === p.id) || defaultProjects[0];
            return {
              ...fallback,
              ...p,
              metricBadges: p.metricBadges || fallback.metricBadges,
              isMobile: p.isMobile !== undefined ? p.isMobile : fallback.isMobile,
              contributions: Array.isArray(p.contributions) && p.contributions.length > 0 
                ? p.contributions 
                : fallback.contributions
            };
          });
          setProjects(updated);
        }
      })
      .catch(() => {
        // Fallback to defaultProjects already set
      });
  }, []);

  return (
    <section id="projects" className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 relative z-10 bg-black overflow-hidden w-full max-w-full">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[300px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8"
        >
          <div className="w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 bg-cyan-950/20 backdrop-blur-md">
              <Code2 size={12} className="text-cyan-400" /> BENTO SYSTEM SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
              ARCHITECTING <br />
              <span className="text-cyan-500 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">DIGITAL ECOSYSTEMS</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed">
            High-performance web architectures, autonomous multi-agent pipelines, and enterprise management tools designed with Apple & Linear-level craftsmanship.
          </p>
        </motion.div>

        {/* Bento Grid Architecture: Asymmetric 3-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
          {projects.map((project, idx) => {
            // Asymmetric Bento Grid Spans: 01, 04, 06 are wide (lg:col-span-2)
            const isWide = idx === 0 || idx === 3 || idx === 5;
            const meta = projectMeta[project.id] || {
              status: "Production Ready",
              urlDomain: `system://${project.title.toLowerCase().replace(/\s+/g, '-')}.live`,
              pipeline: [
                { label: "Client Ingestion", tag: "TRIGGER" },
                { label: "API Controller", tag: "CORE" },
                { label: "Database Sync", tag: "STORE" }
              ]
            };
            const isPortraitMobile = project.isMobile || project.id === "04" || project.id === "05" || project.id === "06";

            return (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className={`w-full flex flex-col ${
                  isWide 
                    ? "md:col-span-2 lg:col-span-2" 
                    : "col-span-1"
                }`}
              >
                <div className="group relative rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden flex flex-col justify-between h-full bg-[#070b0e]/95 border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_12px_45px_rgba(var(--theme-rgb),0.18)] transition-all duration-500 backdrop-blur-xl">
                  
                  {/* Subtle Top Radial Glow on Hover */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 group-hover:bg-cyan-500/15 blur-3xl rounded-full transition-all duration-500 pointer-events-none" />

                  {/* Dedicated Card Top Bar: Status + Index */}
                  <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/10 bg-white/[0.02] select-none z-20">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[9px] font-mono font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        {meta.status}
                      </span>
                      <span className="text-cyan-400/90 font-mono text-[10px] font-semibold tracking-wider uppercase hidden sm:inline">
                        {project.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-500">SYSTEM #{project.id}</span>
                      <div className="font-mono text-xl sm:text-2xl font-black text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                        {project.id}
                      </div>
                    </div>
                  </div>

                  {/* Body Section: Wide Cards feature Horizontal Split on Desktop (lg:flex-row) */}
                  <div className={`flex flex-col ${isWide ? "lg:flex-row items-stretch" : ""} flex-grow justify-between`}>
                    
                    {/* Visual Preview / Mockup Frame (Right side on wide desktop cards, top on single cards) */}
                    <div className={`w-full ${isWide ? "lg:w-[48%] lg:order-2" : ""} flex flex-col border-b ${isWide ? "lg:border-b-0 lg:border-l" : ""} border-white/10 bg-[#040709]`}>
                      
                      {isPortraitMobile ? (
                        /* Mobile Device Bezel Frame Floating over Cyan Radial Mesh */
                        <div className="relative w-full h-full min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-b from-cyan-950/20 via-black to-black">
                          {/* Cyan radial mesh & grid glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--theme-rgb),0.18),transparent_70%)] pointer-events-none" />
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />

                          {/* Centered Phone Bezel Frame */}
                          <div className="relative z-10 w-[170px] sm:w-[195px] rounded-[2.2rem] p-2 bg-[#090d10] border-2 border-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(var(--theme-rgb),0.2)] group-hover:border-cyan-500/50 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(var(--theme-rgb),0.35)] transition-all duration-500">
                            {/* Dynamic Island / Speaker Notch */}
                            <div className="w-16 h-3 bg-black border border-white/10 rounded-full mx-auto mb-1.5 flex items-center justify-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse" />
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                            </div>
                            {/* Mobile Screen Container */}
                            <div className="relative w-full aspect-[9/18] rounded-[1.6rem] overflow-hidden bg-black border border-white/10">
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                            </div>
                            {/* Home Indicator Bar */}
                            <div className="w-14 h-1 bg-white/30 rounded-full mx-auto mt-2" />
                          </div>

                          {/* Floating Live Pipeline Overlay at bottom of phone container */}
                          <div className="w-full max-w-xs mt-4 relative z-10">
                            <div className="bg-black/90 backdrop-blur-md rounded-xl p-2.5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                  <Workflow size={10} className="text-cyan-400" /> PIPELINE
                                </span>
                                <span className="text-[9px] font-mono text-cyan-400/80">MOBILE LIVE</span>
                              </div>
                              <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
                                {meta.pipeline.map((node, nIdx) => (
                                  <div key={nIdx} className="flex items-center shrink-0">
                                    <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-center">
                                      <div className="text-[8px] font-mono font-semibold text-neutral-300 whitespace-nowrap">
                                        {node.label}
                                      </div>
                                    </div>
                                    {nIdx < meta.pipeline.length - 1 && (
                                      <div className="mx-0.5 text-cyan-500/50 text-[8px]">→</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (
                        /* Dark Glass Browser Frame for Landscape Web Systems */
                        <div className="flex flex-col w-full h-full">
                          {/* Browser Address Bar with Traffic Lights */}
                          <div className="px-4 py-2.5 bg-black/80 border-b border-white/10 flex items-center justify-between gap-3 select-none">
                            {/* 3 Traffic Light Dots */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 border border-rose-400/40" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 border border-amber-400/40" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 border border-emerald-400/40" />
                            </div>

                            {/* URL Pill */}
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400 max-w-[260px] truncate">
                              <Terminal size={10} className="text-cyan-400 shrink-0" />
                              <span className="text-neutral-300 truncate">{meta.urlDomain}</span>
                            </div>

                            {/* Live Indicator */}
                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold tracking-wider shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>LIVE</span>
                            </div>
                          </div>

                          {/* Screenshot Showcase Container */}
                          <div className={`relative w-full ${isWide ? "h-64 sm:h-76 lg:h-full" : "h-56 sm:h-64"} flex items-center justify-center p-3 bg-gradient-to-b from-cyan-950/20 via-black to-black overflow-hidden`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--theme-rgb),0.12),transparent_70%)] pointer-events-none" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
                            
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover object-top rounded-lg border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-all duration-700 ease-out"
                            />

                            {/* Automation Pipeline Overlay */}
                            <div className="absolute bottom-3 left-3 right-3 z-20">
                              <div className="bg-black/90 backdrop-blur-md rounded-xl p-2.5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                    <Workflow size={10} className="text-cyan-400" /> PIPELINE
                                  </span>
                                  <span className="text-[9px] font-mono text-cyan-400/80">AUTOMATED</span>
                                </div>
                                <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
                                  {meta.pipeline.map((node, nIdx) => (
                                    <div key={nIdx} className="flex items-center shrink-0">
                                      <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-center">
                                        <div className="text-[8px] font-mono font-semibold text-neutral-300 whitespace-nowrap">
                                          {node.label}
                                        </div>
                                      </div>
                                      {nIdx < meta.pipeline.length - 1 && (
                                        <div className="mx-1 text-cyan-500/50 text-[9px]">→</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Content & Micro-Metrics Section (Left side on wide desktop cards, bottom on single cards) */}
                    <div className={`p-6 sm:p-7 md:p-8 flex flex-col justify-between flex-grow ${isWide ? "lg:w-[52%] lg:order-1" : ""} relative z-10`}>
                      <div>
                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tight mb-3 group-hover:text-cyan-300 transition-colors leading-tight">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-5">
                          {project.desc}
                        </p>

                        {/* Live Metric Badges (Strictly styled per specification) */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.metricBadges?.map((badge: string, bIdx: number) => (
                            <span 
                              key={bIdx}
                              className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full font-mono font-medium inline-flex items-center gap-1.5"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.tech.map((t: string) => (
                            <span 
                              key={t} 
                              className="text-[9px] font-mono font-semibold text-cyan-300/80 uppercase bg-cyan-950/30 px-2.5 py-1 rounded-md border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Key Contributions List */}
                        {project.contributions && (
                          <div className="mb-6 pt-4 border-t border-white/10 space-y-2.5">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-2">
                              <ShieldCheck size={12} className="text-cyan-400" /> KEY CONTRIBUTIONS
                            </span>
                            {project.contributions.map((item: string, cIdx: number) => (
                              <div key={cIdx} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                                <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interactive Card Footer (Conversion CTAs) */}
                      <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                        <MagneticButton>
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-wider text-[11px] uppercase transition-all shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)] active:scale-95 group/btn"
                          >
                            <span>Live Preview</span>
                            <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        </MagneticButton>

                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <MagneticButton>
                              <a 
                                href={project.githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="System Repository Specs"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/40 text-neutral-400 hover:text-white transition-all text-xs font-mono group/gh"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                  <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                                <span className="hidden sm:inline">Specs</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                              </a>
                            </MagneticButton>
                          )}
                          <MagneticButton>
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="Direct Link"
                              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-950/50 transition-all"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </MagneticButton>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
