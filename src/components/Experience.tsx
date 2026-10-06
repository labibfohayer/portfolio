"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Diamond, ShieldCheck } from "lucide-react";

const experiences = [
  {
    role: "FOUNDER & CEO",
    company: "WEBPULSE AUTOMATION",
    date: "2024 - Present",
    title: "ARCHITECTED PROPRIETARY MULTI-AGENT SYNTHESIS ENGINE",
    description: "Built the core infrastructure for an automation agency that replaces manual workflows with autonomous AI systems.",
    bullets: [
      "Led full-stack development of enterprise web applications",
      "Engineered automated chatbots reducing response times by 90%",
      "Scaled business operations to serve multiple B2B clients"
    ]
  },
  {
    role: "AI AUTOMATION ENGINEER",
    company: "FREELANCE / CONSULTING",
    date: "2023 - Present",
    title: "DEPLOYED AUTONOMOUS WORKFLOWS FOR 10+ BUSINESSES",
    description: "Consulted and developed specialized automation scripts to compress execution timelines for startups and SMEs.",
    bullets: [
      "Integrated OpenAI/Gemini APIs into custom SaaS platforms",
      "Built automated data scraping and processing pipelines",
      "Optimized cloud deployments on Vercel and AWS"
    ]
  },
  {
    role: "LEAD DEVELOPER",
    company: "BD MESS (PRODUCT)",
    date: "2023 - 2024",
    title: "ENGINEERED A SMART MANAGEMENT PLATFORM FOR 500+ USERS",
    description: "Architected a comprehensive SaaS solution for student accommodations to manage meals, rent, and utility bills.",
    bullets: [
      "Developed complex bill splitting algorithms",
      "Implemented real-time notification systems",
      "Designed a seamless mobile-first user interface"
    ]
  },
  {
    role: "E-COMMERCE ARCHITECT",
    company: "PONYOPURI",
    date: "2022 - 2023",
    title: "BUILT AND SCALED A HIGH-CONVERSION E-COMMERCE STORE",
    description: "Developed a modern, responsive digital storefront focused on user experience and direct WhatsApp integrations.",
    bullets: [
      "Implemented 'Order via WhatsApp' to boost local sales",
      "Optimized frontend performance and SEO",
      "Managed digital marketing and product inventory"
    ]
  }
];

function ExperienceCard({ exp, idx }: { exp: typeof experiences[0], idx: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      onMouseMove={handleMouseMove}
      className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden group pb-28 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 bg-black/40"
    >
      {/* Magnetic Spotlight Hover Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 relative z-10">
        {/* Animated Glowing Badge */}
        <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#06b6d4_50%,#000000_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-cyan-950/80 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-cyan-400 backdrop-blur-3xl border border-cyan-500/20 group-hover:border-transparent transition-all duration-500">
            {exp.company}
          </span>
        </div>
        
        <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors duration-500">
          {exp.date}
        </span>
      </div>

      <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wider mb-4 leading-tight group-hover:text-cyan-300 transition-colors duration-500 relative z-10">
        {exp.title}
      </h3>
      
      <p className="text-sm text-neutral-400 mb-8 leading-relaxed relative z-10">
        {exp.description}
      </p>

      {/* Staggered Bullet Points */}
      <div className="space-y-4 mb-4 relative z-10">
        {exp.bullets.map((bullet, i) => (
          <div 
            key={i} 
            className="flex items-start gap-3 opacity-70 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="mt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rotate-45 bg-cyan-500/50 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500" />
            </div>
            <span className="text-sm text-neutral-400 group-hover:text-white transition-colors duration-500">{bullet}</span>
          </div>
        ))}
      </div>

      {/* Neon VERIFIED Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-8 py-6 border-t border-white/5 flex justify-between items-center bg-black/60 backdrop-blur-xl group-hover:bg-cyan-950/30 group-hover:border-cyan-500/20 transition-all duration-500">
        <div className="translate-y-1 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-[10px] text-neutral-500 tracking-widest uppercase block mb-1 group-hover:text-cyan-500 transition-colors">ROLE:</span>
          <span className="text-xs font-bold text-white tracking-widest uppercase group-hover:text-cyan-100 transition-colors">{exp.role}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600 group-hover:text-cyan-400 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,1)]">
          <ShieldCheck size={18} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-[10px] font-bold tracking-widest uppercase">VERIFIED</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative z-10 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6 bg-cyan-950/20">
              <Diamond size={12} className="text-cyan-500 animate-pulse" /> PROFESSIONAL MILESTONES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
              WHAT I'VE BUILT <br />
              <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">& SOLVED.</span>
            </h2>
          </motion.div>
        </div>

        {/* Laser Grid Layout Container */}
        <div className="relative mt-20">
          
          {/* Horizontal Laser Line (Spans across the middle gap) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent -translate-y-1/2 pointer-events-none z-0 overflow-hidden">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 w-[30%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              animate={{ left: ["-30%", "100%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </div>
          
          {/* Vertical Laser Line (Spans down the middle gap) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent -translate-x-1/2 pointer-events-none z-0 overflow-hidden">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
              animate={{ top: ["-30%", "100%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2 }} 
            />
          </div>

          {/* Center Intersection Hub */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 w-4 h-4 rounded-full border border-cyan-500/50 bg-black -translate-x-1/2 -translate-y-1/2 z-0 items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
          </div>

          {/* The 4 Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-8 relative z-10">
            {experiences.map((exp, idx) => (
              <ExperienceCard key={idx} exp={exp} idx={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
