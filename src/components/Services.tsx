"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  Bot, 
  Layout, 
  Briefcase, 
  ShoppingCart, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Zap,
  Activity,
  Cpu
} from "lucide-react";

const services = [
  { 
    id: "01", 
    category: "AUTONOMOUS AGENTS",
    title: "AI Automation & Smart Bots", 
    desc: "Custom AI-driven chatbots, workflow automations, and intelligent data-pipelines engineered for 24/7 autonomous operations.",
    icon: <Bot size={24} className="text-cyan-400" />,
    bgType: "AI",
    tech: ["Python", "OpenAI", "LangChain", "TensorFlow"],
    features: ["Custom LLM Chatbots", "Workflow Automation", "Data Pipeline Architecture", "API Integration"],
    stats: { value: "10X", label: "Faster Workflows", capacity: 96 },
    status: "SYSTEM OPERATIONAL"
  },
  { 
    id: "02", 
    category: "NEXT-GEN FULLSTACK",
    title: "Full-Stack Web Architecture", 
    desc: "Scalable, high-performance responsive web applications built with modern frameworks and sub-second render pipelines.",
    icon: <Layout size={24} className="text-cyan-400" />,
    bgType: "WEB",
    tech: ["React", "Next.js", "Node.js", "TailwindCSS"],
    features: ["Responsive UI/UX", "Scalable Backend APIs", "Database Optimization", "Secure Authentication"],
    stats: { value: "99.9%", label: "Uptime & Reliability", capacity: 99 },
    status: "PRODUCTION ACTIVE"
  },
  { 
    id: "03", 
    category: "CLOUD ENTERPRISE",
    title: "Business & SaaS Tools", 
    desc: "Cloud-based utility applications automating daily accounts, billing, resource management, and multi-tenant architectures.",
    icon: <Briefcase size={24} className="text-cyan-400" />,
    bgType: "SAAS",
    tech: ["MongoDB", "Express", "Firebase", "PostgreSQL"],
    features: ["Custom Dashboards", "Billing & Invoicing", "Multi-tenant Architecture", "Real-time Analytics"],
    stats: { value: "100%", label: "Client Satisfaction", capacity: 94 },
    status: "ENGINE ONLINE"
  },
  { 
    id: "04", 
    category: "COMMERCE INFRA",
    title: "E-Commerce Infrastructure", 
    desc: "End-to-end e-commerce solutions, high-converting product grids, and instant WhatsApp conversion checkout funnels.",
    icon: <ShoppingCart size={24} className="text-cyan-400" />,
    bgType: "ECOMMERCE",
    tech: ["Next.js", "Stripe", "Prisma", "AWS"],
    features: ["Seamless Cart Experience", "Payment Gateway Integration", "Inventory Management", "Order Tracking"],
    stats: { value: "50+", label: "Successful Deployments", capacity: 92 },
    status: "READY FOR SCALE"
  },
];

function AnimatedBackground({ type }: { type: string }) {
  switch (type) {
    case "AI":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(var(--theme-rgb),1)]"
              animate={{ 
                y: [Math.random() * 80, Math.random() * -80], 
                x: [Math.random() * 40, Math.random() * -40],
                opacity: [0.2, 0.9, 0.2]
              }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
              style={{ top: `${15 + i * 15}%`, left: `${20 + i * 12}%` }}
            />
          ))}
        </div>
      );
    case "WEB":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--theme-rgb),0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--theme-rgb),0.07)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div 
            animate={{ y: [-80, 400] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/3 w-[1px] h-[80px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent" 
          />
        </div>
      );
    case "SAAS":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden flex items-end justify-center gap-4 pb-12">
          {[35, 60, 45, 75, 50].map((h, i) => (
            <motion.div 
              key={i}
              className="w-2.5 bg-gradient-to-t from-cyan-900/40 via-cyan-500/30 to-cyan-400/50 rounded-t-sm"
              animate={{ height: [h/2, h, h/2] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      );
    case "ECOMMERCE":
      return (
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden flex gap-6 justify-center">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-[1px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
              animate={{ y: [-100, 450] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

function ServiceCard({ service, idx }: { service: typeof services[0]; idx: number }) {
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
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between h-full bg-[#070b0e]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(var(--theme-rgb),0.18)] backdrop-blur-xl overflow-hidden"
    >
      {/* Interactive Radial Spotlight Hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[1.75rem] sm:rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--theme-rgb), 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* Subtle Background Animation */}
      <AnimatedBackground type={service.bgType} />

      {/* Content Container (flex-col justify-between h-full ensures zero empty void) */}
      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        
        {/* Top Header Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 group-hover:border-cyan-500/40 group-hover:bg-cyan-950/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-inner">
              {service.icon}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                {service.category}
              </span>
              <span className="text-cyan-500/50 group-hover:text-cyan-400 font-mono text-sm font-bold transition-colors">
                #{service.id}
              </span>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {service.desc}
          </p>
        </div>

        {/* Middle Deliverables Checklist */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
            <Sparkles size={11} className="text-cyan-400" /> CORE DELIVERABLES
          </div>
          {service.features.map((feature, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2 text-xs text-neutral-300">
              <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
              <span className="leading-tight">{feature}</span>
            </div>
          ))}
        </div>

        {/* Bottom Enriched Area (Eliminates Empty Space completely) */}
        <div className="pt-5 border-t border-white/10 space-y-4 mt-auto">
          
          {/* Sub-Feature Pill Group / Tech Stack */}
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
              FRAMEWORKS & APIS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {service.tech.map((t, tIdx) => (
                <span 
                  key={tIdx} 
                  className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-cyan-300/80 group-hover:border-cyan-500/30 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Workflow Capacity / Micro Metric Bar */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-3 group-hover:border-cyan-500/20 transition-colors">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                {service.stats.label}
              </span>
              <span className="text-base font-bold font-mono text-white text-cyan-300">
                {service.stats.value}
              </span>
            </div>
            {/* Visual Capacity Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: `${service.stats.capacity}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Interactive Bottom Status Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                {service.status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
              <span>EXPLORE</span>
              <ArrowRight size={12} />
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 md:py-32 relative z-10 bg-black overflow-hidden w-full max-w-full">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 bg-cyan-950/20 backdrop-blur-md">
            <Bot size={12} className="text-cyan-400" /> ARCHITECTURAL COMPETENCIES
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
            CORE <span className="text-cyan-500 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">CAPABILITIES</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mt-4 leading-relaxed">
            Enterprise-grade web systems, autonomous LLM agent networks, and resilient cloud architectures built with precision and zero technical debt.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full mt-6" />
        </motion.div>

        {/* Core Capabilities 4-Column SaaS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
          {services.map((service, idx) => (
            <ServiceCard key={service.id} service={service} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
