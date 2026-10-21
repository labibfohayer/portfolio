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

  const lWrapperRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);
  const lVerticalRef = useRef<HTMLDivElement>(null);
  const lHorizontalRef = useRef<HTMLDivElement>(null);

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
        // Unlock body scroll
        document.body.style.overflow = "";

        // Completely hide overlay so website beneath is fully interactive
        if (overlayRef.current) {
          overlayRef.current.style.display = "none";
          overlayRef.current.style.pointerEvents = "none";
        }
        setIsLoading(false);

        // Refresh ScrollTrigger calculations for underlying sections
        if (typeof window !== "undefined") {
          ScrollTrigger.refresh();
        }
      },
    });

    // -------------------------------------------------------------
    // FIX 1 & STEP A: Progress Fill & Counter (0s to 2.2s)
    // -------------------------------------------------------------
    const progressObj = { val: 0 };
    let lastVal = -1;

    // 1. Counter animation (000 to 100)
    tl.to(
      progressObj,
      {
        val: 100,
        duration: 2.2,
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

    // 2. Center bar l-vertical fills from 0px to 200px (100%)
    tl.fromTo(
      lVerticalRef.current,
      { width: "0px" },
      {
        width: "200px",
        duration: 2.2,
        ease: "power2.inOut",
      },
      0
    );

    // -------------------------------------------------------------
    // FIX 2 - STEP B: Morph into Geometric "L" Shape (at 2.2s)
    // -------------------------------------------------------------
    // a) bar-track fades out immediately
    tl.to(
      barTrackRef.current,
      {
        opacity: 0,
        duration: 0.1,
        ease: "power1.out",
      },
      2.2
    );

    // b) l-vertical width shrinks to 36px and height shoots up to 110px
    tl.to(
      lVerticalRef.current,
      {
        width: 36,
        height: 110,
        duration: 0.45,
        ease: "expo.out",
      },
      2.2
    );

    // c) l-horizontal expands out to 74px from left: 36px
    tl.to(
      lHorizontalRef.current,
      {
        width: 74,
        duration: 0.45,
        ease: "expo.out",
      },
      2.2
    );

    // d) Center the resulting 110px x 110px "L" shape perfectly in the screen
    tl.to(
      lWrapperRef.current,
      {
        x: 45,
        y: 37,
        duration: 0.45,
        ease: "expo.out",
      },
      2.2
    );

    // e) Bottom-left counter slides down and disappears
    tl.to(
      counterContainerRef.current,
      {
        yPercent: 110,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      2.2
    );

    // -------------------------------------------------------------
    // STEP C: Pause briefly for 0.15s (2.65s to 2.80s)
    // -------------------------------------------------------------

    // -------------------------------------------------------------
    // STEP D: Massive Scale-Up & Website Reveal (at 2.80s)
    // -------------------------------------------------------------
    // Zoom "L" shape into camera (scale: 85)
    tl.to(
      lWrapperRef.current,
      {
        scale: 85,
        rotation: 0,
        duration: 0.75,
        ease: "expo.inOut",
      },
      2.8
    );

    // Preloader overlay fades out in final 0.3s as white covers viewport
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      3.25
    );
  }, { scope: overlayRef, dependencies: [isAdmin] });

  if (isAdmin || !isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-[#000000] overflow-hidden select-none pointer-events-auto"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Center Loader: Morphing Geometric "L" Shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div
          ref={lWrapperRef}
          className="relative flex items-center justify-center will-change-transform"
          style={{
            position: "relative",
            width: "200px",
            height: "36px",
            transformOrigin: "55px -19px",
          }}
        >
          {/* Gray Track Background */}
          <div
            ref={barTrackRef}
            className="absolute inset-0 bg-[#333333] will-change-opacity"
            style={{
              position: "absolute",
              inset: 0,
              background: "#333333",
            }}
          />

          {/* l-vertical: Left side vertical block */}
          <div
            ref={lVerticalRef}
            className="absolute bg-[#ffffff] will-change-[width,height]"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "0%",
              height: "36px",
              background: "#ffffff",
              transformOrigin: "left bottom",
            }}
          />

          {/* l-horizontal: Right side horizontal block */}
          <div
            ref={lHorizontalRef}
            className="absolute bg-[#ffffff] will-change-[width]"
            style={{
              position: "absolute",
              left: "36px",
              bottom: 0,
              width: "0px",
              height: "36px",
              background: "#ffffff",
              transformOrigin: "left bottom",
            }}
          />
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
