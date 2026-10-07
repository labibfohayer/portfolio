"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "INITIALIZING SYSTEM CORE...",
    "ESTABLISHING SECURE CONNECTION...",
    "BYPASSING FIREWALLS...",
    "LOADING NEURAL NETWORK...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    // Sequence the text changes
    const interval = setInterval(() => {
      setTextIndex((prev) => {
        if (prev < loadingTexts.length - 1) return prev + 1;
        return prev;
      });
    }, 400);

    // End loading after 2.5 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadingTexts.length]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center font-mono"
        >
          {/* Matrix Rain / Grid Background (simplified for loader) */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            
            {/* Spinning Loader Logo */}
            <div className="relative w-24 h-24 mb-12">
              <div className="absolute inset-0 border-2 border-dashed border-cyan-500/40 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-2 border border-cyan-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-2xl animate-pulse">L</span>
              </div>
            </div>

            {/* Loading Texts */}
            <div className="w-full bg-cyan-950/30 border border-cyan-500/20 p-4 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              {loadingTexts.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i <= textIndex ? 1 : 0, x: i <= textIndex ? 0 : -10 }}
                  className={`text-[10px] md:text-xs mb-2 tracking-widest ${i === loadingTexts.length - 1 ? 'text-green-400 font-bold' : 'text-cyan-400'}`}
                >
                  <span className="opacity-50 mr-2">{'>'}</span> {text}
                </motion.div>
              ))}
              
              {/* Progress Bar */}
              <div className="w-full h-1 bg-black/50 mt-4 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "linear" }}
                  className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"
                />
              </div>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
