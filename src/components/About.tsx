"use client";

import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck, GraduationCap, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import MagneticButton from "./ui/MagneticButton";

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
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--theme-rgb),0.15), transparent 40%)`,
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6 shadow-[0_0_15px_rgba(var(--theme-rgb),0.1)]">
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
            <h3 className="text-3xl text-cyan-500 font-serif italic mb-2 drop-shadow-[0_0_10px_rgba(var(--theme-rgb),0.3)]">Driven by Passion & Resilience.</h3>
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
                    My journey into tech wasn't conventional. It was driven by pure passion and resilience—transitioning from working hard as a <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(var(--theme-rgb),0.8)] font-medium">delivery rider</span> and salesman to establishing my own tech agency, <strong className="text-cyan-400 drop-shadow-[0_0_8px_rgba(var(--theme-rgb),0.8)] text-lg">Webpulse Automation</strong>.
                  </p>
                  <p>
                    I didn't take the traditional route. By collaborating with advanced AI assistants, I've accelerated my development capabilities to architect systems that compress execution timelines. Instead of relying on slow, manual cycles, I build digital ecosystems that operate autonomously.
                  </p>
                  <p>
                    I have engineered and deployed a wide range of massive platforms from scratch. My portfolio includes the <span className="text-cyan-300 font-medium">Webpulse Automation System</span>, the complete digital transformation of <span className="text-cyan-300 font-medium">Al Madina Model Madrasa</span>, and the <span className="text-cyan-300 font-medium">Madrasa OS Platform</span>. I have also built robust applications like <span className="text-cyan-300 font-medium">BD Mess</span>, <span className="text-cyan-300 font-medium">Ponyopuri E-commerce</span>, and custom <span className="text-cyan-300 font-medium">Expense Trackers</span>—all tailored to deliver high-impact results in record time.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-[0_0_15px_rgba(var(--theme-rgb),0.2)]">
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
                className="absolute top-0 w-full h-[150px] bg-cyan-400 shadow-[0_0_15px_rgba(var(--theme-rgb),1)] z-10"
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
                    boxShadow: ["0 0 0px rgba(var(--theme-rgb),0)", "0 0 20px rgba(var(--theme-rgb),1)", "0 0 0px rgba(var(--theme-rgb),0)"],
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
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(var(--theme-rgb),0.1)]">
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
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(var(--theme-rgb),0.1)]">
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
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(var(--theme-rgb),0.1)]">
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

        {/* Wide Quote Card with Running Border */}
        <div className="mt-10 relative overflow-hidden rounded-[2rem] p-[2px] group">
          {/* Animated Running Border Background */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[500%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(var(--theme-rgb),1)_360deg)] z-0 origin-center"
          />
          
          <div className="relative z-10 w-full h-full bg-black/90 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Zap size={12} className="animate-pulse" /> CORE ENGINEERING PHILOSOPHY
              </span>
              <h4 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-wider text-white">
                "Turning ideas and resilience into <span className="text-shine drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.8)]">high-impact</span> digital solutions that eliminate operational friction and scale effortlessly."
              </h4>
            </div>
            
            <div className="shrink-0 mt-6 md:mt-0 flex flex-col items-center">
              <div className="relative">
                {/* Ripple Effect Behind Button */}
                <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-20" />
                <div className="absolute inset-0 rounded-full border border-cyan-500 animate-pulse opacity-40 delay-150" />
                
                <MagneticButton>
                  <a href="https://wa.me/8801580506445" className="relative flex items-center gap-3 px-8 py-4 bg-black border border-cyan-500/50 text-cyan-400 text-sm font-bold tracking-widest uppercase rounded-full hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_30px_rgba(var(--theme-rgb),0.6)] transition-all overflow-hidden group/btn">
                    {/* Hover Light Sweep inside button */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover/btn:scale-110 transition-transform">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    WHATSAPP
                  </a>
                </MagneticButton>
              </div>
              <span className="text-[10px] text-neutral-500 tracking-widest uppercase mt-4 block text-center">
                Direct consultation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
