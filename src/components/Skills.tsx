"use client";

import { motion } from "framer-motion";
import { Network, Terminal, Database, Shield, Layout, Cpu, Bot, GitBranch, Cloud, Layers } from "lucide-react";

const allSkills = [
  "React", "Tailwind CSS", "Python", "Node.js", "REST API", "Firebase", "MongoDB", "Docker", "Git", "PowerShell", "C++", "Java"
];

const nodes = [
  { name: "FRONTEND ARCHITECTURE", icon: Layout },
  { name: "DATABASE SCHEMAS", icon: Database },
  { name: "BACKEND APIS", icon: Terminal },
  { name: "AI & CLOUD ORCHESTRATION", icon: Network },
  { name: "SYSTEM AUTOMATION", icon: Cpu },
  { name: "LLM & PROMPT ENGINEERING", icon: Bot },
  { name: "CI/CD PIPELINES", icon: GitBranch },
  { name: "SERVERLESS ARCHITECTURE", icon: Cloud },
  { name: "STATE MANAGEMENT", icon: Layers }
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-36 relative z-10 overflow-hidden w-full max-w-full border-t border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[black] to-[black]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center w-full">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6 sm:mb-8">
          <Network size={12} className="text-cyan-500 animate-pulse" /> RADIAL CAPABILITY CONSOLE
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white mb-2 text-center break-words">
          TECHNOLOGIES I BUILD WITH
        </h2>
        <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest mb-10 md:mb-24 text-center">
          SCROLL CONSOLE // HOVER TO INTERACT
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
                  className="glass-card p-3.5 rounded-xl border border-cyan-500/20 bg-black/60 flex items-center gap-3 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 tracking-wider uppercase">
                    {node.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View: Live Interactive 3D Radar Console UI */}
        <div className="hidden md:flex relative w-full max-w-4xl h-[600px] items-center justify-center group/orbit overflow-hidden">
          
          {/* Radar Scanner Beam */}
          <div className="absolute w-[600px] h-[600px] rounded-full overflow-hidden pointer-events-none z-0 mix-blend-screen">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(var(--theme-rgb),0.3)_360deg)] origin-center"
            />
          </div>

          {/* Background Radar Rings */}
          <div className="absolute w-[300px] h-[300px] border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite] border-dashed z-0 pointer-events-none" />
          <div className="absolute w-[450px] h-[450px] border border-cyan-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse] z-0 pointer-events-none" />
          <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full z-0 pointer-events-none" />

          {/* Core Node Pulse */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            animate={{ boxShadow: ["0 0 20px rgba(var(--theme-rgb),0.2)", "0 0 60px rgba(var(--theme-rgb),0.6)", "0 0 20px rgba(var(--theme-rgb),0.2)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-30 w-32 h-32 rounded-full glass flex flex-col items-center justify-center border-cyan-500/80 shadow-[0_0_50px_rgba(var(--theme-rgb),0.6)] cursor-crosshair bg-black/80"
          >
            <Shield className="text-cyan-400 mb-1" size={24} />
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase text-center leading-tight drop-shadow-[0_0_8px_rgba(var(--theme-rgb),1)]">SYSTEM<br/>CORE</span>
          </motion.div>

          {/* Floating Skill Nodes */}
          <div className="absolute w-[600px] h-[600px] animate-[spin_40s_linear_infinite] group-hover/orbit:[animation-play-state:paused] z-20">
            {nodes.map((node, i) => {
              const radius = 300;
              const angle = (i * 360) / nodes.length;
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;
              
              return (
                <div 
                  key={i} 
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group/node${i}`}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                >
                  {/* Laser pointing to center */}
                  <div 
                    className={`absolute top-1/2 left-1/2 h-[2px] w-[300px] origin-left pointer-events-none opacity-0 group-hover/node${i}:opacity-100 transition-opacity duration-300 z-0`}
                    style={{
                      background: 'linear-gradient(to right, rgba(var(--theme-rgb),0.8), rgba(var(--theme-rgb),0))',
                      filter: "drop-shadow(0 0 8px rgb(var(--theme-rgb)))",
                      transform: `translateY(-50%) rotate(${angle + 180}deg)`
                    }}
                  />
                  
                  {/* Floating Content */}
                  <motion.div className="relative z-10 glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform whitespace-nowrap bg-black/80">
                    <node.icon size={12} className="text-cyan-400" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">{node.name}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Tech Stack Marquee */}
        <div className="w-full max-w-full mt-14 sm:mt-20 border-y border-cyan-500/20 py-4 sm:py-5 overflow-x-hidden bg-cyan-900/5 shadow-[0_0_30px_rgba(var(--theme-rgb),0.05)] select-none">
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
