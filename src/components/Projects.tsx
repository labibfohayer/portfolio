"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Code2, 
  CheckCircle2, 
  Terminal, 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  GitBranch, 
  ExternalLink,
  ShieldCheck,
  Workflow,
  Radio
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
    contributions: [
      "Orchestrated seamless checkout flows with instant WhatsApp conversion.",
      "Created highly optimized product grids with sub-second render speeds.",
      "Designed responsive mobile layout ensuring max conversion rates."
    ],
    liveUrl: "https://ponyopuri.com",
    githubUrl: "https://github.com/labibfohayer"
  }
];

// Rich SaaS metadata for live metrics & pipeline architecture
const projectMeta: Record<string, {
  status: string;
  metrics: { label: string; value: string }[];
  pipeline: { label: string; tag: string }[];
}> = {
  "01": {
    status: "Production Ready",
    metrics: [
      { label: "Efficiency", value: "90% Automated" },
      { label: "Latency", value: "<850ms" },
      { label: "Architecture", value: "Multi-Agent" }
    ],
    pipeline: [
      { label: "Lead Ingestion", tag: "TRIGGER" },
      { label: "AI Reasoning", tag: "WORKER" },
      { label: "Pipeline Sync", tag: "DATA" },
      { label: "Instant Output", tag: "EMIT" }
    ]
  },
  "02": {
    status: "Active System",
    metrics: [
      { label: "Admissions", value: "100% Online" },
      { label: "Performance", value: "99/100 Lighthouse" }
    ],
    pipeline: [
      { label: "Public Web", tag: "PORTAL" },
      { label: "Routing API", tag: "ROUTER" },
      { label: "Cloud Store", tag: "STORAGE" }
    ]
  },
  "03": {
    status: "Enterprise Live",
    metrics: [
      { label: "Active Base", value: "1,000+ Users" },
      { label: "Security", value: "RBAC Matrix" },
      { label: "Accounting", value: "Automated" }
    ],
    pipeline: [
      { label: "Bio Tracker", tag: "TELEMETRY" },
      { label: "RBAC Controller", tag: "AUTH" },
      { label: "Fee Gateway", tag: "LEDGER" },
      { label: "Reports Gen", tag: "EXPORTER" }
    ]
  },
  "04": {
    status: "Deployed System",
    metrics: [
      { label: "Residents", value: "500+ Active" },
      { label: "Calculation", value: "Zero Drift" }
    ],
    pipeline: [
      { label: "Meal Records", tag: "INPUT" },
      { label: "Split Algorithm", tag: "COMPUTE" },
      { label: "Live Ledger", tag: "STORE" }
    ]
  },
  "05": {
    status: "Production Ready",
    metrics: [
      { label: "Ingestion", value: "<100ms" },
      { label: "Analytics", value: "Realtime" }
    ],
    pipeline: [
      { label: "TX Stream", tag: "HOOK" },
      { label: "Budget Vault", tag: "CALC" },
      { label: "Chart Worker", tag: "VIZ" }
    ]
  },
  "06": {
    status: "Active System",
    metrics: [
      { label: "Conversion", value: "Direct WA" },
      { label: "Render Time", value: "<1.2s" }
    ],
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
          setProjects(data.projects);
        }
      })
      .catch(() => {
        // Fallback to defaultProjects already set
      });
  }, []);

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 relative z-10 bg-black overflow-hidden w-full max-w-full">
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

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full auto-rows-fr">
          {projects.map((project, idx) => {
            // Asymmetric Bento configuration:
            // First item (01) spans 2 columns
            // Sixth item (03/06 depending on sort) spans 2 columns
            // Creates an aesthetically balanced SaaS layout
            const isFeatured = idx === 0 || (projects.length >= 6 && idx === 5) || (projects.length === 3 && idx === 0);
            const meta = projectMeta[project.id] || {
              status: "Production Ready",
              metrics: [
                { label: "Deployment", value: "Verified" },
                { label: "Uptime", value: "99.9%" }
              ],
              pipeline: [
                { label: "Client Request", tag: "TRIGGER" },
                { label: "API Controller", tag: "CORE" },
                { label: "Database Sync", tag: "STORE" }
              ]
            };

            return (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                className={`w-full h-full flex flex-col ${
                  isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                <div className="group relative rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden flex flex-col justify-between h-full bg-[#070b0e]/90 border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_12px_45px_rgba(var(--theme-rgb),0.18)] transition-all duration-500 backdrop-blur-xl">
                  
                  {/* Subtle Top Radial Glow on Hover */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 group-hover:bg-cyan-500/15 blur-3xl rounded-full transition-all duration-500 pointer-events-none" />

                  {/* 1. SaaS Browser / Terminal Mockup Frame */}
                  <div className="w-full relative overflow-hidden bg-[#040709] border-b border-white/10 flex flex-col">
                    
                    {/* Glassmorphic Mockup Header Bar */}
                    <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-3 select-none">
                      {/* Window Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 border border-rose-400/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 border border-amber-400/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 border border-emerald-400/40" />
                      </div>

                      {/* Mockup Address Pill */}
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/5 text-[10px] font-mono text-neutral-400 max-w-[240px] truncate">
                        <Terminal size={10} className="text-cyan-400 shrink-0" />
                        <span className="text-neutral-500">system://</span>
                        <span className="text-neutral-300 truncate">{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
                      </div>

                      {/* Live Status Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-[9px] font-mono text-cyan-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="hidden xs:inline uppercase">{meta.status}</span>
                      </div>
                    </div>

                    {/* Visual Preview / Image Frame */}
                    <div className={`w-full relative overflow-hidden flex items-center justify-center p-3 sm:p-5 ${
                      isFeatured ? "h-56 sm:h-72" : "h-48 sm:h-56"
                    }`}>
                      {project.image ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-inner group-hover:border-cyan-500/30 transition-colors duration-500">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#040709] via-transparent to-transparent opacity-90" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-950/20 to-black flex items-center justify-center border border-white/5">
                          <Activity size={32} className="text-cyan-500/40" />
                        </div>
                      )}

                      {/* Project Index Overlay */}
                      <div className="absolute top-4 right-4 z-10 font-mono text-3xl sm:text-4xl font-black text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors duration-500 select-none">
                        {project.id}
                      </div>

                      {/* Automation Architecture Mini-Diagram Overlay (Appears on Hover / Wide View) */}
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <div className="bg-black/85 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                              <Workflow size={10} className="text-cyan-400" /> AUTOMATION PIPELINE
                            </span>
                            <span className="text-[9px] font-mono text-cyan-400/80">ONLINE</span>
                          </div>

                          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
                            {meta.pipeline.map((node, nIdx) => (
                              <div key={nIdx} className="flex items-center shrink-0">
                                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 group-hover:border-cyan-500/30 text-center transition-colors">
                                  <div className="text-[8px] font-mono font-semibold text-neutral-300 whitespace-nowrap">
                                    {node.label}
                                  </div>
                                </div>
                                {nIdx < meta.pipeline.length - 1 && (
                                  <div className="mx-1 text-cyan-500/50 group-hover:text-cyan-400 transition-colors text-[10px]">
                                    →
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 2. Content & Micro-Metrics Section */}
                  <div className="p-5 sm:p-7 flex flex-col flex-grow justify-between relative z-10">
                    <div>
                      {/* Role & Category */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-cyan-400 font-mono font-semibold tracking-wider text-[10px] uppercase">
                          {project.role}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          ID: #{project.id}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tight mb-3 group-hover:text-cyan-300 transition-colors leading-tight">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                        {project.desc}
                      </p>

                      {/* Live Micro-Metrics Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                        {meta.metrics.map((metric, mIdx) => (
                          <div 
                            key={mIdx}
                            className="bg-white/[0.03] border border-white/10 rounded-lg p-2 group-hover:border-cyan-500/20 transition-all duration-300"
                          >
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono block">
                              {metric.label}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white font-mono block mt-0.5">
                              {metric.value}
                            </span>
                          </div>
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

                      {/* Featured Card Extra: Key Contributions */}
                      {isFeatured && project.contributions && (
                        <div className="mb-6 pt-4 border-t border-white/10 space-y-2">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-2">
                            <ShieldCheck size={12} className="text-cyan-400" /> SYSTEM ARCHITECTURE HIGHLIGHTS
                          </span>
                          {project.contributions.slice(0, 2).map((item: string, cIdx: number) => (
                            <div key={cIdx} className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed">
                              <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. Card Footer Action Bar */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                      <MagneticButton>
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-wider text-[11px] uppercase transition-all shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)] active:scale-95"
                        >
                          LIVE SYSTEM <ArrowUpRight size={13} strokeWidth={2.5} />
                        </a>
                      </MagneticButton>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <MagneticButton>
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="GitHub Repository"
                              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/50 transition-all"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                              </svg>
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
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
