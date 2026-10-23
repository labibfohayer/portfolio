"use client";

import { motion } from "framer-motion";
import { 
  Compass, 
  Monitor, 
  Layers, 
  Bike, 
  Phone, 
  Volume2, 
  VolumeX, 
  Activity,
  RotateCcw
} from "lucide-react";
import { playClickSound } from "@/lib/sounds";

export type CameraStage = "overview" | "desk" | "projects" | "shelf" | "contact";

interface RoomNavigationProps {
  currentStage: CameraStage;
  onSelectStage: (stage: CameraStage) => void;
  isLoFiPlaying: boolean;
  onToggleLoFi: () => void;
  onResetView: () => void;
}

export default function RoomNavigation({
  currentStage,
  onSelectStage,
  isLoFiPlaying,
  onToggleLoFi,
  onResetView,
}: RoomNavigationProps) {
  const navItems: Array<{ stage: CameraStage; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
    { stage: "overview", label: "Loft Overview", icon: Compass },
    { stage: "desk", label: "Mac & Skills", icon: Monitor },
    { stage: "projects", label: "Wall Gallery", icon: Layers },
    { stage: "shelf", label: "Origin Story", icon: Bike },
    { stage: "contact", label: "Contact Hotline", icon: Phone },
  ];

  return (
    <>
      {/* Top Floating Glass Navigation Header */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 pointer-events-none">
        <div className="w-full max-w-6xl flex items-center justify-between pointer-events-auto">
          {/* Brand Tag */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-xs tracking-wider text-white">LABIB FOHAYER</span>
            <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline-block">
              // STUDIO LOFT
            </span>
          </div>

          {/* Central Camera Stage Switcher */}
          <nav className="flex items-center gap-1 p-1 rounded-full bg-black/70 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-x-auto max-w-[90vw] sm:max-w-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentStage === item.stage;
              return (
                <button
                  key={item.stage}
                  onClick={() => {
                    playClickSound();
                    onSelectStage(item.stage);
                  }}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-mono transition-all shrink-0 ${
                    isActive
                      ? "text-black font-extrabold"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white rounded-full z-0 shadow-lg"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon size={14} className={isActive ? "text-black" : "text-cyan-400"} />
                    <span className="hidden md:inline">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: 120 FPS Badge & Lo-Fi Music Toggle */}
          <div className="flex items-center gap-2">
            {/* 120 FPS Performance Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-emerald-500/30 text-[10px] font-mono text-emerald-300 shadow-xl">
              <Activity size={12} className="text-emerald-400" />
              <span>120 FPS LOCKED</span>
            </div>

            {/* Reset Camera View */}
            <button
              onClick={() => {
                playClickSound();
                onResetView();
              }}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 flex items-center justify-center text-neutral-300 hover:text-white transition-all shadow-xl"
              title="Reset 3D Camera View"
            >
              <RotateCcw size={14} />
            </button>

            {/* Retro Speaker Lo-Fi Audio Toggle */}
            <button
              onClick={() => {
                playClickSound();
                onToggleLoFi();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border transition-all text-xs font-mono shadow-xl ${
                isLoFiPlaying
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                  : "bg-black/60 border-white/10 text-neutral-400 hover:text-white"
              }`}
              title="Toggle Lo-Fi Study Music on Desktop Speaker"
            >
              {isLoFiPlaying ? (
                <>
                  <Volume2 size={14} className="text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">LO-FI ON</span>
                  {/* Visualizer bars */}
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-0.5 h-2 bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-0.5 h-3 bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} />
                  <span className="hidden sm:inline">LO-FI OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Hint Pill */}
      <footer className="fixed bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
        <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-neutral-400 flex items-center gap-3 shadow-2xl pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>
            {currentStage === "overview" && "Scroll or click any zone to explore the room."}
            {currentStage === "desk" && "Click Mac Studio Display to open Terminal & Chat."}
            {currentStage === "projects" && "Click any wall frame to inspect project case study."}
            {currentStage === "shelf" && "Inspect the Biker Helmet to read the authentic founder story."}
            {currentStage === "contact" && "Click the Smartphone on the desk to reach out directly."}
          </span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-500 hidden sm:inline">Drag to rotate 3D view</span>
        </div>
      </footer>
    </>
  );
}
