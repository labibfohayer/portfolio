"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Network, 
  Terminal, 
  Database, 
  Shield, 
  Layout, 
  Cpu, 
  Bot, 
  GitBranch, 
  Cloud, 
  Layers,
  Zap,
  Radio,
  CheckCircle2
} from "lucide-react";

const allSkills = [
  "React", "Tailwind CSS", "Python", "Node.js", "REST API", "Firebase", "MongoDB", "Docker", "Git", "PowerShell", "C++", "Java"
];

const nodes = [
  { name: "FRONTEND ARCHITECTURE", icon: Layout, tag: "EDGE_UI", desc: "Next.js 16, React 19, Tailwind CSS" },
  { name: "DATABASE SCHEMAS", icon: Database, tag: "STORAGE", desc: "MongoDB, PostgreSQL, Firebase" },
  { name: "BACKEND APIS", icon: Terminal, tag: "RUNTIME", desc: "Node.js, Express, REST & tRPC" },
  { name: "AI & CLOUD ORCHESTRATION", icon: Network, tag: "PIPELINE", desc: "LangChain, Vector Stores, Cloud Workers" },
  { name: "SYSTEM AUTOMATION", icon: Cpu, tag: "WORKFLOW", desc: "n8n, Custom Daemon Bots, Cron Jobs" },
  { name: "LLM & PROMPT ENGINEERING", icon: Bot, tag: "REASONING", desc: "Gemini 2.5/3.0, Claude 3.5, OpenAI" },
  { name: "CI/CD PIPELINES", icon: GitBranch, tag: "DEVOPS", desc: "GitHub Actions, Turbopack, Docker" },
  { name: "SERVERLESS ARCHITECTURE", icon: Cloud, tag: "INFRA", desc: "Vercel Edge, AWS Lambda, Cloudflare" },
  { name: "STATE MANAGEMENT", icon: Layers, tag: "REACTIVE", desc: "Zustand, React Query, Server Actions" }
];

