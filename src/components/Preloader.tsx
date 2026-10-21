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
const ones = Array.from({ length: 10 }, () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).flat().concat([0]);

export default function Preloader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const counterContainerRef = useRef<HTMLDivElement>(null);
  const hundredsColRef = useRef<HTMLDivElement>(null);
  const tensColRef = useRef<HTMLDivElement>(null);
  const onesColRef = useRef<HTMLDivElement>(null);

  const lShapeContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);
  const verticalStemRef = useRef<HTMLDivElement>(null);

  // Skip preloader on admin dashboard for instant workflow
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setIsLoading(false);
      return;
    }

    // Lock page scroll immediately on mount
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAdmin]);

  useGSAP(() => {
    if (isAdmin) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // 1. Unlock body scroll
        document.body.style.overflow = "";
        
        // 2. Hide overlay completely to prevent blocking any clicks
        if (overlayRef.current) {
          overlayRef.current.style.display = "none";
          overlayRef.current.style.pointerEvents = "none";
        }
        setIsLoading(false);

        // 3. Refresh ScrollTrigger calculations for underlying sections
        if (typeof window !== "undefined") {
          ScrollTrigger.refresh();
        }
      }
    });

    // ==========================================
    // STAGE 1: Progress Fill & Rolling Counter (0% to 100%)
    // Duration: 2.3s, Ease: "power2.inOut"
    // ==========================================

    // 1. Fill horizontal bar from 0% to 100%
    tl.to(fillBarRef.current, {
      width: "100%",
      duration: 2.3,
      ease: "power2.inOut",
    }, 0);

    // 2. Roll Ones digit (Col 3) through all cycles to final 0
    tl.to(onesColRef.current, {
      yPercent: -(100 * 100 / 101),
      duration: 2.3,
      ease: "power2.inOut",
    }, 0);

    // 3. Roll Tens digit (Col 2) from 0 to 0 (index 10)
    tl.to(tensColRef.current, {
      yPercent: -(100 * 10 / 11),
      duration: 2.3,
      ease: "power2.inOut",
    }, 0);

    // 4. Roll Hundreds digit (Col 1) from 0 to 1 at the climax of Stage 1
    tl.to(hundredsColRef.current, {
      yPercent: -50,
      duration: 0.35,
      ease: "power2.out",
    }, 2.0);

    // ==========================================
    // STAGE 2: Morph Bar into Geometric "L" Shape (At 100%)
    // Duration: ~0.45s, Ease: "expo.out"
    // ==========================================

    // 5. Dark-gray track background turns transparent
    tl.to(trackRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: "power1.out",
    }, 2.35);

    // 6. Make vertical stem visible and shoot upward from 40px to 160px
    tl.set(verticalStemRef.current, {
      opacity: 1,
    }, 2.35);

    tl.to(verticalStemRef.current, {
      height: 160,
      duration: 0.45,
      ease: "expo.out",
    }, 2.35);

    // 7. Adjust horizontal leg to 180px for classic geometric L proportion
    tl.to(fillBarRef.current, {
      width: 180,
      duration: 0.45,
      ease: "expo.out",
    }, 2.35);

    // 8. Simultaneously, bottom-left "100" counter slides down & fades out
    tl.to(counterContainerRef.current, {
      yPercent: 100,
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
    }, 2.35);

    // ==========================================
    // STAGE 3: Massive Scale-Up & Website Reveal
    // Duration: ~0.7s, Ease: "expo.inOut"
    // ==========================================

    // 9. Zoom/Scale the geometric "L" shape into camera (scale: 75)
    tl.to(lShapeContainerRef.current, {
      scale: 75,
      duration: 0.7,
      ease: "expo.inOut",
    }, 2.85);

    // 10. Fade out the entire preloader overlay as white engulfs the screen
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
    }, 3.15);

  }, { scope: overlayRef, dependencies: [isAdmin] });

  if (isAdmin || !isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-[#000000] overflow-hidden select-none pointer-events-auto"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Center Progress Bar & Morphing Geometric "L" Shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div
          ref={lShapeContainerRef}
          className="relative w-[240px] h-[160px] flex items-end will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          {/* Dark Gray Track (240px x 40px at bottom) */}
          <div
            ref={trackRef}
            className="absolute bottom-0 left-0 w-[240px] h-[40px] bg-[#333333] overflow-hidden"
          >
            {/* Solid White Fill Bar (Fills 0% to 100% in Stage 1) */}
            <div
              ref={fillBarRef}
              className="h-full bg-white will-change-[width] origin-left"
              style={{ width: "0%" }}
            />
          </div>

          {/* Vertical Stem of "L" (40px wide, shoots up to 160px height in Stage 2) */}
          <div
            ref={verticalStemRef}
            className="absolute bottom-0 left-0 w-[40px] bg-white will-change-[height] origin-bottom z-20"
            style={{ height: "40px", opacity: 0 }}
          />
        </div>
      </div>

      {/* Bottom-Left Odometer Counter (000 to 100) */}
      <div
        ref={counterContainerRef}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 z-20 will-change-transform"
      >
        <div className="flex items-center text-[clamp(4rem,10vw,8.5rem)] font-medium text-white leading-none tracking-tight font-sans tabular-nums select-none">
          {/* Hundreds Digit Column (0 -> 1) */}
          <div className="h-[1em] overflow-hidden relative inline-flex">
            <div ref={hundredsColRef} className="flex flex-col will-change-transform">
              {hundreds.map((d, i) => (
                <span key={i} className="h-[1em] flex items-center justify-center leading-none">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Tens Digit Column (0 -> 9 -> 0) */}
          <div className="h-[1em] overflow-hidden relative inline-flex">
            <div ref={tensColRef} className="flex flex-col will-change-transform">
              {tens.map((d, i) => (
                <span key={i} className="h-[1em] flex items-center justify-center leading-none">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Ones Digit Column (0 -> 9 rolling 10 times -> 0) */}
          <div className="h-[1em] overflow-hidden relative inline-flex">
            <div ref={onesColRef} className="flex flex-col will-change-transform">
              {ones.map((d, i) => (
                <span key={i} className="h-[1em] flex items-center justify-center leading-none">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
