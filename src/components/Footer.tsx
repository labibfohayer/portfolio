"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const socialNodes = [
  { label: "in", href: "https://linkedin.com/in/labib-fohayer" },
  { label: "wa", href: "https://wa.me/8801580506445" },
  { label: "git", href: "https://github.com/labibfohayer" },
  { label: "ig", href: "https://instagram.com/labib_fohayer" },
];

export default function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <footer className="py-16 relative z-10 bg-[black] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Social Timeline */}
        <div className="relative w-full max-w-2xl mt-12 mb-20 flex justify-between items-center" onMouseLeave={() => setHoveredIndex(null)}>
          
          {/* Base Line */}
          <div className="absolute left-0 right-0 h-px bg-white/10 top-1/2 -translate-y-1/2 -z-10" />
          
          {/* Glowing Progress Line */}
          <motion.div 
            className="absolute left-0 h-px bg-cyan-500 top-1/2 -translate-y-1/2 -z-10 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            animate={{
              width: hoveredIndex !== null 
                ? `${(hoveredIndex / (socialNodes.length - 1)) * 100}%` 
                : "0%"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {socialNodes.map((node, idx) => (
            <a
              key={node.label}
              href={node.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(idx)}
              className="relative group flex flex-col items-center"
            >
              {/* Node Point */}
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${hoveredIndex !== null && idx <= hoveredIndex ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]' : 'bg-neutral-800 border border-white/20'}`} />
              
              {/* Label */}
              <span className={`absolute top-6 text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${hoveredIndex !== null && idx <= hoveredIndex ? 'text-cyan-400' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                {node.label}
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">MD. LABIB FOHAYER</h3>
            <p className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">FOUNDER & CEO @ WEBPULSE AUTOMATION</p>
          </div>
          
          <div className="text-center md:text-right text-[10px] font-bold text-neutral-600 tracking-widest uppercase">
            <p>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
            <p>BUILT FOR SCALE & PRECISION.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
