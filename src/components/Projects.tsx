"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Code2, CheckCircle2, ChevronRight } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.projects);
        }
      });
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Total slides = Intro Slide + All Projects
  const totalSlides = projects.length > 0 ? projects.length + 1 : 1;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(totalSlides - 1) * 100}vw`]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (projects.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-500 font-mono text-sm animate-pulse">
        Initializing Project Ecosystem...
      </div>
    );
  }

  return (
    <section 
      id="projects" 
      ref={targetRef} 
      className="relative z-10 bg-black"
      style={{ height: `${totalSlides * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center bg-black">
        
        {/* Top Progress Bar */}
        <motion.div 
          className="absolute top-0 left-0 h-1 bg-cyan-500 z-50 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
          style={{ width: progressWidth }}
        />

        <motion.div style={{ x }} className="flex h-full items-center">
          
          {/* Slide 0: Intro Slide */}
          <div className="w-screen h-screen flex-shrink-0 flex flex-col justify-center px-6 md:px-24 bg-gradient-to-r from-black via-cyan-950/10 to-black">
            <div className="max-w-7xl mx-auto w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-cyan-400 uppercase mb-8 shadow-[0_0_15px_rgba(var(--theme-rgb),0.2)]">
                <Code2 size={14} className="text-cyan-500" /> SELECTED WORK
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-display font-black uppercase tracking-tighter leading-[0.85] text-white">
                ARCHITECTING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-800 drop-shadow-[0_0_30px_rgba(var(--theme-rgb),0.5)]">
                  DIGITAL <br/> ECOSYSTEMS
                </span>
              </h2>
              <div className="mt-12 flex items-center gap-6">
                <p className="text-neutral-400 text-lg md:text-2xl font-mono border-l-2 border-cyan-500/50 pl-6 max-w-xl">
                  Keep scrolling down to explore high-performance systems engineered for scale.
                </p>
                <motion.div 
                  animate={{ x: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 hidden md:flex"
                >
                  <ChevronRight size={24} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Project Slides */}
          {projects.map((project, index) => (
            <div key={project.id} className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 md:p-24 relative overflow-hidden group border-l border-white/5">
              
              {/* Background Big Text (Watermark) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0 overflow-hidden">
                <h1 className="text-[25vw] font-display font-black text-cyan-500 whitespace-nowrap">
                  0{index + 1}
                </h1>
              </div>

              <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
                
                {/* Left: Project Image */}
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-cyan-500/40 transition-colors duration-700 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                   {project.image && (
                     <img 
                       src={project.image} 
                       alt={project.title}
                       className="w-full h-full object-contain p-8 transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                   
                   <div className="absolute bottom-8 left-8 flex flex-wrap gap-2 pr-8">
                      {project.tags?.map((tag: string, i: number) => (
                        <span key={i} className="px-4 py-2 rounded-full border border-cyan-500/30 text-[10px] font-bold text-cyan-400 tracking-widest uppercase bg-black/80 backdrop-blur-md shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col">
                  <h4 className="text-cyan-500 font-mono font-bold tracking-widest text-[12px] uppercase mb-6 flex items-center gap-3">
                    <span className="w-12 h-px bg-cyan-500/50" />
                    PROJECT 0{index + 1} // {project.role}
                  </h4>
                  
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-wider mb-6 leading-tight group-hover:text-cyan-50 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                    {project.description}
                  </p>

                  <ul className="flex flex-col gap-4 mb-12">
                    {project.features?.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                        <CheckCircle2 size={18} className="text-cyan-500 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-6 mt-auto">
                    <MagneticButton>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-10 py-5 rounded-full bg-cyan-500 text-black font-black tracking-widest text-[11px] uppercase hover:bg-cyan-400 transition-colors flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                      >
                        EXPLORE PLATFORM <ArrowUpRight size={18} />
                      </a>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
