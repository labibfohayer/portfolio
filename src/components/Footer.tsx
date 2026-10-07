"use client";

import { useState, useEffect } from "react";

const barcodePattern = [1, 2, 1, 1, 3, 1, 2, 1, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 2, 1];

export default function Footer() {
  const [time, setTime] = useState<string>("SYS_TIME: --:--:-- UTC+6");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`SYS_TIME: ${now.toLocaleTimeString('en-US', { hour12: false })} UTC+6`);
    };
    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="py-16 pb-8 relative z-10 bg-[black] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center pt-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end md:items-end w-full gap-8 md:gap-6 mb-12">
          <div className="text-center md:text-left w-full md:w-auto">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tighter">MD. LABIB FOHAYER</h3>
            <p className="text-[9px] md:text-[10px] text-cyan-500 font-bold tracking-widest uppercase mt-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">FOUNDER & CEO @ WEBPULSE AUTOMATION</p>
          </div>
          
          <div className="text-center md:text-right text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex flex-col gap-1 w-full md:w-auto">
            <p className="text-cyan-400 animate-pulse">{time}</p>
            <p>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
          </div>
        </div>

        {/* System Barcode Edge */}
        <div className="w-full flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-700 cursor-default">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-6 items-end gap-[3px]">
              {barcodePattern.map((width, i) => (
                <div key={i} className="bg-neutral-500 h-full transition-colors hover:bg-cyan-500" style={{ width: `${width * 1.5}px` }} />
              ))}
            </div>
            <span className="text-[8px] font-mono tracking-[0.3em] text-neutral-600">ID: WBP-00X-SYS-ACTIVE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
