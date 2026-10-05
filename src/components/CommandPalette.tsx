"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Calendar, Home, Briefcase, FileText, X } from "lucide-react";
import { playClickSound } from "@/lib/sounds";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    playClickSound();
    setOpen(false);
    command();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("labibfohayer@gmail.com");
    alert("Email copied to clipboard!");
  };

  return (
    <>
      {/* Search Trigger Button for Mobile/Desktop visibility without keyboard */}
      <button 
        onClick={() => { playClickSound(); setOpen(true); }}
        className="fixed top-6 right-6 md:right-10 z-[100] px-4 py-2 rounded-full glass-card border border-white/10 text-neutral-400 text-sm hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-4"
      >
        <span>Search</span>
        <kbd className="hidden md:inline-block px-2 py-0.5 rounded bg-white/10 text-xs font-mono">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <Command className="w-full h-full flex flex-col">
                <div className="flex items-center px-4 border-b border-white/10 bg-slate-950/50">
                  <Command.Input 
                    placeholder="Type a command or search..." 
                    className="flex-1 bg-transparent py-4 outline-none text-white placeholder:text-neutral-500" 
                    autoFocus
                  />
                  <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <Command.List className="p-2 max-h-[60vh] overflow-y-auto">
                  <Command.Empty className="py-6 text-center text-neutral-500 text-sm">No results found.</Command.Empty>
                  
                  <Command.Group heading="Navigation" className="px-2 text-xs font-semibold text-neutral-500 py-2">
                    <Command.Item onSelect={() => runCommand(() => window.location.href = "#home")} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-neutral-300 hover:bg-cyan-500/20 hover:text-cyan-400 aria-selected:bg-cyan-500/20 aria-selected:text-cyan-400 transition-colors">
                      <Home size={16} /> <span className="text-sm">Go to Home</span>
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => window.location.href = "#projects")} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-neutral-300 hover:bg-cyan-500/20 hover:text-cyan-400 aria-selected:bg-cyan-500/20 aria-selected:text-cyan-400 transition-colors">
                      <Briefcase size={16} /> <span className="text-sm">View Projects</span>
                    </Command.Item>
                  </Command.Group>
                  
                  <Command.Group heading="Actions" className="px-2 text-xs font-semibold text-neutral-500 py-2">
                    <Command.Item onSelect={() => runCommand(copyEmail)} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-neutral-300 hover:bg-cyan-500/20 hover:text-cyan-400 aria-selected:bg-cyan-500/20 aria-selected:text-cyan-400 transition-colors">
                      <Mail size={16} /> <span className="text-sm">Copy Email Address</span>
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => window.open("https://calendly.com/labibfohayer/30min", "_blank"))} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-neutral-300 hover:bg-cyan-500/20 hover:text-cyan-400 aria-selected:bg-cyan-500/20 aria-selected:text-cyan-400 transition-colors">
                      <Calendar size={16} /> <span className="text-sm">Book a Meeting</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
