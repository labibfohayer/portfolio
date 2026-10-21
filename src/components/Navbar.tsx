"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, User, Layers, Cpu, Briefcase, FileText, Diamond, Mail, MessageCircle } from "lucide-react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.overflowX = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.overflowX = "hidden";
    };
  }, [isOpen]);

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none"
      >
        <div className="w-full max-w-7xl flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 sm:p-2 pr-3 sm:pr-4 shadow-2xl pointer-events-auto">
          
          {/* Left: Brand / Profile */}
          <Link href="#home" className="flex items-center gap-2 sm:gap-3 z-50 group">
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-cyan-500/30 group-hover:border-cyan-400 transition-colors shrink-0">
              <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full -z-10" />
              <img src={settings.profilePicture} alt="Labib" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-white leading-tight flex items-center gap-1 sm:gap-2">
                LABIB <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-widest text-neutral-400 uppercase">AI Architect</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 bg-black/40 border border-white/5 rounded-full p-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs font-bold tracking-wider text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Icon size={14} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href={`https://wa.me/${cleanWhatsAppNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(var(--theme-rgb),0.15)]"
            >
              <Diamond size={14} className="fill-current" />
              LET'S TALK
            </a>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden text-white z-50 p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={22} className="text-cyan-400" /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col justify-between px-6 py-20 overflow-y-auto"
          >
            <div className="flex flex-col gap-5 max-w-sm mx-auto w-full pt-8">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 py-3 px-4 rounded-xl border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-lg font-bold tracking-widest text-neutral-300 hover:text-cyan-400 transition-all active:scale-98"
                    >
                      <Icon size={20} className="text-cyan-400" />
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Menu Footer Action */}
            <div className="max-w-sm mx-auto w-full pt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-cyan-500 text-black font-extrabold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 active:scale-98 transition-all"
              >
                <MessageCircle size={18} fill="currentColor" />
                LET'S TALK ON WHATSAPP
              </a>
              <p className="text-center text-[10px] text-neutral-500 tracking-widest uppercase">
                Md. Labib Fohayer • Founder & AI Architect
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
