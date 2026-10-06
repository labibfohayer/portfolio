"use client";

import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";
import { useEffect, useRef } from "react";

function Counter({ from = 0, to, suffix = "", prefix = "" }: { from?: number, to: number, suffix?: string, prefix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView && nodeRef.current) {
      animate(from, to, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = prefix + Math.round(value) + suffix;
          }
        },
      });
    }
  }, [from, to, inView, suffix, prefix]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen pt-24 overflow-hidden flex flex-col justify-between">
      {/* Sci-Fi Background Effects */}
      <div className="absolute inset-0 bg-[black] -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/5 via-[black] to-[black] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid xl:grid-cols-2 gap-12 items-center flex-grow pt-10 pb-20">
        
        {/* Left Content */}
        <div className="space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 text-xs md:text-[10px] font-bold tracking-widest text-neutral-300 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            BUILDING AUTONOMOUS AI & MODERN SYSTEMS
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            HELLO, I AM
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display font-bold leading-[1.1] tracking-tight uppercase"
          >
            <h1 className="text-[12vw] xl:text-[6.5rem] text-white">
              MD LABIB
            </h1>
            <h1 className="text-[12vw] xl:text-[6.5rem]">
              <span className="text-white">FOHAY</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500">ER</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <h2 className="text-xl md:text-2xl font-bold text-cyan-500 uppercase tracking-widest mb-2">
              FULL-STACK AI DEVELOPER<span className="animate-pulse">|</span>
            </h2>
            
            <h3 className="text-2xl md:text-3xl italic text-neutral-300 font-serif mb-6">
              Built for Scale & Precision.
            </h3>
            
            <p className="text-sm md:text-base text-neutral-400 max-w-xl leading-relaxed">
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
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cyan-500 text-black font-extrabold uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400"
              >
                VIEW MY WORK
                <ArrowRight size={16} strokeWidth={3} />
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Content - Image with Glow */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[400px] xl:h-[600px] w-full flex flex-col justify-center items-center md:items-end mt-12 md:mt-0"
        >
          {/* Glowing Aura behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full z-0" />
          
          <img 
            src="/profile-transparent.png" 
            alt="Md. Labib Fohayer" 
            className="relative z-10 w-auto h-full object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          />
          
          {/* Signature Image */}
          <div className="relative z-20 -mt-10 mr-10 font-signature text-5xl md:text-6xl text-white/90 rotate-[-5deg]">
            Labib Fohayer
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats Section */}
      <div className="w-full border-t border-white/10 bg-black py-8 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col items-center justify-center">
            <h4 className="text-3xl md:text-4xl font-display font-bold text-shine mb-1 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Counter to={10} suffix="X+" />
            </h4>
            <p className="text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase mb-2">EXECUTION VELOCITY</p>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col items-center justify-center">
            <h4 className="text-3xl md:text-4xl font-display font-bold text-shine mb-1 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Counter to={70} suffix="%+" />
            </h4>
            <p className="text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase mb-2">COST COMPRESSION</p>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col items-center justify-center">
            <h4 className="text-3xl md:text-4xl font-display font-bold text-shine mb-1 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Counter to={24} suffix="/7" />
            </h4>
            <p className="text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase mb-2">AUTONOMOUS WORKFLOWS</p>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col items-center justify-center">
            <h4 className="text-3xl md:text-4xl font-display font-bold text-shine mb-1 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Counter to={100} suffix="%" />
            </h4>
            <p className="text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase mb-2">PRODUCTION RESILIENCE</p>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
