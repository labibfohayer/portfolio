"use client";

import { ReactNode } from "react";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Link from "next/link";
import { Compass, Monitor, Layers, Bike, Mail } from "lucide-react";

interface EditorialLayoutProps {
  children: ReactNode;
  activeNav?: string;
}

export default function EditorialLayout({ children, activeNav = "home" }: EditorialLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* 1. 0% to 100% Progress Preloader */}
      <Preloader />

      {/* 2. 120 FPS High-Inertia Lenis Smooth Scroll Provider */}
      <SmoothScroll>
        {/* 3. Minimalist Dark-Mode Floating Navbar */}
        <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <nav className="w-full max-w-5xl flex items-center justify-between p-2 px-5 rounded-full bg-[#0e1017]/75 backdrop-blur-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] pointer-events-auto">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
              <span className="font-bold text-xs tracking-wider text-white">LABIB FOHAYER</span>
              <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline-block">
                // 3D STUDIO
              </span>
            </Link>

            {/* Stage / Section Links */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
              {[
                { name: "Loft", href: "#overview", icon: Compass },
                { name: "Workstation", href: "#desk", icon: Monitor },
                { name: "Gallery", href: "#projects", icon: Layers },
                { name: "Origin", href: "#story", icon: Bike },
                { name: "Contact", href: "#contact", icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav.toLowerCase() === item.name.toLowerCase();
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                      isActive
                        ? "bg-white text-black font-bold"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={13} className={isActive ? "text-black" : "text-cyan-400"} />
                    <span className="hidden md:inline">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Let's Talk CTA */}
            <a
              href="#contact"
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs border border-white/15 transition-all hidden sm:inline-block"
            >
              Let&apos;s Talk
            </a>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="w-full relative">
          {children}
        </main>
      </SmoothScroll>
    </div>
  );
}
