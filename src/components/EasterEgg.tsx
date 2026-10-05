"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const keys = useRef<string[]>([]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.push(e.key.toLowerCase());
      if (keys.current.length > 4) {
        keys.current.shift();
      }
      
      if (keys.current.join("") === "boss") {
        setActive(true);
        // Play success sound if possible, but keeping it simple
        // Auto dismiss after 7 seconds
        setTimeout(() => setActive(false), 7000);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[999] pointer-events-none bg-black/95 flex flex-col items-center justify-center overflow-hidden"
        >
          <MatrixRain />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
            className="z-10 text-center"
          >
            <h1 className="text-6xl md:text-9xl font-black text-green-500 tracking-widest uppercase drop-shadow-[0_0_30px_rgba(34,197,94,1)] mb-4">
              BOSS MODE
            </h1>
            <p className="text-green-400 text-xl tracking-[0.5em] font-mono border-t border-green-500/50 pt-4">
              SYSTEM OVERRIDE SUCCESSFUL
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = "010101LABIBFOHAYERWEBDEVREACTPYTHONAI";
    const lettersArray = letters.split("");
    
    const fontSize = 18;
    const columns = canvas.width / fontSize;
    
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
    
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#0F0"; 
      ctx.font = fontSize + "px monospace";
      
      for (let i = 0; i < drops.length; i++) {
        const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />;
};
