"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, CheckCircle2 } from "lucide-react";
import Tilt from "react-parallax-tilt";

const projects = [
  {
    id: "01",
    title: "WEBPULSE AUTOMATION",
    role: "AGENCY PLATFORM & AUTOMATION",
    desc: "A scalable tech agency platform offering custom web development and smart workflow automations to help businesses scale effortlessly.",
    tech: ["NEXT.JS", "REACT", "TAILWIND CSS", "AUTOMATION"],
    image: "/projects/webpulse.png",
    contributions: [
      "Architected the entire agency landing page and service workflows.",
      "Integrated automated pipelines for lead generation and business scaling.",
      "Engineered ultra-fast UI with modern glassmorphism and animations."
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "02",
    title: "AL MADINA MADRASA",
    role: "INSTITUTIONAL WEBSITE & MANAGEMENT",
    desc: "Complete digital presence and automation foundation for Al Madina Model Madrasa & Research Institute.",
    tech: ["REACT", "TAILWIND", "NODE.JS", "DATABASE"],
    image: "/projects/al-madina.png",
    contributions: [
      "Built a highly responsive and fast public-facing institutional website.",
      "Set up the foundational architecture for student and staff data routing.",
      "Modernized the digital branding and online admission processes."
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "03",
    title: "MADRASA OS",
    role: "INSTITUTIONAL OPERATING SYSTEM",
    desc: "A comprehensive management dashboard for madrasas covering student tracking, attendance, fees, staff payroll, and daily operations.",
    tech: ["FULL-STACK", "DASHBOARD UI", "API ARCHITECTURE", "SECURITY"],
    image: "/projects/madrasa-os.png",
    contributions: [
      "Engineered a centralized dashboard for managing 1000+ students and staff.",
      "Automated complex fee collection, daily accounting, and attendance tracking.",
      "Built role-based access control (RBAC) for admins, teachers, and parents."
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "04",
    title: "BD MESS",
    role: "SMART LIVING & MEAL MANAGEMENT SYSTEM",
    desc: "A modern, high-craft living platform featuring automated utility splitting, meal calculation, and streamlined resident management flow.",
    tech: ["REACT 18", "TAILWIND CSS", "FIREBASE", "ALGORITHMS"],
    image: "/projects/bd-mess.jpg",
    contributions: [
      "Architected an interactive dashboard with instant metrics and state persistence.",
      "Engineered responsive visual aesthetics with fluid mobile-first UX.",
      "Optimized build pipeline and automated complex billing calculations."
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "05",
    title: "EXPENSE TRACKER",
    role: "FINANCIAL ANALYTICS & ACCOUNTING",
    desc: "Production financial tracking and analytics platform featuring daily safe limits, digital vaults, and real-time computation.",
    tech: ["NEXT.JS", "TYPESCRIPT", "REST API", "FRAMER MOTION"],
    image: "/projects/expense.jpg",
    contributions: [
      "Built resilient microservices architecture for safe expense tracking.",
      "Engineered dynamic real-time expenditure charts with category breakdown.",
      "Ensured 99.9% uptime with zero-friction database communication."
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "06",
    title: "PONYOPURI E-COMMERCE",
    role: "SCALABLE DIGITAL STOREFRONT",
    desc: "Custom high-performance storefront that handles inventory management and direct WhatsApp ordering workflows.",
    tech: ["E-COMMERCE", "NODE.JS", "PAYMENT GATEWAYS", "REACT"],
    image: "/projects/ponyopuri.png",
    contributions: [
      "Orchestrated seamless checkout flows with instant WhatsApp conversion.",
      "Created highly optimized product grids with sub-second render speeds.",
      "Compressed customer purchasing turnaround time and manual effort."
    ],
    liveUrl: "#",
    githubUrl: "#"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative z-10 bg-[black]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
              <Code2 size={12} className="text-cyan-500" /> SELECTED WORK
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
              PROJECTS THAT SOLVE <br />
              <span className="text-white">REAL PROBLEMS</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
            A selection of modern web applications, management platforms, and high-performance digital systems engineered for scale and speed.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-[2rem] overflow-hidden group flex flex-col relative bg-transparent border border-white/10 hover:border-cyan-500/30 transition-colors h-full"
            >
              
              {/* Top Image Section */}
              <div className="w-full h-64 md:h-80 relative overflow-hidden bg-black/40 border-b border-white/5">
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-widest uppercase">
                    FEATURED APP
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-20 text-4xl font-display font-bold text-cyan-500">
                  {project.id}
                </div>
                
                {project.image && (
                  <div className="absolute inset-0 z-10 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-contain object-center p-4 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[black] to-transparent opacity-80" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-cyan-500 font-bold tracking-widest text-[10px] uppercase mb-2">
                  {project.role}
                </h4>
                
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 leading-tight">
                  {project.title}
                </h3>
                
                <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                  {project.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] font-bold text-neutral-300 tracking-widest uppercase bg-transparent px-3 py-1.5 rounded-full border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="w-full h-px bg-white/10 mb-8" />

                <div className="space-y-4 mb-10">
                  <h5 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> KEY CONTRIBUTIONS
                  </h5>
                  {project.contributions.map((contribution, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {contribution}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between mt-auto">
                  <a href={project.liveUrl} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest text-[10px] uppercase transition-colors">
                    LIVE DEMO <ArrowUpRight size={14} strokeWidth={3} />
                  </a>
                  
                  <div className="flex items-center gap-3">
                    <a href={project.githubUrl} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-cyan-500/50 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                    <a href={project.liveUrl} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-cyan-500/50 transition-colors">
                      <ArrowUpRight size={16} />
                    </a>
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
