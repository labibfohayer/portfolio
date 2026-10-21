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

  // "LABIB FOHAYER | PORTFOLIO" ref
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
        }, 80);
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

    // Fail-safe fallback timer (guarantees site is unlocked)
    const safetyTimer = setTimeout(() => {
      completeAndUnlock();
    }, 2400);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, [isAdmin]);

  useGSAP(() => {
    if (isAdmin) return;

    // Initial state for brand text
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
    // STEP 1: Progress Fill & Rolling Counter (0s to 1.0s)
    // -------------------------------------------------------------
    const progressObj = { val: 0 };
    let lastVal = -1;

    // 1. Counter animation (000 to 100)
    tl.to(
      progressObj,
      {
        val: 100,
        duration: 1.0,
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

    // 2. Center bar fills from 0px to 200px (100%)
    tl.fromTo(
      fillBarRef.current,
      { width: "0px" },
      {
        width: "200px",
        duration: 1.0,
        ease: "power2.inOut",
      },
      0
    );

    // -------------------------------------------------------------
    // STEP 2: Morph into "LABIB FOHAYER | PORTFOLIO" (at 1.0s)
    // -------------------------------------------------------------
    // a) bar-track fades out immediately
    tl.to(
      barTrackRef.current,
      {
        opacity: 0,
        duration: 0.1,
        ease: "power1.out",
      },
      1.0
    );

    // b) fill-bar dissolves smoothly
    tl.to(
      fillBarRef.current,
      {
        opacity: 0,
        duration: 0.12,
        ease: "power1.out",
      },
      1.0
    );

    // c) Bottom-left counter slides down and disappears
    tl.to(
      counterContainerRef.current,
      {
        yPercent: 110,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      1.0
    );

    // d) "LABIB FOHAYER | PORTFOLIO" emerges in pure white
    tl.to(
      brandContainerRef.current,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "expo.out",
      },
      1.0
    );

    // -------------------------------------------------------------
    // STEP 3: Directly Zoom In & Reveal Website (at 1.4s)
    // -------------------------------------------------------------
    // Zoom "LABIB FOHAYER | PORTFOLIO" massively into camera
    tl.to(
      brandContainerRef.current,
      {
        scale: 85,
        duration: 0.55,
        ease: "expo.inOut",
      },
      1.4
    );

    // Preloader overlay fades out as white engulfs screen
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      1.7
    );
  }, { scope: overlayRef, dependencies: [isAdmin] });

  if (isAdmin || !isLoading) return null;

  return (
    <div
      ref={overlayRef}
      onClick={completeAndUnlock}
      className="fixed inset-0 z-[99999] bg-[#000000] overflow-hidden select-none pointer-events-auto cursor-pointer"
      style={{ backgroundColor: "#000000" }}
      title="Click or tap to enter"
    >
      {/* Center Container: Progress Bar & "LABIB FOHAYER | PORTFOLIO" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
        {/* Initial Progress Bar (0s to 1.0s) */}
        <div
          ref={barContainerRef}
          className="relative flex items-center justify-center will-change-opacity"
          style={{ width: "200px", height: "36px" }}
        >
          {/* Dark Gray Track */}
          <div
            ref={barTrackRef}
            className="absolute inset-0 bg-[#333333] will-change-opacity"
          />

          {/* Solid White Fill Bar */}
          <div
            ref={fillBarRef}
            className="absolute left-0 bottom-0 bg-[#ffffff] will-change-[width,opacity]"
            style={{ width: "0px", height: "36px" }}
          />
        </div>

        {/* "LABIB FOHAYER | PORTFOLIO" Brand Showcase (Assembles at 1.0s, Directly Zooms at 1.4s) */}
        <div
          ref={brandContainerRef}
          className="absolute flex items-center justify-center will-change-transform px-4 pointer-events-none"
          style={{ transformOrigin: "center center" }}
        >
          <div className="flex flex-row items-center justify-center text-center whitespace-nowrap text-white">
            {/* LABIB FOHAYER */}
            <span className="font-display font-black tracking-wider text-[clamp(1.15rem,4.2vw,2.4rem)] text-white">
              LABIB FOHAYER
            </span>

            {/* Divider */}
            <span className="mx-2 sm:mx-4 text-white/50 font-light text-[clamp(1.15rem,4.2vw,2.4rem)]">
              |
            </span>

            {/* PORTFOLIO */}
            <span className="font-mono font-bold tracking-[0.2em] sm:tracking-[0.28em] text-[clamp(0.75rem,2.5vw,1.4rem)] text-white uppercase border border-white/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-white/5 backdrop-blur-sm">
              PORTFOLIO
            </span>
          </div>
        </div>
      </div>

      {/* Bottom-Left Rolling Odometer Counter (000 to 100) in White */}
      <div
        ref={counterContainerRef}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 z-20 will-change-transform"
      >
        <div
          className="flex items-center text-[clamp(4rem,10vw,8.5rem)] font-medium text-white tracking-tight font-sans select-none"
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
