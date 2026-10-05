"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Layout, Code2, Sparkles } from "lucide-react";
import Tilt from "react-parallax-tilt";

const projects = [
  {
    id: "01",
    title: "BD Mess Dashboard",
    role: "Smart Living & Meal Management System",
    desc: "Streamlines shared apartment accounts, automated utility splitting, daily meal tracking, and maid attendance. Replaces chaotic manual calculation with a seamless digital experience.",
    tech: ["React", "Tailwind CSS", "Firebase", "Algorithms"],
    image: "/projects/bd-mess.jpg"
  },
  {
    id: "02",
    title: "Advanced Expense Tracker",
    role: "Intelligent Financial Accounting",
    desc: "A high-speed tracking solution featuring daily safe limits, digital clay bank, major expense vaults, voice dictation, and automated bill splitting algorithms.",
    tech: ["Next.js", "TypeScript", "REST API", "Framer Motion"],
    image: "/projects/expense.jpg"
  },
  {
    id: "03",
    title: "Ponyopuri",
    role: "Modern E-Commerce Storefront",
    desc: "Engineered a customer-first storefront with scalable inventory management, custom WhatsApp direct ordering flows, and lightning-fast product grid performance.",
    tech: ["React", "E-Commerce Architecture", "Node.js", "Payment Gateways"],
    image: "/projects/ponyopuri.png"
  },
  {
    id: "04",
    title: "Webpulse AI Bots",
    role: "Autonomous Customer Support",
    desc: "24/7 intelligent business automation bots integrated into SaaS and WhatsApp APIs. Capable of autonomously converting leads into paying clients without human intervention.",
    tech: ["Python", "OpenAI/Gemini", "Automation Pipelines", "Webhooks"],
    image: null
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative z-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
            <Code2 size={12} className="text-cyan-500" /> PRODUCTION DEPLOYMENTS
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
            PROJECTS THAT SOLVE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">REAL PROBLEMS.</span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[2rem] overflow-hidden group flex flex-col md:flex-row relative"
            >
              {/* Massive Number Watermark */}
              <div className="absolute -top-10 -right-4 text-[12rem] md:text-[18rem] font-display font-bold text-white/[0.02] leading-none pointer-events-none select-none z-0">
                {project.id}
              </div>

              {/* Image/Visual Area */}
              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-8 flex items-center justify-center">
                {project.image ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-colors shadow-2xl">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-50" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl border border-white/10 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 to-black group-hover:border-cyan-500/30 transition-colors">
                    <Sparkles size={48} className="text-cyan-500/50" />
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="w-full md:w-7/12 p-8 md:p-12 relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wider">
                      {project.title}
                    </h3>
                  </div>
                  
                  <h4 className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-6">
                    // {project.role}
                  </h4>
                  
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-xl">
                    {project.desc}
                  </p>
                </div>
                
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mb-3">TECHNOLOGY STACK</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-bold text-white tracking-widest uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
