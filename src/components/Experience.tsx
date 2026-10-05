"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Diamond, ShieldCheck } from "lucide-react";

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

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
              <Diamond size={12} className="text-cyan-500" /> PROFESSIONAL MILESTONES
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
              WHAT I'VE BUILT <br />
              <span className="text-cyan-500">& SOLVED.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden group pb-28"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-cyan-500/10 transition-colors" />

              <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                  {exp.company}
                </span>
                <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">
                  {exp.date}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wider mb-4 leading-tight">
                {exp.title}
              </h3>
              
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                {exp.description}
              </p>

              <div className="space-y-3 mb-4">
                {exp.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 shrink-0">
                      <div className="w-1.5 h-1.5 rotate-45 bg-cyan-500" />
                    </div>
                    <span className="text-sm text-neutral-300">{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-8 py-6 border-t border-white/5 flex justify-between items-center bg-black/20">
                <div>
                  <span className="text-[10px] text-neutral-500 tracking-widest uppercase block mb-1">ROLE:</span>
                  <span className="text-xs font-bold text-white tracking-widest uppercase">{exp.role}</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">VERIFIED</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
