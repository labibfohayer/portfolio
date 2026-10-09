"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, User, Layers, Cpu, Briefcase, FileText, Diamond, Mail } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { name: "HOME", href: "#home", icon: Home },
  { name: "ABOUT", href: "#about", icon: User },
  { name: "PROJECTS", href: "#projects", icon: Layers },
  { name: "SKILLS", href: "#skills", icon: Cpu },
  { name: "EXPERIENCE", href: "#experience", icon: Briefcase },
  { name: "BLOG", href: "#blog", icon: FileText },
  { name: "CONTACT", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    profilePicture: "/profile-ceo.jpg",
    whatsappNumber: "8801580506445"
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      });
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="w-full max-w-7xl flex justify-between items-center bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/5 rounded-full p-2 pr-4 shadow-2xl">
          
          {/* Left: Brand / Profile */}
          <Link href="#home" className="flex items-center gap-3 z-50 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
              <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full -z-10" />
              <img src={settings.profilePicture} alt="Labib" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold tracking-widest text-white leading-tight flex items-center gap-2">
                LABIB <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </span>
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase">AI Architect</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2 bg-black/40 border border-white/5 rounded-full p-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Icon size={14} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(var(--theme-rgb),0.15)]"
            >
              <Diamond size={14} className="fill-current" />
              LET'S TALK
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white z-50 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[black]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-2xl font-bold tracking-widest text-neutral-400 hover:text-white transition-colors"
                  >
                    <Icon size={24} />
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
