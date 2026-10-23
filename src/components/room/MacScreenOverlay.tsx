"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Bot, 
  Cpu, 
  Layers, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Loader2, 
  ExternalLink,
  Code2,
  Database,
  Cloud,
  CheckCircle2
} from "lucide-react";
import { playClickSound } from "@/lib/sounds";

interface MacScreenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateStage: (stage: "overview" | "desk" | "projects" | "shelf" | "contact") => void;
}

export default function MacScreenOverlay({ isOpen, onClose, onNavigateStage }: MacScreenOverlayProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "ai" | "skills" | "projects">("terminal");

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode }>>([
    { 
      cmd: "whoami", 
      output: "Md. Labib Fohayer — Founder & Chairman @ Webpulse Automation. AI Systems Architect & Full-Stack Engineer." 
    },
    {
      cmd: "welcome",
      output: "Type 'help' to see available commands, or click any quick command below."
    }
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Chatbot state
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Hello! I am Labib's Studio AI Assistant running on Mac mini M4. Ask me about Labib's projects, tech stack, or engineering philosophy!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (activeTab === "ai") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory, messages, activeTab]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = terminalInput.trim().toLowerCase();
    if (!cleanCmd) return;

    playClickSound();
    let response: string | React.ReactNode = "";

    switch (cleanCmd) {
      case "help":
        response = (
          <div className="space-y-1 text-xs text-neutral-300">
            <p><span className="text-cyan-400 font-bold">whoami</span> - Display founder identity & credentials</p>
            <p><span className="text-cyan-400 font-bold">skills</span> - List primary programming languages & tools</p>
            <p><span className="text-cyan-400 font-bold">projects</span> - View shipped platforms & switch camera to Wall Gallery</p>
            <p><span className="text-cyan-400 font-bold">story</span> - Read origin journey (Delivery Rider to Tech Founder)</p>
            <p><span className="text-cyan-400 font-bold">contact</span> - Open direct WhatsApp & email hotline</p>
            <p><span className="text-cyan-400 font-bold">clear</span> - Clear terminal screen</p>
          </div>
        );
        break;
      case "whoami":
        response = "Md. Labib Fohayer — Founder & Chairman @ Webpulse Automation. Self-taught software architect specializing in autonomous AI pipelines and enterprise platforms.";
        break;
      case "skills":
        response = "Full-Stack: Next.js 16, React 19, TypeScript, Python, Fastify, Supabase, PostgreSQL, Docker, Three.js, GSAP, Tailwind CSS.";
        break;
      case "projects":
        response = "Switching 3D camera to Wall of Projects Gallery...";
        setTimeout(() => {
          onClose();
          onNavigateStage("projects");
        }, 1200);
        break;
      case "story":
        response = "Switching 3D camera to The Origin Shelf...";
        setTimeout(() => {
          onClose();
          onNavigateStage("shelf");
        }, 1200);
        break;
      case "contact":
        response = "Switching 3D camera to Smartphone Hotline...";
        setTimeout(() => {
          onClose();
          onNavigateStage("contact");
        }, 1200);
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        response = `Command not recognized: '${cleanCmd}'. Type 'help' for available commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd: terminalInput, output: response }]);
    setTerminalInput("");
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsg = chatInput.trim();
    if (!userMsg || isChatLoading) return;

    playClickSound();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Labib specializes in Autonomous AI Agents, Next.js Full-Stack platforms, and enterprise automation. Feel free to connect directly via WhatsApp!" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I'm currently running in offline studio mode. You can directly WhatsApp Labib at +8801580506445!" },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-[85vh] max-h-[680px] bg-[#0c1017] border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-neutral-200 font-sans"
        >
          {/* macOS Title Bar */}
          <div className="h-11 bg-[#161b22] border-b border-white/10 px-4 flex items-center justify-between select-none">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center text-black/60 group"
                title="Close"
              >
                <X size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center text-black/60 group"
                title="Minimize"
              >
                <Minimize2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center text-black/60 group"
                title="Maximize"
              >
                <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Window Title */}
            <div className="text-xs font-mono font-medium text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Labib@Mac-mini-M4: ~/{activeTab}</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("terminal");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === "terminal" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Terminal size={12} />
                Terminal
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("ai");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === "ai" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Bot size={12} />
                AI Assistant
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("skills");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === "skills" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Cpu size={12} />
                Skills
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("projects");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === "projects" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Layers size={12} />
                Platforms
              </button>
            </div>
          </div>

          {/* Window Content Body */}
          <div className="flex-1 overflow-hidden p-4 sm:p-6 bg-[#090d14]">
            {/* TAB 1: INTERACTIVE TERMINAL */}
            {activeTab === "terminal" && (
              <div className="h-full flex flex-col justify-between font-mono text-xs sm:text-sm">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-neutral-300">
                    <p className="text-emerald-400 font-bold mb-1">⚡ Labib Fohayer Studio Shell (zsh / Node.js v22)</p>
                    <p className="text-neutral-400 text-xs">
                      Type interactive commands or click quick triggers below:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["help", "whoami", "skills", "projects", "story", "contact"].map((cmd) => (
                        <button
                          key={cmd}
                          onClick={() => {
                            setTerminalInput(cmd);
                          }}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 text-xs text-neutral-300 transition-colors border border-white/5"
                        >
                          ${cmd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {terminalHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <span>➜</span>
                        <span className="text-neutral-400">~/webpulse</span>
                        <span className="text-white font-semibold">$ {item.cmd}</span>
                      </div>
                      <div className="pl-6 text-neutral-300 leading-relaxed">{item.output}</div>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Input Prompt */}
                <form onSubmit={handleTerminalSubmit} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                  <span className="text-emerald-400 font-bold">➜</span>
                  <span className="text-neutral-400">~/webpulse $</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type a command (e.g. 'help', 'skills', 'projects')..."
                    className="flex-1 bg-transparent outline-none text-white font-mono text-sm placeholder:text-neutral-600"
                    autoFocus
                  />
                  <button type="submit" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-neutral-300">
                    Run
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: AI ASSISTANT CHAT */}
            {activeTab === "ai" && (
              <div className="h-full flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 text-sm ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {m.role === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                          <Bot size={15} className="text-cyan-300" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl leading-relaxed ${
                          m.role === "user"
                            ? "bg-cyan-600 text-white rounded-br-sm"
                            : "bg-white/[0.05] border border-white/10 text-neutral-200 rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                        <Loader2 size={15} className="text-cyan-300 animate-spin" />
                      </div>
                      <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-neutral-400 text-xs flex items-center gap-2">
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSend} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about Labib's experience, autonomous workflows, tech stack..."
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
                  >
                    <Send size={14} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: SKILLS MATRIX */}
            {activeTab === "skills" && (
              <div className="h-full overflow-y-auto space-y-6 pr-2">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Code2 className="text-cyan-400" size={18} />
                    Core Architecture & Engineering Stack
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Production-tested toolsets used across Webpulse enterprise pipelines.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Category 1 */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
                      Frontend & 3D WebGL
                    </h4>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Next.js 16 (App Router)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> React 19 & TypeScript</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Three.js & WebGL Shaders</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Tailwind CSS v4 & GSAP</li>
                    </ul>
                  </div>

                  {/* Category 2 */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Database size={13} /> Backend & Data
                    </h4>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Python (FastAPI / LangGraph)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Node.js & Bun Runtime</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> PostgreSQL & Supabase</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> MongoDB & Prisma ORM</li>
                    </ul>
                  </div>

                  {/* Category 3 */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Cloud size={13} /> AI & Infrastructure
                    </h4>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Autonomous Agent Workflows</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> OpenAI / Gemini API / Claude</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Docker & Containerization</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Vercel & Cloudflare Edge</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PLATFORMS LAUNCHER */}
            {activeTab === "projects" && (
              <div className="h-full overflow-y-auto space-y-4 pr-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="text-cyan-400" size={18} />
                    Shipped Enterprise Platforms
                  </h3>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateStage("projects");
                    }}
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View in 3D Wall Gallery ➜
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Webpulse Automation System",
                      tag: "AI Autonomous Platform",
                      desc: "Central business automation core managing workflows and client intelligence.",
                      link: "https://webpulsebd.com",
                    },
                    {
                      name: "Al Madina Model Madrasa",
                      tag: "1,200+ Student Institutional Management",
                      desc: "Full automated student fees, SMS notifications, and academic records.",
                      link: "https://almadinamodelmadrasa.com",
                    },
                    {
                      name: "Madrasa OS",
                      tag: "Multi-Tenant Cloud SaaS",
                      desc: "Turnkey operating system for religious and private educational institutions.",
                      link: "#",
                    },
                    {
                      name: "BD Mess Automation",
                      tag: "Hostel Meal & Finance App",
                      desc: "Automated meal calculation, deposit reconciliation, and utility bill sharing.",
                      link: "#",
                    },
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-bold text-white text-sm">{p.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            Live
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-2">{p.desc}</p>
                      </div>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-2"
                      >
                        Visit Platform <ExternalLink size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
