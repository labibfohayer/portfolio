"use client";

import { motion } from "framer-motion";
import { Network, Terminal, Database, Shield } from "lucide-react";
import { useState } from "react";

const skillCategories = {
  ALL: ["React", "Tailwind CSS", "Python", "Node.js", "REST API", "Firebase", "MongoDB", "Docker", "Git", "PowerShell", "C++", "Java"],
  FRONTEND: ["React", "Tailwind CSS", "Framer Motion", "Next.js", "TypeScript", "Redux"],
  DATABASE: ["MongoDB", "Firebase", "PostgreSQL", "Redis", "Vector DB", "Prisma"],
  BACKEND: ["Python", "Node.js", "REST API", "Express", "C++", "Java", "Django"],
  CLOUD: ["Docker", "Git", "AWS", "PowerShell", "Vercel", "Linux", "CI/CD"]
};

type CategoryKey = keyof typeof skillCategories;

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("ALL");

  return (
    <section id="skills" className="py-32 relative z-10 overflow-hidden border-t border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[black] to-[black]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-8">
          <Network size={12} className="text-cyan-500 animate-pulse" /> RADIAL CAPABILITY CONSOLE
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white mb-2">
          TECHNOLOGIES I BUILD WITH
        </h2>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-24">
          SCROLL CONSOLE // HOVER OR CLICK NODES TO INTERACT
        </p>

        {/* Live Interactive Console UI */}
        <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center group/orbit">
          
          {/* Radar Scanner Beam */}
          <div className="absolute w-[600px] h-[600px] rounded-full overflow-hidden pointer-events-none z-0 mix-blend-screen">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(6,182,212,0.3)_360deg)] origin-center"
            />
          </div>

          {/* Background Radar Rings */}
          <div className="absolute w-[300px] h-[300px] border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite] border-dashed z-0 pointer-events-none" />
          <div className="absolute w-[450px] h-[450px] border border-cyan-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse] z-0 pointer-events-none" />
          <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full z-0 pointer-events-none" />

          {/* Electron Data Flows (Feature 2) */}
          <div className="absolute w-[300px] h-[300px] rounded-full animate-[spin_1.5s_linear_infinite] z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,1)]" />
          </div>
          <div className="absolute w-[450px] h-[450px] rounded-full animate-[spin_2.5s_linear_infinite_reverse] z-10 pointer-events-none">
            <div className="absolute top-1/2 right-0 w-2 h-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)]" />
          </div>
          <div className="absolute w-[600px] h-[600px] rounded-full animate-[spin_4s_linear_infinite] z-10 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)]" />
          </div>

          {/* Particles Emitting from Core */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos((i * 45) * Math.PI / 180) * 300,
                  y: Math.sin((i * 45) * Math.PI / 180) * 300,
                  opacity: [1, 1, 0],
                  scale: [0, 2, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.3
                }}
              />
            ))}
          </div>

          {/* Core Node - Expansion on Hover (Feature 3) */}
          <motion.div 
            className="absolute z-30 w-32 h-32 rounded-full glass flex flex-col items-center justify-center border-cyan-500/80 shadow-[0_0_50px_rgba(6,182,212,0.6)] cursor-crosshair bg-black/80 group/core"
            whileHover={{ scale: 1.6 }}
            animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 60px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.2)"] }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          >
            <Shield className="text-cyan-400 mb-1 group-hover/core:scale-0 group-hover/core:opacity-0 transition-all duration-300" size={24} />
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase text-center leading-tight drop-shadow-[0_0_8px_rgba(6,182,212,1)] group-hover/core:opacity-0 group-hover/core:scale-0 transition-all duration-300">SYSTEM<br/>CORE</span>
            
            {/* Expanded Content (Reactor Blast) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/core:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -top-1 text-[8px] font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] tracking-widest">REACT</div>
              <div className="absolute -bottom-2 -left-2 text-[8px] font-bold text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] tracking-widest">PYTHON</div>
              <div className="absolute -bottom-2 -right-2 text-[8px] font-bold text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] tracking-widest">NODE.JS</div>
              <div className="absolute w-12 h-12 bg-cyan-500/30 rounded-full animate-ping" />
            </div>
          </motion.div>

          {/* Floating Skill Nodes */}
          <div className="absolute w-[600px] h-[600px] animate-[spin_40s_linear_infinite] group-hover/orbit:[animation-play-state:paused] z-20">
            
            {/* Top Node (Frontend) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group/node1">
              <div className="absolute top-1/2 left-1/2 w-[2px] h-[300px] -translate-x-1/2 bg-gradient-to-t from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node1:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div 
                onClick={() => setActiveCategory("FRONTEND")}
                className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">FRONTEND ARCHITECTURE</span>
              </motion.div>
            </div>
            
            {/* Bottom Node (Database) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 group/node2">
              <div className="absolute bottom-1/2 left-1/2 w-[2px] h-[300px] -translate-x-1/2 bg-gradient-to-b from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node2:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div 
                onClick={() => setActiveCategory("DATABASE")}
                className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform"
              >
                <Database size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">DATABASE SCHEMAS</span>
              </motion.div>
            </div>

            {/* Left Node (Backend) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 group/node3">
              <div className="absolute left-1/2 top-1/2 h-[2px] w-[300px] -translate-y-1/2 bg-gradient-to-l from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node3:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div 
                onClick={() => setActiveCategory("BACKEND")}
                className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform"
              >
                <Terminal size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">BACKEND APIS</span>
              </motion.div>
            </div>

            {/* Right Node (Cloud/AI) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 group/node4">
              <div className="absolute right-1/2 top-1/2 h-[2px] w-[300px] -translate-y-1/2 bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node4:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div 
                onClick={() => setActiveCategory("CLOUD")}
                className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform"
              >
                <Network size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">AI & CLOUD ORCHESTRATION</span>
              </motion.div>
            </div>

          </div>

        </div>

        {/* Tech Stack Marquee with Smart Filtering (Feature 4) */}
        <div className="w-full mt-20 border-y border-cyan-500/20 py-4 overflow-hidden bg-cyan-900/5 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          <div className="flex gap-8 whitespace-nowrap animate-marquee" key={activeCategory}>
            {/* Duplicated multiple times to ensure seamless infinite scrolling */}
            {[...skillCategories[activeCategory], ...skillCategories[activeCategory], ...skillCategories[activeCategory], ...skillCategories[activeCategory]].map((skill, i) => (
              <span key={i} className="text-sm font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] uppercase cursor-pointer">
                // {skill}
              </span>
            ))}
          </div>
        </div>

        {activeCategory !== "ALL" && (
          <button 
            onClick={() => setActiveCategory("ALL")}
            className="mt-6 text-[10px] text-neutral-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
          >
            [ Reset Filter ]
          </button>
        )}

      </div>
    </section>
  );
}
