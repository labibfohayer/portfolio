"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Safe ScrollTrigger registration for SSR / Next.js
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Odometer digit reel arrays
const hundreds = [0, 1];
const tens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const ones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export default function Preloader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const counterContainerRef = useRef<HTMLDivElement>(null);
  const hundredsColRef = useRef<HTMLSpanElement>(null);
  const tensColRef = useRef<HTMLSpanElement>(null);
  const onesColRef = useRef<HTMLSpanElement>(null);

  // Center Progress Bar refs
  const barContainerRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);

  // Brand Name Ref: "LABIB FOHAYER | PORTFOLIO"
  const brandContainerRef = useRef<HTMLDivElement>(null);

  // Skip preloader on admin dashboard for instant workflow
  const isAdmin = pathname?.startsWith("/admin");

  // Core cleanup and unlock helper
  const completeAndUnlock = () => {
    document.body.style.overflow = "";
    if (overlayRef.current) {
      overlayRef.current.style.display = "none";
      overlayRef.current.style.pointerEvents = "none";
    }
    setIsLoading(false);
    try {
      if (typeof window !== "undefined") {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    if (isAdmin) {
      setIsLoading(false);
      return;
    }

    // Lock page scroll immediately on mount
    document.body.style.overflow = "hidden";

    // Fail-safe fallback timer (guarantees site is unlocked within 1.9s)
    const safetyTimer = setTimeout(() => {
      completeAndUnlock();
    }, 1900);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, [isAdmin]);

  useGSAP(() => {
    if (isAdmin) return;

    // Initial state for brand name
    gsap.set(brandContainerRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 12,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        completeAndUnlock();
      },
    });

    // -------------------------------------------------------------
    // STEP 1: Ultra-Fast Cyan Progress Fill & Rolling Counter (0s to 0.75s)
    // -------------------------------------------------------------
    const progressObj = { val: 0 };
    let lastVal = -1;

    // 1. Counter animation (000 to 100)
    tl.to(
      progressObj,
      {
        val: 100,
        duration: 0.75,
        ease: "power2.inOut",
        onUpdate: () => {
          const current = Math.min(100, Math.floor(progressObj.val));
          if (current === lastVal) return;
          lastVal = current;

          const h = Math.floor(current / 100);
          const t = current === 100 ? 10 : Math.floor((current % 100) / 10);
          const o = current === 100 ? 10 : current % 10;

          if (hundredsColRef.current) {
            hundredsColRef.current.style.transform = `translateY(-${h}em)`;
          }
          if (tensColRef.current) {
            tensColRef.current.style.transform = `translateY(-${t}em)`;
          }
          if (onesColRef.current) {
            onesColRef.current.style.transform = `translateY(-${o}em)`;
          }
        },
      },
      0
    );

    // 2. Cyan Progress bar fills across the track
    tl.fromTo(
      fillBarRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: 0.75,
        ease: "power2.inOut",
      },
      0
    );

    // -------------------------------------------------------------
    // STEP 2: Morph into "LABIB FOHAYER | PORTFOLIO" (at 0.75s)
    // -------------------------------------------------------------
    // a) bar-track & fill dissolve
    tl.to(
      barContainerRef.current,
      {
        opacity: 0,
        scale: 0.95,
        duration: 0.1,
        ease: "power1.out",
      },
      0.75
    );

    // b) Bottom-left counter slides down and disappears
    tl.to(
      counterContainerRef.current,
      {
        yPercent: 110,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      0.75
    );

    // c) "LABIB FOHAYER | PORTFOLIO" emerges in glowing Cyan
    tl.to(
      brandContainerRef.current,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "expo.out",
      },
      0.75
    );

    // -------------------------------------------------------------
    // STEP 3: Short Pause (1.1s to 1.35s) & Massive Zoom Reveal (at 1.35s)
    // -------------------------------------------------------------
    // Zoom brand name into camera
    tl.to(
      brandContainerRef.current,
      {
        scale: 70,
        duration: 0.45,
        ease: "expo.inOut",
      },
      1.35
    );

    // Preloader overlay fades out in the final 0.2s as site is revealed
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      1.6
    );
  }, { scope: overlayRef, dependencies: [isAdmin] });

  if (isAdmin || !isLoading) return null;

  return (
    <div
      ref={overlayRef}
      onClick={completeAndUnlock}
      className="fixed inset-0 z-[99999] bg-[#020710] overflow-hidden select-none pointer-events-auto cursor-pointer"
      style={{ backgroundColor: "#020710" }}
      title="Click or tap to enter"
    >
      {/* Sci-Fi Cyan Radial Aura & Tech Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.18)_0%,_rgba(2,8,16,0.85)_60%,_#01050a_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Center Container: Cyan Progress Bar & "LABIB FOHAYER | PORTFOLIO" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
        {/* Initial Cyan Progress Bar (0s to 0.75s) */}
        <div
          ref={barContainerRef}
          className="relative flex items-center justify-center will-change-transform"
          style={{ width: "240px", height: "32px" }}
        >
          {/* Dark Cyan-Tinted Track */}
          <div
            ref={barTrackRef}
            className="absolute inset-0 bg-cyan-950/40 border border-cyan-500/25 rounded-full overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] backdrop-blur-sm"
          >
            {/* Glowing Cyan Fill Bar */}
            <div
              ref={fillBarRef}
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.85)] origin-left will-change-[width]"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* "LABIB FOHAYER | PORTFOLIO" Brand Showcase (Assembles at 0.75s, Zooms at 1.35s) */}
        <div
          ref={brandContainerRef}
          className="absolute flex items-center justify-center will-change-transform px-4 pointer-events-none"
          style={{ transformOrigin: "center center" }}
        >
          <div className="flex flex-row items-center justify-center text-center whitespace-nowrap drop-shadow-[0_0_35px_rgba(6,182,212,0.65)]">
            {/* LABIB FOHAYER */}
            <span className="font-display font-black tracking-wider text-[clamp(1.15rem,4.2vw,2.4rem)] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
              LABIB <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.9)]">FOHAYER</span>
            </span>

            {/* Divider */}
            <span className="mx-2 sm:mx-4 text-cyan-400/60 font-light text-[clamp(1.15rem,4.2vw,2.4rem)]">
              |
            </span>

            {/* PORTFOLIO */}
            <span className="font-mono font-bold tracking-[0.2em] sm:tracking-[0.28em] text-[clamp(0.75rem,2.5vw,1.4rem)] text-cyan-300 uppercase border border-cyan-500/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-cyan-950/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              PORTFOLIO
            </span>
          </div>
        </div>
      </div>

      {/* Bottom-Left Rolling Odometer Counter (000 to 100) in Cyan */}
      <div
        ref={counterContainerRef}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 z-20 will-change-transform"
      >
        <div
          className="flex items-center text-[clamp(4rem,10vw,8.5rem)] font-bold text-cyan-400 tracking-tight font-sans select-none drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]"
          style={{ lineHeight: "1em" }}
        >
          {/* Column 1: Hundreds [0, 1] */}
          <span
            style={{
              height: "1em",
              lineHeight: "1em",
              overflow: "hidden",
              display: "inline-block",
              verticalAlign: "top",
            }}
          >
            <span
              ref={hundredsColRef}
              style={{
                display: "flex",
                flexDirection: "column",
                willChange: "transform",
              }}
            >
              {hundreds.map((d, i) => (
                <span
                  key={i}
                  style={{
                    height: "1em",
                    lineHeight: "1em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>

          {/* Column 2: Tens [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] */}
          <span
            style={{
              height: "1em",
              lineHeight: "1em",
              overflow: "hidden",
              display: "inline-block",
              verticalAlign: "top",
            }}
          >
            <span
              ref={tensColRef}
              style={{
                display: "flex",
                flexDirection: "column",
                willChange: "transform",
              }}
            >
              {tens.map((d, i) => (
                <span
                  key={i}
                  style={{
                    height: "1em",
                    lineHeight: "1em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>

          {/* Column 3: Ones [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] */}
          <span
            style={{
              height: "1em",
              lineHeight: "1em",
              overflow: "hidden",
              display: "inline-block",
              verticalAlign: "top",
            }}
          >
            <span
              ref={onesColRef}
              style={{
                display: "flex",
                flexDirection: "column",
                willChange: "transform",
              }}
            >
              {ones.map((d, i) => (
                <span
                  key={i}
                  style={{
                    height: "1em",
                    lineHeight: "1em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
