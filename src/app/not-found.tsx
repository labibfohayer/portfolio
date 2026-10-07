"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Terminal size={32} className="text-red-500" />
        </div>

        <h1 className="text-8xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 mb-4 tracking-tighter">
          404
        </h1>
        
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-cyan-400">System Glitch Detected</h2>
          <p className="text-neutral-400 font-mono text-sm max-w-md">
            [ERROR: FILE_NOT_FOUND] The sector you are trying to access does not exist in this database.
          </p>
        </div>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold tracking-widest text-xs uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Home size={16} />
            Return to Base
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
