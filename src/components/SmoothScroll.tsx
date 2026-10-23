"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    lenisInstance?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Skip Lenis smooth scroll on admin dashboard for standard input/form behavior
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin || typeof window === "undefined") return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Instantiate Lenis with high-inertia 120 FPS momentum curve
    const lenis = new Lenis({
      duration: 1.2, // Cinematic inertia glide duration
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve for velvet-smooth stop
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, // 1:1 responsive input
      touchMultiplier: 1.2,
      infinite: false,
      autoRaf: false, // Driven by GSAP ticker for locked 120 FPS synchronization
    });

    lenisRef.current = lenis;
    window.lenisInstance = lenis;

    // 1. Tell ScrollTrigger whenever Lenis updates scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis's raf via GSAP's ticker (unlocked to screen refresh rate: 120/144/240Hz)
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // 3. Disable lag smoothing in GSAP to prevent momentum skips or jumpy frames
    gsap.ticker.lagSmoothing(0);

    // 4. Intercept anchor link clicks to use Lenis momentum scroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -60,
            duration: 1.3,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    // Refresh ScrollTrigger after DOM settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      window.lenisInstance = undefined;
    };
  }, [isAdmin]);

  return <>{children}</>;
}