export default function Skills() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section id="skills" className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 md:pb-32 relative z-10 overflow-hidden w-full max-w-full border-t border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[black] to-[black]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center w-full">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 bg-cyan-950/20 backdrop-blur-md">
          <Network size={12} className="text-cyan-400 animate-pulse" /> // SYSTEM ARCHITECTURE
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter text-white mb-2 text-center break-words">
          CORE <span className="text-cyan-500 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">TECH ECOSYSTEM</span>
        </h2>
        <p className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-widest mb-10 md:mb-16 text-center max-w-lg">
          RADIAL TELEMETRY CONSOLE // HOVER NODES TO INSPECT LIVE INTERCONNECTS
        </p>

        {/* Mobile View: High-Performance Cyberpunk Grid (Zero horizontal overflow) */}
        <div className="flex md:hidden flex-col items-center w-full gap-6">
          {/* Core Badge */}
          <div className="w-24 h-24 rounded-full glass-card flex flex-col items-center justify-center border border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.4)] bg-black/80">
            <Shield className="text-cyan-400 mb-1" size={20} />
            <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase text-center leading-tight">
              SYSTEM<br/>CORE
            </span>
          </div>

          {/* Capability Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <div 
                  key={i} 
                  className="glass-card p-3.5 rounded-xl border border-cyan-500/20 bg-black/60 flex items-center justify-between gap-3 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-200 tracking-wider uppercase block">
                        {node.name}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 block">
                        {node.desc}
                      </span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {node.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View: Live Interactive 3D Radar Console UI */}
        <div className="hidden md:flex relative w-full max-w-4xl h-[620px] items-center justify-center group/orbit overflow-hidden">
          
          {/* Radar Scanner Beam */}
          <div className="absolute w-[600px] h-[600px] rounded-full overflow-hidden pointer-events-none z-0 mix-blend-screen">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(var(--theme-rgb),0.35)_360deg)] origin-center"
            />
          </div>

          {/* Background Radar Rings */}
          <div className="absolute w-[300px] h-[300px] border border-cyan-500/25 rounded-full animate-[spin_20s_linear_infinite] border-dashed z-0 pointer-events-none" />
          <div className="absolute w-[450px] h-[450px] border border-cyan-500/15 rounded-full animate-[spin_30s_linear_infinite_reverse] z-0 pointer-events-none" />
          <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full z-0 pointer-events-none" />

          {/* Core Node Pulse */}
          <motion.div 
            whileHover={{ scale: 1.08 }}
            animate={{ 
              boxShadow: hoveredNode 
                ? "0 0 65px rgba(var(--theme-rgb),0.7)" 
                : ["0 0 20px rgba(var(--theme-rgb),0.2)", "0 0 60px rgba(var(--theme-rgb),0.6)", "0 0 20px rgba(var(--theme-rgb),0.2)"] 
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute z-30 w-36 h-36 rounded-full glass flex flex-col items-center justify-center border-2 transition-all duration-300 cursor-crosshair bg-black/90 ${
              hoveredNode ? "border-cyan-400 shadow-[0_0_60px_rgba(var(--theme-rgb),0.8)]" : "border-cyan-500/80"
            }`}
          >
            <Shield className="text-cyan-400 mb-1" size={24} />
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase text-center leading-tight drop-shadow-[0_0_8px_rgba(var(--theme-rgb),1)]">
              {hoveredNode ? (
                <>ACTIVE<br/><span className="text-white text-[9px]">INTERCONNECT</span></>
              ) : (
                <>SYSTEM<br/>CORE</>
              )}
            </span>
            <span className="text-[8px] font-mono text-cyan-300/80 mt-1 uppercase">
              {hoveredNode || "ONLINE"}
            </span>
          </motion.div>

          {/* Floating Skill Nodes Orbit Container */}
          <div className="absolute w-[600px] h-[600px] animate-[spin_45s_linear_infinite] group-hover/orbit:[animation-play-state:paused] z-20">
            {nodes.map((node, i) => {
              const radius = 290;
              const angle = (i * 360) / nodes.length;
              const radian = (angle * Math.PI) / 180;
              const x = Math.round(Math.cos(radian) * radius * 100) / 100;
              const y = Math.round(Math.sin(radian) * radius * 100) / 100;
              const isHovered = hoveredNode === node.name;
              
              return (
                <div 
                  key={i} 
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group/node${i}`}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  onMouseEnter={() => setHoveredNode(node.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Laser pointing to center */}
                  <div 
                    className={`absolute top-1/2 left-1/2 h-[2px] w-[290px] origin-left pointer-events-none transition-opacity duration-300 z-0 ${
                      isHovered ? "opacity-100" : "opacity-0 group-hover/node" + i + ":opacity-100"
                    }`}
                    style={{
                      background: 'linear-gradient(to right, rgba(var(--theme-rgb),0.9), rgba(var(--theme-rgb),0))',
                      filter: "drop-shadow(0 0 10px rgb(var(--theme-rgb)))",
                      transform: `translateY(-50%) rotate(${angle + 180}deg)`
                    }}
                  />
                  
                  {/* Floating Interactive Node Pill */}
                  <motion.div 
                    className={`relative z-10 glass-card px-4 py-2 rounded-full border flex items-center gap-2 animate-[spin_45s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer transition-all duration-300 whitespace-nowrap bg-black/90 ${
                      isHovered 
                        ? "border-cyan-400 bg-cyan-950/80 scale-110 shadow-[0_0_25px_rgba(6,182,212,0.6)]" 
                        : "border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-900/40 hover:scale-110"
                    }`}
                  >
                    <node.icon size={13} className="text-cyan-400 shrink-0" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">{node.name}</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                      {node.tag}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Live Status Telemetry Bar (3-Pill Modern Telemetry) */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 w-full">
          {/* Pill 1: Systems Operational */}
          <div className="px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono font-semibold text-emerald-300 flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>All Systems Operational</span>
          </div>

          {/* Pill 2: Architecture */}
          <div className="px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono font-semibold text-cyan-300 flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Cpu size={13} className="text-cyan-400" />
            <span>Architecture: Event-Driven & Serverless</span>
          </div>

          {/* Pill 3: Deployment */}
          <div className="px-4 py-2 rounded-full bg-blue-950/40 border border-blue-500/30 text-[11px] font-mono font-semibold text-blue-300 flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Cloud size={13} className="text-blue-400" />
            <span>Deployment: Multi-Region Cloud</span>
          </div>
        </div>

        {/* Tech Stack Marquee */}
        <div className="w-full max-w-full mt-12 sm:mt-16 border-y border-cyan-500/20 py-4 sm:py-5 overflow-x-hidden bg-cyan-900/5 shadow-[0_0_30px_rgba(var(--theme-rgb),0.05)] select-none">
          <div className="flex gap-8 whitespace-nowrap animate-marquee items-center">
            {[...allSkills, ...allSkills, ...allSkills].map((skill, i) => (
              <span key={i} className="text-xs sm:text-sm font-bold tracking-widest text-neutral-400 uppercase hover:text-cyan-400 transition-all cursor-pointer py-1">
                // {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
