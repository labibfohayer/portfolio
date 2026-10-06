"use client";

import { motion } from "framer-motion";
import { Bot, Layout, Briefcase, ShoppingCart } from "lucide-react";
import { useState } from "react";

const services = [
  { 
    id: "01", 
    title: "AI Automation & Smart Bots", 
    desc: "Custom AI-driven chatbots, workflow automations, and intelligent data-pipelines.",
    icon: <Bot size={28} className="text-cyan-400" />,
    bgType: "AI"
  },
  { 
    id: "02", 
    title: "Full-Stack Web Architecture", 
    desc: "Scalable, high-performance responsive web applications built with modern frameworks.",
    icon: <Layout size={28} className="text-cyan-400" />,
    bgType: "WEB"
  },
  { 
    id: "03", 
    title: "Business & SaaS Tools", 
    desc: "Cloud-based utility applications automating daily accounts, billing, and resource management.",
    icon: <Briefcase size={28} className="text-cyan-400" />,
    bgType: "SAAS"
  },
  { 
    id: "04", 
    title: "E-Commerce Infrastructure", 
    desc: "End-to-end e-commerce solutions, seamless payment integrations, and inventory tracking.",
    icon: <ShoppingCart size={28} className="text-cyan-400" />,
    bgType: "ECOMMERCE"
  },
];

function AnimatedBackground({ type }: { type: string }) {
  switch (type) {
    case "AI":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]"
              animate={{ 
                y: [Math.random() * 100, Math.random() * -100], 
                x: [Math.random() * 50, Math.random() * -50],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="cyan" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="cyan" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="cyan" strokeWidth="1" />
          </svg>
        </div>
      );
    case "WEB":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <motion.div 
            animate={{ y: [-100, 500] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/4 w-[2px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent" 
          />
        </div>
      );
    case "SAAS":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden flex items-end justify-center gap-6 pb-20">
          {[40, 80, 50, 100, 60].map((h, i) => (
            <motion.div 
              key={i}
              className="w-4 bg-gradient-to-t from-cyan-900 via-cyan-500/50 to-cyan-400 rounded-t-sm"
              animate={{ height: [h/2, h, h/2] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      );
    case "ECOMMERCE":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden flex gap-8 justify-center">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-[1px] h-[150px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
              animate={{ y: [-200, 600] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function Services() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="services" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
            <Bot size={12} className="text-cyan-500" /> WHAT I DO
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tighter">
            CORE <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">CAPABILITIES</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full" />
        </motion.div>

        {/* Expandable Accordion Layout */}
        <div className="flex flex-col md:flex-row h-[700px] md:h-[500px] gap-4 w-full">
          {services.map((service, idx) => {
            const isActive = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            
            return (
              <motion.div
                layout
                key={service.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative overflow-hidden glass-card rounded-[2rem] flex flex-col justify-end p-6 md:p-8 transition-all duration-700 ease-in-out cursor-pointer border border-white/5 ${
                  isActive ? "flex-[4] md:flex-[3] border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] bg-cyan-950/10" 
                  : isAnyHovered ? "flex-[0.8] md:flex-[0.5] opacity-50 blur-[1px]" 
                  : "flex-1"
                }`}
              >
                <AnimatedBackground type={service.bgType} />
                
                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col">
                  <div className="flex justify-between items-start mb-auto">
                    <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/40 transition-colors duration-500">
                      {service.icon}
                    </div>
                    
                    {/* Vertical ID for collapsed state on desktop, or horizontal on expanded */}
                    <div className={`text-cyan-500 font-mono text-sm font-bold transition-all duration-500 ${!isActive && isAnyHovered ? "md:rotate-90 md:mt-10" : ""}`}>
                      {service.id}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className={`font-bold text-white mb-2 transition-all duration-500 ${isActive || !isAnyHovered ? "text-xl md:text-2xl" : "text-sm md:-rotate-90 md:-translate-y-20 md:whitespace-nowrap md:origin-left"}`}>
                      {service.title}
                    </h3>
                    <div 
                      className={`overflow-hidden transition-all duration-700 ease-in-out ${isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0 md:max-h-40 md:opacity-100"}`}
                    >
                      <p className={`text-neutral-400 leading-relaxed ${isActive ? "text-base" : "text-sm line-clamp-3"}`}>
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
