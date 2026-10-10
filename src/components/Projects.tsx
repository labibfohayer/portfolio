"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, CheckCircle2 } from "lucide-react";
import Tilt from "react-parallax-tilt";
import MagneticButton from "./ui/MagneticButton";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.projects);
        }
      });
  }, []);
  return (
    <section id="projects" className="py-20 md:py-32 relative z-10 bg-[black]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
              <Code2 size={12} className="text-cyan-500" /> SELECTED WORK
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
              ARCHITECTING <br />
              <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)]">DIGITAL ECOSYSTEMS</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
            A selection of modern web applications, management platforms, and high-performance digital systems engineered for scale and speed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className="h-full"
              >
                <Tilt 
                  glareEnable={true} 
                  glareMaxOpacity={0.15} 
                  glareColor="cyan" 
                  glarePosition="all" 
                  tiltMaxAngleX={5} 
                  tiltMaxAngleY={5} 
                  scale={1.02}
                  transitionSpeed={2500}
                  className="h-full"
                >
                  <div className="glass-card rounded-[2rem] overflow-hidden group flex flex-col relative bg-cyan-950/5 border border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(var(--theme-rgb),0.15)] transition-all duration-500 h-full">
                    
                    {/* Top Image Section (Zoom Reveal on Hover) */}
                    <div className="w-full h-64 md:h-80 relative overflow-hidden bg-black/60 border-b border-white/5">
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> FEATURED APP
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 z-20 text-4xl font-display font-bold text-cyan-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                        {project.id}
                      </div>
                      
                      {project.image && (
                        <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center p-4">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-contain object-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-2xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[black] via-transparent to-transparent opacity-90" />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col flex-grow relative z-20 bg-gradient-to-b from-transparent to-black/50">
                      <h4 className="text-cyan-500 font-bold tracking-widest text-[10px] uppercase mb-2">
                        {project.role}
                      </h4>
                      
                      <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 leading-tight group-hover:text-cyan-300 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                        {project.desc}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((t) => (
                          <span key={t} className="text-[10px] font-bold text-cyan-300/70 tracking-widest uppercase bg-cyan-950/30 px-3 py-1.5 rounded-full border border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-300 transition-colors">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="w-full h-px bg-white/10 mb-6" />

                      <div className="space-y-4 mb-10">
                        <h5 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> KEY CONTRIBUTIONS
                        </h5>
                        {project.contributions.map((contribution, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-neutral-300 leading-relaxed">
                              {contribution}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer Magnetic Buttons */}
                      <div className="flex items-center justify-between mt-auto">
                        <MagneticButton>
                          <a href={project.liveUrl} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest text-[10px] uppercase transition-colors shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)]">
                            LIVE DEMO <ArrowUpRight size={14} strokeWidth={3} />
                          </a>
                        </MagneticButton>
                        
                        <div className="flex items-center gap-3">
                          <MagneticButton>
                            <a href={project.githubUrl} className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/50 transition-colors">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                              </svg>
                            </a>
                          </MagneticButton>
                          <MagneticButton>
                            <a href={project.liveUrl} className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/50 transition-colors">
                              <ArrowUpRight size={16} />
                            </a>
                          </MagneticButton>
                        </div>
                      </div>

                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
