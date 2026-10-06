"use client";

import { motion } from "framer-motion";
import { Bot, Layout, Briefcase, ShoppingCart } from "lucide-react";
import { useState } from "react";

const services = [
  { 
    id: "01", 
    title: "AI Automation & Smart Bots", 
    desc: "Custom AI-driven chatbots, workflow automations, and intelligent data-pipelines tailored for businesses.",
    icon: <Bot size={32} className="text-cyan-400" />
  },
  { 
    id: "02", 
    title: "Full-Stack Web Architecture", 
    desc: "Scalable, high-performance responsive web applications built with modern frontend frameworks and clean APIs.",
    icon: <Layout size={32} className="text-cyan-400" />
  },
  { 
    id: "03", 
    title: "Business & SaaS Management Tools", 
    desc: "Cloud-based utility applications automating daily accounts, billing, and resource management.",
    icon: <Briefcase size={32} className="text-cyan-400" />
  },
  { 
    id: "04", 
    title: "E-Commerce & Digital Infrastructure", 
    desc: "End-to-end e-commerce solutions, seamless payment integrations, inventory tracking, and client-centric UX.",
    icon: <ShoppingCart size={32} className="text-cyan-400" />
  },
];

function HoverServiceCard({ service, idx }: { service: any, idx: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90, y: 40 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: idx * 0.15, type: "spring", bounce: 0.4 }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <div
        className="group relative h-full glass-card p-10 rounded-[2rem] cursor-default border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Mouse Tracking Spotlight */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.15), transparent 40%)`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500">
              {service.icon}
            </div>
            <div className="text-cyan-500 font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <span className="w-4 h-[1px] bg-cyan-500/50 block group-hover:w-8 transition-all" /> 
              {service.id}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all">
            {service.title}
          </h3>
          <p className="text-neutral-400 text-lg leading-relaxed mt-auto">
            {service.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
            <Bot size={12} className="text-cyan-500" /> WHAT I DO
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tighter">
            CORE <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">CAPABILITIES</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <HoverServiceCard key={service.id} service={service} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
