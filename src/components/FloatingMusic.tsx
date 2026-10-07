"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { playClickSound } from "@/lib/sounds";

export default function FloatingMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A relaxing lo-fi coding track (free license)
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2; // Keep it low and subtle
  }, []);

  const togglePlay = () => {
    playClickSound();
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch((e) => console.log("Audio play failed: ", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={togglePlay}
      className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full glass-card flex items-center justify-center text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all border border-cyan-500/30 shadow-[0_0_20px_rgba(var(--theme-rgb),0.15)]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Toggle Focus Music"
    >
      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        {isPlaying ? <Pause size={20} /> : <Music size={20} />}
      </motion.div>
    </motion.button>
  );
}
