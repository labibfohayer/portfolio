"use client";

import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck, GraduationCap, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function Counter({ from = 0, to, suffix = "", prefix = "", decimals = 0 }: { from?: number, to: number, suffix?: string, prefix?: string, decimals?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView && nodeRef.current) {
      animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = prefix + value.toFixed(decimals) + suffix;
          }
        },
      });
    }
  }, [from, to, inView, suffix, prefix, decimals]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
}

function HoverGlowCard({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative h-full"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
        className={`relative overflow-hidden group h-full ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.15), transparent 40%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100 z-10 border border-cyan-400/50"
          style={{
            maskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
          }}
        />
        <div className="relative z-20 h-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-32 relative bg-black">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <ShieldCheck size={12} className="text-cyan-500 animate-pulse" /> BIOGRAPHY & TARGET ARCHITECTURE
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9]">
              ABOUT MD. LABIB <br />
              <span className="text-gradient-flow">FOHAYER.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-[400px]"
          >
            <h3 className="text-3xl text-cyan-500 font-serif italic mb-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">Driven by Passion & Resilience.</h3>
            <p className="text-sm text-neutral-400">
              Specialized in engineering robust automation pipelines and high-performance web platforms that replace manual friction with resilient, self-operating intelligence.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-6 relative">
          
          {/* Main Card */}
          <div className="lg:col-span-7 h-full">
            <HoverGlowCard className="glass-card rounded-[2rem] p-8 md:p-12 flex flex-col justify-between h-full border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Background Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[120px] md:text-[160px] text-white/[0.03] pointer-events-none select-none tracking-tighter rotate-[-5deg] z-0">
                VISION
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold tracking-widest uppercase mb-6 text-white flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  THE FOUNDER'S STORY
                </h3>
                <div className="space-y-4 text-neutral-400 text-sm md:text-base leading-relaxed">
                  <p>
                    My journey into tech wasn't conventional. It was driven by pure passion and resilience—transitioning from working as a <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] font-medium">delivery rider</span> and salesman to establishing my own tech agency, <strong className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Webpulse Automation</strong>.
                  </p>
                  <p>
                    I architect intelligent automation systems designed to eliminate complexity, compress execution timelines, and multiply business potential. Instead of relying on slow, manual cycles, I build digital ecosystems that operate autonomously to deliver results in <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] font-medium">days</span>.
                  </p>
                  <p>
                    By leveraging technologies like <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] font-medium">React</span>, <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] font-medium">Python</span>, and specialized AI frameworks, my architectures automate the entire lifecycle—from e-commerce solutions (Ponyopuri) to custom management platforms (<span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] font-medium">BD Mess</span>).
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <GraduationCap className="text-cyan-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm tracking-widest uppercase mb-1">FOUNDER & CEO @ WEBPULSE</h4>
                  <p className="text-xs text-neutral-500">
                    Strong foundational expertise in full-stack architecture, automation algorithms, and building digital solutions that scale.
                  </p>
                </div>
              </div>
            </HoverGlowCard>
          </div>

          {/* Right Cards Stack with Glowing Timeline */}
          <div className="lg:col-span-5 relative">
            {/* Glowing Timeline Connector */}
            <div className="absolute left-[24px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 hidden md:block overflow-hidden">
              <motion.div 
                className="absolute top-0 w-full h-[150px] bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] z-10"
                animate={{ top: ["-50%", "150%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Pulsating Nodes */}
              {[10, 50, 90].map((top, i) => (
                <motion.div 
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 z-20"
                  style={{ top: `${top}%` }}
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,1)", "0 0 0px rgba(6,182,212,0)"],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-6 h-full md:pl-12">
              <HoverGlowCard delay={0.2} className="glass-card rounded-[2rem] p-8 flex-1 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> TARGET 01
                  </span>
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    <Counter to={10} suffix="X FASTER" />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                  <Counter to={10} suffix="X" /> EXECUTION VELOCITY
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Compressing conventional manual business processes into minutes using custom automation bots and intelligent scripts.
                </p>
              </HoverGlowCard>

              <HoverGlowCard delay={0.4} className="glass-card rounded-[2rem] p-8 flex-1 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> TARGET 02
                  </span>
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    <Counter to={70} suffix="% SAVINGS" />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                  <Counter to={70} suffix="%" /> COST COMPRESSION
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Eliminating recurring manual overhead and inefficient retainers through deterministic, automated web pipelines.
                </p>
              </HoverGlowCard>

              <HoverGlowCard delay={0.6} className="glass-card rounded-[2rem] p-8 flex-1 border-t-2 border-t-cyan-500 shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-gradient-to-br from-black to-cyan-950/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> TARGET 03
                  </span>
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    <Counter to={99.9} decimals={1} suffix="% RELIABLE" />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">PRODUCTION RESILIENCE</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Engineering strict architectures, clean React UI, and automated backends to ensure zero friction in production.
                </p>
              </HoverGlowCard>
            </div>
          </div>
        </div>

        {/* Wide Quote Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-6 glass-card rounded-[2rem] p-8 md:p-12 border border-white/5 border-l-4 border-l-cyan-500 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-shadow duration-500"
        >
          <div className="flex-1">
            <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Zap size={12} /> CORE ENGINEERING PHILOSOPHY
            </span>
            <h4 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-wider text-white">
              "Turning ideas and resilience into <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">high-impact</span> digital solutions that eliminate operational friction and scale effortlessly."
            </h4>
          </div>
          <div className="shrink-0 mt-6 md:mt-0">
            <a href="https://wa.me/8801580506445" className="px-8 py-4 bg-cyan-900/40 border border-cyan-500 text-cyan-400 text-sm font-bold tracking-widest uppercase rounded-full hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all block text-center">
              WHATSAPP
            </a>
            <span className="text-[10px] text-neutral-500 tracking-widest uppercase mt-3 block text-center">
              Direct consultation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
