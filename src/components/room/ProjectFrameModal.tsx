"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { playClickSound } from "@/lib/sounds";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  metrics: string;
  deliverables: string[];
  techStack: string[];
  liveUrl?: string;
}

export const ROOM_PROJECTS: ProjectData[] = [
  {
    id: "webpulse",
    title: "Webpulse Automation System",
    category: "Autonomous Multi-Agent AI Core",
    year: "2025 - Present",
    image: "/projects/webpulse.png",
    description: "Enterprise workflow automation ecosystem powered by coordinated autonomous agents. Cuts operational bottlenecks and client support friction by 70%.",
    metrics: "70% operational cost cut • 10x faster deployment pipelines",
    deliverables: ["Multi-Agent Orchestrator", "Real-Time Telemetry Dashboard", "Automated Client CRM", "FastAPI Edge Microservices"],
    techStack: ["Next.js 16", "Python", "FastAPI", "Supabase", "Docker", "Tailwind CSS"],
    liveUrl: "https://webpulsebd.com",
  },
  {
    id: "al_madina",
    title: "Al Madina Model Madrasa",
    category: "Institutional Management Platform",
    year: "2024 - 2025",
    image: "/projects/al-madina.png",
    description: "Complete digital transformation for a 1,200+ student educational institution. Fully automates student admissions, multi-tier tuition fee collections, automated SMS alerts to parents, and dynamic grading cards.",
    metrics: "1,200+ Active Students • 100% Paperless Tuition Tracking",
    deliverables: ["Student Admission Engine", "Instant Parent SMS Gateway", "Tuition Fee Reconciliation", "Result & Marksheet Generator"],
    techStack: ["Next.js", "React", "PostgreSQL", "Prisma", "Node.js", "Tailwind CSS"],
    liveUrl: "https://almadinamodelmadrasa.com",
  },
  {
    id: "madrasa_os",
    title: "Madrasa OS Platform",
    category: "Multi-Tenant Cloud SaaS Architecture",
    year: "2025",
    image: "/projects/madrasa-os.png",
    description: "Turnkey multi-tenant operating system designed for educational institutions across Bangladesh. Provides instantaneous sub-domain provisioning, role-based staff access, accounting ledger, and automated payroll.",
    metrics: "Sub-second database queries • Multi-tenant isolation architecture",
    deliverables: ["Multi-Tenant Subdomain Routing", "Role-Based Access Control", "Automated Payroll Ledger", "Parent Portal Mobile Interface"],
    techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Redis"],
    liveUrl: "https://madrasaos.vercel.app",
  },
  {
    id: "bd_mess",
    title: "BD Mess Automation",
    category: "Hostel Meal & Finance Management",
    year: "2024",
    image: "/projects/bd-mess.jpg",
    description: "Intelligent meal tracking and shared expense ledger for bachelor messes and hostels. Solves daily meal counting disputes, automates shared grocery budgeting, and calculates individual monthly bills with zero math errors.",
    metrics: "Zero accounting disputes • Instant member reconciliation",
    deliverables: ["Daily Meal Counter", "Shared Grocery Ledger", "Individual Deposit Tracking", "Automated Monthly Expense Summary"],
    techStack: ["React Native", "Next.js", "Node.js", "MongoDB", "Express"],
  },
  {
    id: "ponyopuri",
    title: "Ponyopuri E-Commerce",
    category: "High-Performance Modern Retail",
    year: "2024",
    image: "/projects/ponyopuri.png",
    description: "Blazing fast headless e-commerce store with real-time stock sync, bKash/Nagad instant payment integration, and dynamic order management dashboard.",
    metrics: "Sub-second checkout flow • Automated payment verification",
    deliverables: ["Headless Product Catalog", "MFS Payment Gateway Integration", "Inventory Management Admin", "SMS Order Confirmation"],
    techStack: ["Next.js", "Tailwind CSS", "bKash API", "Node.js", "MongoDB"],
  },
];

interface ProjectFrameModalProps {
  selectedProject: ProjectData | null;
  onClose: () => void;
  onSelectProject: (proj: ProjectData) => void;
}

export default function ProjectFrameModal({
  selectedProject,
  onClose,
  onSelectProject,
}: ProjectFrameModalProps) {
  if (!selectedProject) return null;

  const currentIdx = ROOM_PROJECTS.findIndex((p) => p.id === selectedProject.id);

  const handlePrev = () => {
    playClickSound();
    const prevIdx = (currentIdx - 1 + ROOM_PROJECTS.length) % ROOM_PROJECTS.length;
    onSelectProject(ROOM_PROJECTS[prevIdx]);
  };

  const handleNext = () => {
    playClickSound();
    const nextIdx = (currentIdx + 1) % ROOM_PROJECTS.length;
    onSelectProject(ROOM_PROJECTS[nextIdx]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0e14] border border-white/15 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-neutral-200"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Wall Gallery // Frame #{currentIdx + 1} of {ROOM_PROJECTS.length}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{selectedProject.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                title="Previous Project"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                title="Next Project"
              >
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white transition-all ml-2"
                title="Close Frame View"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Screenshot Hero */}
            <div className="relative w-full h-56 sm:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/60">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-cyan-300">
                  {selectedProject.category}
                </span>
                <span className="text-xs font-mono text-neutral-400">{selectedProject.year}</span>
              </div>
            </div>

            {/* Description & Impact Metrics */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-400">Problem & Solution Architecture</h3>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Key Deliverables */}
                <div className="pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Key Shipped Deliverables</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedProject.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                        <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics & Tech Stack Sidebar */}
              <div className="space-y-4 sm:border-l sm:border-white/10 sm:pl-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">Quantifiable Impact</h4>
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 font-medium">
                    {selectedProject.metrics}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Production Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProject.liveUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Visit Live System <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
