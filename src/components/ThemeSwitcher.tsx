"use client";

import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  { id: "default", name: "CYAN", color: "#06b6d4" },
  { id: "theme-green", name: "MATRIX", color: "#10b981" },
  { id: "theme-pink", name: "NEON", color: "#ec4899" },
  { id: "theme-red", name: "HACKER", color: "#ef4444" },
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("default");

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem("app-theme") || "default";
    applyTheme(saved);
  }, []);

  const applyTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem("app-theme", themeId);
    
    // Remove old themes
    document.body.classList.remove("theme-green", "theme-pink", "theme-red");
    
    // Add new theme if not default
    if (themeId !== "default") {
      document.body.classList.add(themeId);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] w-12 h-12 rounded-full glass flex items-center justify-center text-neutral-400 hover:text-cyan-400 hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] border-cyan-500/20 hover:border-cyan-500/80 group"
      >
        <Palette size={20} className="group-hover:animate-spin-slow" />
      </button>

      {/* Theme Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 left-6 z-[100] p-4 glass-card rounded-2xl flex flex-col gap-3 min-w-[150px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-400 tracking-widest">SYSTEM THEME</span>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                    activeTheme === theme.id 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'hover:bg-white/5 text-neutral-400 border border-transparent'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: theme.color, boxShadow: `0 0 10px ${theme.color}80` }} />
                  {theme.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
