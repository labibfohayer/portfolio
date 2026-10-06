"use client";

import { motion } from "framer-motion";
import { Network, Terminal, Database, Shield } from "lucide-react";

const allSkills = [
  "React", "Tailwind CSS", "Python", "Node.js", "REST API", "Firebase", "MongoDB", "Docker", "Git", "PowerShell", "C++", "Java"
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative z-10 overflow-hidden border-t border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[black] to-[black]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-8">
          <Network size={12} className="text-cyan-500" /> RADIAL CAPABILITY CONSOLE
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white mb-2">
          TECHNOLOGIES I BUILD WITH
        </h2>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-24">
          SCROLL CONSOLE // HOVER TO INTERACT
        </p>

        {/* Live Interactive Console UI */}
        <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center">
          
          {/* Background Radar Rings */}
          <div className="absolute w-[300px] h-[300px] border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite] border-dashed" />
          <div className="absolute w-[450px] h-[450px] border border-cyan-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full" />

          {/* Core Node */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="absolute z-30 w-32 h-32 rounded-full glass flex flex-col items-center justify-center border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]"
          >
            <Shield className="text-cyan-400 mb-1" size={24} />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase text-center leading-tight">SYSTEM<br/>CORE</span>
          </motion.div>

          {/* Floating Skill Nodes */}
          <div className="absolute w-full h-full animate-[spin_40s_linear_infinite]">
            <motion.div className="absolute top-10 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full border-cyan-500/30 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">FRONTEND ARCHITECTURE</span>
            </motion.div>
            
            <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full border-cyan-500/30 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse]">
              <Database size={12} className="text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">DATABASE SCHEMAS</span>
            </motion.div>

            <motion.div className="absolute left-10 top-1/2 -translate-y-1/2 glass-card px-4 py-2 rounded-full border-cyan-500/30 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse]">
              <Terminal size={12} className="text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">BACKEND APIS</span>
            </motion.div>

            <motion.div className="absolute right-10 top-1/2 -translate-y-1/2 glass-card px-4 py-2 rounded-full border-cyan-500/30 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse]">
              <Network size={12} className="text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">AI & CLOUD ORCHESTRATION</span>
            </motion.div>
          </div>

        </div>

        {/* Tech Stack Marquee */}
        <div className="w-full mt-20 border-y border-white/5 py-4 overflow-hidden bg-white/[0.01]">
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {[...allSkills, ...allSkills, ...allSkills].map((skill, i) => (
              <span key={i} className="text-sm font-bold tracking-widest text-neutral-500 uppercase hover:text-cyan-400 transition-colors cursor-pointer">
                // {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
