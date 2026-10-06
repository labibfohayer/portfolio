"use client";

import { motion } from "framer-motion";

export default function SocialSidebar() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-[999] pointer-events-auto"
    >
      <div className="w-px h-24 bg-gradient-to-b from-transparent to-cyan-500/50" />
      
      <a href="https://github.com/labibfohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
      </a>
      
      <a href="https://linkedin.com/in/labib-fohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
      
      <a href="https://x.com/labib_fohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
      </a>
      
      <div className="w-px h-24 bg-gradient-to-t from-transparent to-cyan-500/50" />
    </motion.div>
  );
}
