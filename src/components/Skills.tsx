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
          <Network size={12} className="text-cyan-500 animate-pulse" /> RADIAL CAPABILITY CONSOLE
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white mb-2">
          TECHNOLOGIES I BUILD WITH
        </h2>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-24">
          SCROLL CONSOLE // HOVER TO INTERACT
        </p>

        {/* Live Interactive Console UI */}
        <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center group/orbit">
          
          {/* Radar Scanner Beam (Feature 1) */}
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

          {/* Particles Emitting from Core (Feature 4) */}
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

          {/* Core Node (Feature 4 Pulse) */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 60px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.2)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-30 w-32 h-32 rounded-full glass flex flex-col items-center justify-center border-cyan-500/80 shadow-[0_0_50px_rgba(6,182,212,0.6)] cursor-crosshair bg-black/80"
          >
            <Shield className="text-cyan-400 mb-1" size={24} />
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase text-center leading-tight drop-shadow-[0_0_8px_rgba(6,182,212,1)]">SYSTEM<br/>CORE</span>
          </motion.div>

          {/* Floating Skill Nodes (Feature 3: Hover to pause and laser) */}
          <div className="absolute w-[600px] h-[600px] animate-[spin_40s_linear_infinite] group-hover/orbit:[animation-play-state:paused] z-20">
            
            {/* Top Node */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group/node1">
              {/* Laser */}
              <div className="absolute top-1/2 left-1/2 w-[2px] h-[300px] -translate-x-1/2 bg-gradient-to-t from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node1:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">FRONTEND ARCHITECTURE</span>
              </motion.div>
            </div>
            
            {/* Bottom Node */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 group/node2">
              {/* Laser */}
              <div className="absolute bottom-1/2 left-1/2 w-[2px] h-[300px] -translate-x-1/2 bg-gradient-to-b from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node2:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform">
                <Database size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">DATABASE SCHEMAS</span>
              </motion.div>
            </div>

            {/* Left Node */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 group/node3">
              {/* Laser */}
              <div className="absolute left-1/2 top-1/2 h-[2px] w-[300px] -translate-y-1/2 bg-gradient-to-l from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node3:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform">
                <Terminal size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">BACKEND APIS</span>
              </motion.div>
            </div>

            {/* Right Node */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 group/node4">
              {/* Laser */}
              <div className="absolute right-1/2 top-1/2 h-[2px] w-[300px] -translate-y-1/2 bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-0 group-hover/node4:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }} />
              <motion.div className="relative glass-card px-4 py-2 rounded-full border-cyan-500/50 flex items-center gap-2 animate-[spin_40s_linear_infinite_reverse] group-hover/orbit:[animation-play-state:paused] cursor-pointer hover:bg-cyan-900/40 hover:scale-110 transition-transform">
                <Network size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">AI & CLOUD ORCHESTRATION</span>
              </motion.div>
            </div>

          </div>

        </div>

        {/* Tech Stack Marquee */}
        <div className="w-full mt-20 border-y border-cyan-500/20 py-4 overflow-hidden bg-cyan-900/5 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {[...allSkills, ...allSkills, ...allSkills].map((skill, i) => (
              <span key={i} className="text-sm font-bold tracking-widest text-neutral-400 uppercase hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all cursor-pointer">
                // {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
