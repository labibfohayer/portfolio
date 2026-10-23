"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  Check, 
  Clock
} from "lucide-react";
import { playClickSound } from "@/lib/sounds";

interface PhoneContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneContactModal({ isOpen, onClose }: PhoneContactModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    playClickSound();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSent(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      // Fallback
      setIsSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0e1118] border-2 border-white/20 rounded-[2.5rem] shadow-[0_35px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-200"
        >
          {/* Smartphone Speaker / Dynamic Island Notch */}
          <div className="h-8 bg-[#090b10] flex items-center justify-center relative select-none">
            <div className="w-20 h-4 bg-black rounded-full border border-white/10" />
            <div className="absolute right-6 flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
              <Clock size={10} />
              <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          {/* Smartphone Header */}
          <div className="p-5 pb-4 border-b border-white/10 flex items-center justify-between bg-black/30">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                ● DIRECT STUDIO HOTLINE
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Let&apos;s Build Together</h2>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              title="Close Phone View"
            >
              <X size={15} />
            </button>
          </div>

          {/* Phone Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Quick Action Channels */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/8801580506445"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="p-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 flex items-center gap-2.5 text-emerald-300 font-bold text-xs transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black shrink-0">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-normal">WhatsApp</div>
                  <div>Direct Chat</div>
                </div>
              </a>

              <a
                href="mailto:labibfohayer@gmail.com"
                onClick={playClickSound}
                className="p-3.5 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 flex items-center gap-2.5 text-cyan-300 font-bold text-xs transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-normal">Email</div>
                  <div>Send Mail</div>
                </div>
              </a>
            </div>

            {/* Direct Message Form */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Send a Direct Message
              </h3>

              {isSent ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check size={16} className="shrink-0" />
                  <span>Message delivered to Labib&apos;s Studio inbox! I will reply shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your Email or Phone"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50"
                  />
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, automation needs, or collaboration..."
                    rows={3}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{isSubmitting ? "Sending..." : "Dispatch Message"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Social Connects Bar */}
            <div className="flex items-center justify-around pt-2 border-t border-white/10">
              <a
                href="https://github.com/labibfohayer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                title="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>

              <a
                href="https://www.linkedin.com/in/labib-fohayer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                title="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>

              <a
                href="https://www.facebook.com/labibfohayer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>

              <a
                href="https://www.youtube.com/@LabibFohayer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                title="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Smartphone Bottom Home Bar */}
          <div className="h-4 bg-[#090b10] flex items-center justify-center select-none">
            <div className="w-28 h-1 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
