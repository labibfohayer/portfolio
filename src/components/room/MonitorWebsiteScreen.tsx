"use client";

import { useState, useRef } from "react";
import { 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Code2, 
  Database, 
  Terminal, 
  Sparkles, 
  Send, 
  Phone, 
  Mail, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Award,
  Lock,
  RotateCw,
  Search,
  MessageSquare
} from "lucide-react";

interface MonitorWebsiteScreenProps {
  onHoverScreen?: (isHovered: boolean) => void;
  isZoomed?: boolean;
  onZoomToDesk?: () => void;
}

export default function MonitorWebsiteScreen({ onHoverScreen, isZoomed = false, onZoomToDesk }: MonitorWebsiteScreenProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "projects" | "skills" | "story" | "contact">("hero");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Autonomous AI Engine",
    message: ""
  });

  const scrollToSection = (id: string) => {
    setActiveTab(id as any);
    if (!scrollContainerRef.current) return;
    const target = scrollContainerRef.current.querySelector(`#${id}`) as HTMLElement;
    if (target) {
      const topOffset = target.offsetTop - 65;
      scrollContainerRef.current.scrollTo({
        top: Math.max(0, topOffset),
        behavior: "smooth"
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isZoomed && onZoomToDesk) {
      e.stopPropagation();
      onZoomToDesk();
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onClick={handleClick}
      className={`w-[1160px] h-[685px] overflow-y-auto overflow-x-hidden rounded-md bg-[#080b12] text-neutral-100 select-none font-sans relative border border-white/10 shadow-2xl monitor-scrollbar ${
        !isZoomed ? "cursor-pointer" : ""
      }`}
      onPointerEnter={() => onHoverScreen?.(true)}
      onPointerLeave={() => onHoverScreen?.(false)}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Click-to-Zoom Overlay for Overview Mode */}
      {!isZoomed && (
        <div className="absolute inset-0 z-50 bg-black/40 hover:bg-black/20 transition-all flex items-center justify-center pointer-events-auto">
          <div className="px-6 py-3 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black font-mono font-bold text-sm shadow-2xl flex items-center gap-2 transform hover:scale-105 transition-all">
            <span>Explore Workstation & Portfolio</span>
            <ChevronRight size={16} />
          </div>
        </div>
      )}
      {/* =========================================================================
          1. BROWSER CHROME HEADER (Sticky Top Bar)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0d121f]/95 backdrop-blur-xl border-b border-white/10 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Traffic Light Controls & Tab */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            </div>

            {/* Browser Active Tab */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-t-lg bg-[#080b12] border-t border-x border-white/10 text-xs font-mono text-cyan-300">
              <Globe size={13} className="text-cyan-400 animate-spin-slow" />
              <span>Md. Labib Fohayer — Portfolio</span>
            </div>
          </div>

          {/* Browser Omnibar URL */}
          <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080b12] border border-white/10 text-xs text-neutral-300 font-mono">
            <Lock size={12} className="text-emerald-400" />
            <span className="text-emerald-400">https://</span>
            <span className="text-white">labibfohayer.com</span>
            <span className="text-neutral-500 text-[10px] ml-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Quick-Jump Navigation Pills */}
          <nav className="flex items-center gap-1">
            {[
              { id: "hero", label: "Hero" },
              { id: "about", label: "About" },
              { id: "projects", label: "Projects" },
              { id: "skills", label: "Skills" },
              { id: "story", label: "Story" },
              { id: "contact", label: "Contact" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  scrollToSection(tab.id);
                }}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section id="hero" className="p-8 sm:p-12 relative overflow-hidden border-b border-white/10">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR HIGH-IMPACT PLATFORM ARCHITECTURE</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Md. Labib Fohayer
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-cyan-400 mb-4">
            Founder & Chairman @ Webpulse Automation • Founder @ Ponyopuri • Full-Stack Systems Engineer
          </p>
          <p className="text-neutral-300 text-base leading-relaxed max-w-3xl mb-8">
            Architecting autonomous AI swarms, mission-critical institutional SaaS platforms, and high-throughput e-commerce engines. Eliminating manual operational bottlenecks through intelligent systems and zero-friction software.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={() => scrollToSection("projects")}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>Explore Shipped Platforms</span>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scrollToSection("story")}
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10 flex items-center gap-2"
            >
              <span>Read Founder Journey</span>
              <Award size={16} className="text-amber-400" />
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-5 py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-sm transition-all border border-emerald-500/30 flex items-center gap-2"
            >
              <span>Instant Hotline</span>
              <Phone size={16} className="text-emerald-400" />
            </button>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div>
              <div className="text-2xl font-bold font-mono text-white">5+</div>
              <div className="text-xs text-neutral-400">Shipped Platforms</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-cyan-400">1,200+</div>
              <div className="text-xs text-neutral-400">Managed Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">99.99%</div>
              <div className="text-xs text-neutral-400">Uptime Architecture</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">10x</div>
              <div className="text-xs text-neutral-400">Business Velocity</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ABOUT SECTION
          ========================================================================= */}
      <section id="about" className="p-8 sm:p-12 border-b border-white/10 bg-[#090d16]/70">
        <div className="max-w-4xl">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">// PHILOSOPHY & CAPABILITIES</div>
          <h2 className="text-3xl font-bold text-white mb-6">Building Systems That Create Economic Leverage</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all">
              <Cpu className="text-cyan-400 mb-3" size={28} />
              <h3 className="font-bold text-white text-base mb-2">Autonomous AI Swarms</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Orchestrating multi-agent LLM systems that execute multi-step research, automated workflows, and complex business pipelines autonomously.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-all">
              <ShieldCheck className="text-emerald-400 mb-3" size={28} />
              <h3 className="font-bold text-white text-base mb-2">Institutional SaaS Platforms</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Engineered robust multi-tenant platforms powering institutions with 1,200+ students, dynamic billing, and instantaneous SMS telemetry.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all">
              <TrendingUp className="text-amber-400 mb-3" size={28} />
              <h3 className="font-bold text-white text-base mb-2">High-Velocity E-Commerce</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Owner of Ponyopuri. Built sub-second headless storefronts integrated with real-time stock sync and automated bKash/Nagad checkout gateways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED PROJECTS SECTION
          ========================================================================= */}
      <section id="projects" className="p-8 sm:p-12 border-b border-white/10">
        <div className="max-w-5xl">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">// SHIPPED ARCHITECTURE</div>
          <h2 className="text-3xl font-bold text-white mb-2">Production Platforms & Live Case Studies</h2>
          <p className="text-neutral-400 text-sm mb-8">
            Every platform is deployed in real-world production, driving daily revenue and business operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project 1: Webpulse */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[11px] border border-cyan-500/30">
                  FLAGSHIP CORE
                </span>
                <span className="text-xs font-mono text-neutral-400">2026 • AI ENGINE</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                Webpulse Automation System
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed mb-4">
                Autonomous multi-agent workflow coordinator that automates complex enterprise tasks, eliminates human bottleneck friction, and delivers 10x throughput.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Next.js 16", "TypeScript", "Node.js", "Python", "Redis", "Multi-Agent AI"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={13} /> 12ms Response Latency
                </span>
                <span className="text-cyan-400 flex items-center gap-1 font-mono group-hover:translate-x-1 transition-transform">
                  Live Swarm Active <ExternalLink size={12} />
                </span>
              </div>
            </div>

            {/* Project 2: Al Madina Madrasa */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
                  ENTERPRISE ERP
                </span>
                <span className="text-xs font-mono text-neutral-400">2025 • INSTITUTIONAL</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                Al Madina Model Madrasa ERP
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed mb-4">
                Comprehensive digital institutional platform managing 1,200+ students with automated fee accounting, dynamic result cards, and parent SMS gateway.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["React", "Tailwind", "Node.js", "Express", "MongoDB", "SMS Gateway"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={13} /> 1,200+ Active Students
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono group-hover:translate-x-1 transition-transform">
                  Production ERP <ExternalLink size={12} />
                </span>
              </div>
            </div>

            {/* Project 3: Ponyopuri */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[11px] border border-amber-500/30">
                  FOUNDER VENTURE
                </span>
                <span className="text-xs font-mono text-neutral-400">2025 • E-COMMERCE</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                Ponyopuri E-Commerce Store
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed mb-4">
                High-performance online shopping ecosystem with sub-second headless checkout, real-time automated stock management, and seamless bKash/Nagad checkout.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Next.js 16", "PostgreSQL", "Tailwind CSS", "bKash API", "Nagad Gateway"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={13} /> 99.98% Transaction Rate
                </span>
                <span className="text-amber-400 flex items-center gap-1 font-mono group-hover:translate-x-1 transition-transform">
                  ponyopuri.com <ExternalLink size={12} />
                </span>
              </div>
            </div>

            {/* Project 4: BD Mess */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-mono text-[11px] border border-purple-500/30">
                  COMMUNITY UTILITY
                </span>
                <span className="text-xs font-mono text-neutral-400">2024 • CROSS-PLATFORM</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                BD Mess Automation Platform
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed mb-4">
                Automated bachelor mess meal counter and multi-user utility accounts ledger, eliminating manual disputes through daily automated audits.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["React Native", "TypeScript", "Node.js", "Express", "SQLite / Postgres"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={13} /> Zero Accounting Disputes
                </span>
                <span className="text-purple-400 flex items-center gap-1 font-mono group-hover:translate-x-1 transition-transform">
                  Active Community <ExternalLink size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SKILLS & ARCHITECTURE SECTION
          ========================================================================= */}
      <section id="skills" className="p-8 sm:p-12 border-b border-white/10 bg-[#090d16]/70">
        <div className="max-w-4xl">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">// TECHNICAL PROFICIENCY</div>
          <h2 className="text-3xl font-bold text-white mb-6">Engineered for Scalability & Speed</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-cyan-400 font-mono font-bold text-xs uppercase mb-3 flex items-center gap-2">
                <Code2 size={16} /> Frontend & 3D
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2"><span>•</span> Next.js 16 (App Router)</li>
                <li className="flex items-center gap-2"><span>•</span> React 19 & TypeScript</li>
                <li className="flex items-center gap-2"><span>•</span> Three.js & R3F (Fiber)</li>
                <li className="flex items-center gap-2"><span>•</span> Tailwind CSS & GSAP</li>
                <li className="flex items-center gap-2"><span>•</span> Framer Motion & Drei</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-purple-400 font-mono font-bold text-xs uppercase mb-3 flex items-center gap-2">
                <Sparkles size={16} /> AI & Automation
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2"><span>•</span> Multi-Agent Swarms</li>
                <li className="flex items-center gap-2"><span>•</span> Gemini & OpenAI APIs</li>
                <li className="flex items-center gap-2"><span>•</span> n8n & Automated Flows</li>
                <li className="flex items-center gap-2"><span>•</span> Headless Web Crawlers</li>
                <li className="flex items-center gap-2"><span>•</span> Prompt Architecture</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-emerald-400 font-mono font-bold text-xs uppercase mb-3 flex items-center gap-2">
                <Database size={16} /> Backend & DB
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2"><span>•</span> Node.js & Bun Runtime</li>
                <li className="flex items-center gap-2"><span>•</span> Python & FastAPI</li>
                <li className="flex items-center gap-2"><span>•</span> PostgreSQL & Prisma</li>
                <li className="flex items-center gap-2"><span>•</span> MongoDB & Redis</li>
                <li className="flex items-center gap-2"><span>•</span> REST & WebSockets</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-amber-400 font-mono font-bold text-xs uppercase mb-3 flex items-center gap-2">
                <Terminal size={16} /> DevOps & Cloud
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2"><span>•</span> Docker & Linux VPS</li>
                <li className="flex items-center gap-2"><span>•</span> Nginx Reverse Proxy</li>
                <li className="flex items-center gap-2"><span>•</span> CI/CD Automated Deploy</li>
                <li className="flex items-center gap-2"><span>•</span> Cloudflare Security</li>
                <li className="flex items-center gap-2"><span>•</span> Telemetry & Logging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ORIGIN STORY SECTION
          ========================================================================= */}
      <section id="story" className="p-8 sm:p-12 border-b border-white/10 relative">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
            <Award size={13} />
            <span>AUTHENTIC FOUNDER ORIGIN</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">From Delivery Rider to Tech Founder</h2>

          <div className="space-y-4 text-neutral-300 text-sm leading-relaxed mb-6">
            <p>
              Before founding Webpulse Automation and shipping platforms serving thousands of daily users, my office was the congested streets of Dhaka. Armed with a motorcycle helmet and a delivery bag, I worked rigorous delivery shifts to fund my life and education.
            </p>
            <p>
              When night fell and the delivery bag was put away, the computer screen turned on. Between exhaustion and determination, I taught myself modern distributed systems, TypeScript, algorithmic thinking, and cloud architecture until 4:00 AM every night.
            </p>
            <p className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 italic font-mono text-xs">
              &quot;The road taught me that true stamina cannot be faked; the terminal proved that with relentless focus, code can rewrite any destiny.&quot;
            </p>
            <p>
              Today, the biker helmet and delivery bag rest proudly on the shelf of my studio loft—a permanent reminder that perseverance, discipline, and uncompromising engineering outlast all obstacles.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CONTACT SECTION
          ========================================================================= */}
      <section id="contact" className="p-8 sm:p-12 bg-[#090d16]">
        <div className="max-w-4xl">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">// DIRECT HOTLINE</div>
          <h2 className="text-3xl font-bold text-white mb-2">Let&apos;s Build Something Extraordinary</h2>
          <p className="text-neutral-400 text-sm mb-8">
            Need an autonomous AI pipeline, high-scale web platform, or mission-critical enterprise software? Send a message directly to my inbox or reach out on WhatsApp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Working Contact Form */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <CheckCircle2 size={36} className="text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-bold text-white text-base mb-1">Message Received!</h3>
                  <p className="text-neutral-300 text-xs mb-4">
                    Thank you, {formData.name}. I will review your requirements and reply to {formData.email} within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: "", email: "", projectType: "Autonomous AI Engine", message: "" });
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b12] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b12] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Project Scope</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b12] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option>Autonomous AI Engine</option>
                      <option>Custom Web SaaS Platform</option>
                      <option>High-Scale E-Commerce Store</option>
                      <option>Technical Advisory & Consulting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Project Details</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what you want to build or automate..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080b12] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    <span>Transmit Message</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>

            {/* Direct Connect & Socials */}
            <div className="space-y-4">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-4 transition-all block group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm group-hover:text-emerald-300 transition-colors">
                    WhatsApp Direct Hotline
                  </div>
                  <div className="text-xs text-neutral-400">Available 24/7 for urgent consultations</div>
                </div>
              </a>

              <a
                href="mailto:labibfohayer@gmail.com"
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 flex items-center gap-4 transition-all block group"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm group-hover:text-cyan-300 transition-colors">
                    Email Inquiry
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">labibfohayer@gmail.com</div>
                </div>
              </a>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="text-xs font-mono text-neutral-400 mb-2">LOCATION & TIMEZONE</div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dhaka, Bangladesh (UTC+6) • Global Remote Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Inside Screen */}
      <footer className="p-6 border-t border-white/10 text-center text-xs font-mono text-neutral-500 bg-[#06080d]">
        © 2026 Md. Labib Fohayer. Webpulse Automation Systems. All rights reserved.
      </footer>
    </div>
  );
}
