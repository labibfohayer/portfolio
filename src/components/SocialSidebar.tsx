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
      
      <a href="https://github.com/labibfohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer" title="GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
      </a>
      
      <a href="https://linkedin.com/in/labib-fohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer" title="LinkedIn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
      
      <a href="https://x.com/labibfohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer" title="X (Twitter)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>

      <a href="https://instagram.com/labib_fohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer" title="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      </a>

      <a href="https://youtube.com/@UCSU3yYxc6X9eToQjXKPQt6w" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer" title="YouTube">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
      </a>

      <a href="https://tiktok.com/@labib.fohayer" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 hover:scale-125 transition-all cursor-pointer" title="TikTok">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.33-2.22 1.83-5.22 2.62-8.08 1.92-2.71-.64-5.01-2.48-6.17-5.02-1.16-2.5-1.14-5.46.06-7.94 1.16-2.44 3.39-4.28 6.01-4.93 1.34-.33 2.74-.35 4.1-.15v4.06c-1.3-.23-2.67-.14-3.86.41-1.18.52-2.12 1.51-2.58 2.72-.45 1.16-.48 2.47-.14 3.65.34 1.16 1.14 2.16 2.17 2.74 1.05.58 2.3.73 3.45.47 1.17-.26 2.19-.97 2.82-1.97.64-.99.96-2.19.95-3.38.03-6.52.01-13.04.01-19.56z"/></svg>
      </a>

      <div className="w-px h-24 bg-gradient-to-t from-transparent to-cyan-500/50" />
    </motion.div>
  );
}
