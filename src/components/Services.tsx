"use client";

import { motion } from "framer-motion";
import { Bot, Layout, Briefcase, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const services = [
  { 
    id: "01", 
    title: "AI Automation & Smart Bots", 
    desc: "Custom AI-driven chatbots, workflow automations, and intelligent data-pipelines.",
    icon: <Bot size={28} className="text-cyan-400" />,
    bgType: "AI",
    tech: ["Python", "OpenAI", "LangChain", "TensorFlow"],
    features: ["Custom LLM Chatbots", "Workflow Automation", "Data Pipeline Architecture", "API Integration"],
    stats: { value: "10X", label: "Faster Workflows" }
  },
  { 
    id: "02", 
    title: "Full-Stack Web Architecture", 
    desc: "Scalable, high-performance responsive web applications built with modern frameworks.",
    icon: <Layout size={28} className="text-cyan-400" />,
    bgType: "WEB",
    tech: ["React", "Next.js", "Node.js", "TailwindCSS"],
    features: ["Responsive UI/UX", "Scalable Backend APIs", "Database Optimization", "Secure Authentication"],
    stats: { value: "99.9%", label: "Uptime & Reliability" }
  },
  { 
    id: "03", 
    title: "Business & SaaS Tools", 
    desc: "Cloud-based utility applications automating daily accounts, billing, and resource management.",
    icon: <Briefcase size={28} className="text-cyan-400" />,
    bgType: "SAAS",
    tech: ["MongoDB", "Express", "Firebase", "PostgreSQL"],
    features: ["Custom Dashboards", "Billing & Invoicing", "Multi-tenant Architecture", "Real-time Analytics"],
    stats: { value: "100%", label: "Client Satisfaction" }
  },
  { 
    id: "04", 
    title: "E-Commerce Infrastructure", 
    desc: "End-to-end e-commerce solutions, seamless payment integrations, and inventory tracking.",
    icon: <ShoppingCart size={28} className="text-cyan-400" />,
    bgType: "ECOMMERCE",
    tech: ["Next.js", "Stripe", "Prisma", "AWS"],
    features: ["Seamless Cart Experience", "Payment Gateway Integration", "Inventory Management", "Order Tracking"],
    stats: { value: "50+", label: "Successful Deployments" }
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
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(var(--theme-rgb),1)]"
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
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--theme-rgb),0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--theme-rgb),0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
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
            CORE <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)]">CAPABILITIES</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full" />
        </motion.div>

        {/* Expandable Accordion Layout */}
        <div className="flex flex-col md:flex-row h-[900px] md:h-[550px] gap-4 w-full">
          {services.map((service, idx) => {
            const isActive = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            
            return (
              <motion.div
                layout
                key={service.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative overflow-hidden glass-card rounded-[2rem] flex flex-col p-6 md:p-8 transition-all duration-700 ease-in-out cursor-pointer border border-white/5 ${
                  isActive ? "flex-[4] md:flex-[3] border-cyan-500/50 shadow-[0_0_40px_rgba(var(--theme-rgb),0.2)] bg-cyan-950/10" 
                  : isAnyHovered ? "flex-[0.8] md:flex-[0.6] opacity-50 blur-[1px]" 
                  : "flex-1"
                }`}
              >
                <AnimatedBackground type={service.bgType} />
                
                {/* Content Wrapper */}
                <div className="relative z-10 w-full h-full flex flex-col">
                  
                  {/* Top Header */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/40 transition-colors duration-500">
                      {service.icon}
                    </div>
                    
                    {/* Vertical ID for collapsed state on desktop, or horizontal on expanded */}
                    <div className={`text-cyan-500 font-mono text-sm font-bold transition-all duration-500 ${!isActive && isAnyHovered ? "md:rotate-90 md:mt-10" : ""}`}>
                      {service.id}
                    </div>
                  </div>

                  {/* Expanded Content Details (Tech Stack, Features, Stats) */}
                  <div className={`flex flex-col justify-center transition-all duration-700 ease-in-out overflow-hidden ${isActive ? "flex-1 opacity-100 max-h-[350px] mt-6" : "flex-0 opacity-0 max-h-0 mt-0"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pr-4">
                       
                       {/* Features List */}
                       <div>
                         <h4 className="text-cyan-500 text-[10px] uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                           <div className="w-2 h-[1px] bg-cyan-500" /> KEY FEATURES
                         </h4>
                         <ul className="space-y-3">
                           {service.features.map((f, i) => (
                             <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                                <span>{f}</span>
                             </li>
                           ))}
                         </ul>
                       </div>

                       {/* Tech Stack & Stats */}
                       <div className="flex flex-col justify-between">
                         <div>
                           <h4 className="text-cyan-500 text-[10px] uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                             <div className="w-2 h-[1px] bg-cyan-500" /> TECH STACK
                           </h4>
                           <div className="flex flex-wrap gap-2">
                             {service.tech.map((t, i) => (
                               <span key={i} className="text-[10px] font-mono px-2 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 backdrop-blur-sm whitespace-nowrap">
                                 {t}
                               </span>
                             ))}
                           </div>
                         </div>
                         
                         <div className="mt-6 md:mt-0">
                           <div className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                             {service.stats.value}
                           </div>
                           <div className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                             {service.stats.label}
                           </div>
                         </div>
                       </div>
                       
                    </div>
                  </div>

                  {/* Bottom Title & Desc */}
                  <div className="mt-auto pt-6">
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
