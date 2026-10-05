"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Sci-Fi Background Effects */}
      <div className="absolute inset-0 bg-[#050505] -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505] -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] -z-10" />

      {/* Floating particles/grid (optional, keeping it clean for now) */}
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid xl:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="space-y-6 z-10 pt-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-pill border border-cyan-500/30 text-xs md:text-sm font-bold tracking-widest text-neutral-300 uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            BUILDING AUTONOMOUS AI & MODERN SYSTEMS
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 text-sm font-bold tracking-widest text-neutral-400 uppercase mt-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            HELLO, I AM
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display font-bold leading-[0.85] tracking-tighter uppercase"
          >
            <h1 className="text-[14vw] xl:text-[8rem] text-white">
              MD. LABIB
            </h1>
            <h1 className="text-[14vw] xl:text-[8rem]">
              <span className="text-white">FOHAY</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500">ER</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-display font-bold text-cyan-500">L</span>
              <div className="w-1 h-6 bg-cyan-500" />
            </div>
            
            <h3 className="text-2xl md:text-3xl italic text-neutral-300 font-serif mb-4">
              Built for Scale & Precision.
            </h3>
            
            <p className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
              I architect autonomous AI agents and enterprise systems that automate complex workflows, compress development time by 10x, and cut operational costs by 70%.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <MagneticButton>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-500 text-[#050505] font-extrabold uppercase tracking-wide hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                VIEW MY WORK
                <ArrowRight size={18} strokeWidth={3} />
              </a>
            </MagneticButton>
            
            <MagneticButton>
              <a
                href="https://calendly.com/labibfohayer/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-white font-extrabold uppercase tracking-wide transition-colors"
              >
                BOOK A CALL
                <Calendar size={18} />
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Content - Cinematic Masked Image */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[500px] xl:h-[800px] w-full flex justify-center items-end hidden md:flex"
        >
          {/* Glowing wireframe or abstract element behind image */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_70%)] opacity-20" />
          
          <img 
            src="/profile-ceo.webp" 
            alt="Md. Labib Fohayer" 
            className="relative z-10 w-auto max-w-full h-auto max-h-[110%] object-contain object-bottom"
            style={{ 
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 98%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 98%)'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
