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

  // "LABIB" Geometric Name ref
  const labibWrapperRef = useRef<HTMLDivElement>(null);

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
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  };

  useEffect(() => {
    if (isAdmin) {
      setIsLoading(false);
      return;
    }

    // Lock page scroll immediately on mount
    document.body.style.overflow = "hidden";

    // Bulletproof safety fallback: under no circumstances should preloader ever block page > 3.2s
    const safetyTimer = setTimeout(() => {
      completeAndUnlock();
    }, 3200);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, [isAdmin]);

  useGSAP(() => {
    if (isAdmin) return;

    // Initial state for "LABIB" letters (hidden until 100% completion)
    gsap.set(".labib-letter", {
      opacity: 0,
      scale: 0.7,
      y: 10,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        completeAndUnlock();
      },
    });

    // -------------------------------------------------------------
    // STEP 1: Progress Fill & Rolling Counter (0s to 1.3s)
    // Snappy, high-energy roll
    // -------------------------------------------------------------
    const progressObj = { val: 0 };
    let lastVal = -1;

    // 1. Counter animation (000 to 100)
    tl.to(
      progressObj,
      {
        val: 100,
        duration: 1.3,
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
        duration: 1.3,
        ease: "power2.inOut",
      },
      0
    );

    // -------------------------------------------------------------
    // STEP 2: Morph into Geometric "LABIB" Name (at 1.3s)
    // -------------------------------------------------------------
    // a) bar-track fades out
    tl.to(
      barTrackRef.current,
      {
        opacity: 0,
        duration: 0.1,
        ease: "power1.out",
      },
      1.3
    );

    // b) fill-bar dissolves smoothly
    tl.to(
      fillBarRef.current,
      {
        opacity: 0,
        duration: 0.12,
        ease: "power1.out",
      },
      1.3
    );

    // c) Bottom-left counter slides down and disappears
    tl.to(
      counterContainerRef.current,
      {
        yPercent: 110,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      },
      1.3
    );

    // d) "LABIB" geometric letters emerge and assemble in center
    tl.to(
      ".labib-letter",
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "expo.out",
        stagger: 0.04,
      },
      1.3
    );

    // -------------------------------------------------------------
    // STEP 3: Short Pause (1.7s to 2.15s) & Massive Scale-Up Reveal (at 2.15s)
    // -------------------------------------------------------------
    // Zoom "LABIB" name into camera (scale: 90)
    tl.to(
      labibWrapperRef.current,
      {
        scale: 90,
        duration: 0.65,
        ease: "expo.inOut",
      },
      2.15
    );

    // Preloader overlay fades out in the final 0.25s as white engulfs screen
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      2.55
    );
  }, { scope: overlayRef, dependencies: [isAdmin] });

  if (isAdmin || !isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-[#000000] overflow-hidden select-none pointer-events-auto"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Center Container: Progress Bar & Morphing "LABIB" Name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
        {/* Initial Progress Bar (0s to 1.3s) */}
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

        {/* Geometric "LABIB" Name (Assembles at 1.3s, Scales 90x at 2.15s) */}
        <div
          ref={labibWrapperRef}
          className="absolute flex items-center justify-center will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <svg
            viewBox="0 0 274 64"
            fill="#ffffff"
            className="w-[274px] max-w-[85vw] h-auto will-change-transform"
          >
            {/* Letter: L */}
            <path
              d="M 0 0 H 14 V 50 H 46 V 64 H 0 Z"
              className="labib-letter opacity-0 will-change-transform"
            />

            {/* Letter: A */}
            <path
              fillRule="evenodd"
              d="M 62 0 H 112 V 64 H 98 V 42 H 76 V 64 H 62 Z M 76 14 H 98 V 29 H 76 Z"
              className="labib-letter opacity-0 will-change-transform"
            />

            {/* Letter: B (First) */}
            <path
              fillRule="evenodd"
              d="M 128 0 H 168 L 176 8 V 22 L 170 28 L 176 34 V 56 L 168 64 H 128 Z M 142 14 H 158 L 162 18 L 158 22 H 142 Z M 142 37 H 158 L 162 41 L 158 47 H 142 Z"
              className="labib-letter opacity-0 will-change-transform"
            />

            {/* Letter: I */}
            <path
              d="M 192 0 H 210 V 64 H 192 Z"
              className="labib-letter opacity-0 will-change-transform"
            />

            {/* Letter: B (Second) */}
            <path
              fillRule="evenodd"
              d="M 226 0 H 266 L 274 8 V 22 L 268 28 L 274 34 V 56 L 266 64 H 226 Z M 240 14 H 256 L 260 18 L 256 22 H 240 Z M 240 37 H 256 L 260 41 L 256 47 H 240 Z"
              className="labib-letter opacity-0 will-change-transform"
            />
          </svg>
        </div>
      </div>

      {/* Bottom-Left Rolling Odometer Counter (000 to 100) */}
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
