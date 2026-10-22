"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  Diamond, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Compass,
  Globe
} from "lucide-react";

interface BulletItem {
  text: string;
  highlight: string | null;
  postText?: string;
}

interface Milestone {
  id: string;
  phase: string;
  role: string;
  company: string;
  date: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  bulletItems: BulletItem[];
  tech: string[];
  metric: { value: string; label: string };
  // 3D camera vantage point coordinates for this milestone
  cameraPos: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  planetCoord: { x: number; y: number; z: number };
}

interface PlanetSpawnOffset {
  x: number;
  y: number;
  rY: number;
  rX: number;
}

const defaultOffsets: PlanetSpawnOffset[] = [
  { x: -260, y: -80, rY: 25, rX: -10 },
  { x: -120, y: 160, rY: 18, rX: 16 },
  { x: 160, y: -130, rY: -20, rX: -14 },
  { x: 240, y: 110, rY: -25, rX: 12 }
];

const experiences: Milestone[] = [
  {
    id: "01",
    phase: "PHASE 01",
    role: "FOUNDER & CEO",
    company: "WEBPULSE AUTOMATION",
    date: "2024 - Present",
    title: "ARCHITECTED PROPRIETARY MULTI-AGENT SYNTHESIS ENGINE",
    description: "Built the core infrastructure for an automation agency that replaces manual workflows with autonomous AI systems.",
    problem: "Businesses faced heavy operational friction from manual customer handling, repetitive inquiry queues, and slow delivery velocities.",
    solution: "Engineered an event-driven multi-agent synthesis engine with autonomous LLM bots, webhook triggers, and high-performance Next.js architectures.",
    impact: "Reduced client query response times by 90%, automated complex B2B inquiry pipelines, and scaled operations across multiple enterprise clients.",
    bulletItems: [
      { text: "Led full-stack development of enterprise web applications", highlight: null },
      { text: "Engineered automated chatbots ", highlight: "reducing response times by 90%", postText: "" },
      { text: "Scaled business operations to serve ", highlight: "multiple B2B enterprise clients", postText: "" }
    ],
    tech: ["Next.js", "Python", "FastAPI", "OpenAI / Claude", "Vercel"],
    metric: { value: "90%", label: "Faster Response Time" },
    planetCoord: { x: -3.5, y: 1.0, z: -0.5 },
    cameraPos: { x: -2.8, y: 1.5, z: 9.0 },
    lookAt: { x: -1.5, y: 0.4, z: 0 }
  },
  {
    id: "02",
    phase: "PHASE 02",
    role: "AI AUTOMATION ENGINEER",
    company: "FREELANCE / CONSULTING",
    date: "2023 - Present",
    title: "DEPLOYED AUTONOMOUS WORKFLOWS FOR 10+ BUSINESSES",
    description: "Consulted and developed specialized automation scripts to compress execution timelines for startups and SMEs.",
    problem: "Startups and small businesses were bogged down by manual data entry, fragmented third-party tools, and slow release cycles.",
    solution: "Integrated state-of-the-art OpenAI and Gemini APIs into bespoke web systems, creating self-healing web scrapers and automated serverless pipelines.",
    impact: "Successfully automated operations for 10+ businesses, eliminating 100+ weekly manual work hours with 99.9% pipeline reliability.",
    bulletItems: [
      { text: "Integrated ", highlight: "OpenAI/Gemini APIs", postText: " into custom SaaS platforms" },
      { text: "Automated end-to-end data pipelines for ", highlight: "10+ BUSINESSES", postText: "" },
      { text: "Optimized resilient cloud deployments on ", highlight: "Vercel and AWS Lambda", postText: "" }
    ],
    tech: ["OpenAI API", "Gemini", "Node.js", "AWS Lambda", "Puppeteer"],
    metric: { value: "10+", label: "Businesses Automated" },
    planetCoord: { x: -1.0, y: -0.9, z: 0.6 },
    cameraPos: { x: -0.6, y: -0.8, z: 9.2 },
    lookAt: { x: 0.0, y: -0.3, z: 0 }
  },
  {
    id: "03",
    phase: "PHASE 03",
    role: "LEAD DEVELOPER",
    company: "BD MESS (PRODUCT)",
    date: "2023 - 2024",
    title: "ENGINEERED A SMART MANAGEMENT PLATFORM FOR 500+ USERS",
    description: "Architected a comprehensive SaaS solution for student accommodations to manage meals, rent, and utility bills.",
    problem: "Shared accommodations suffered from contentious manual ledger sheets, recurring meal calculation disputes, and delayed utility collections.",
    solution: "Designed and built an automated multi-variable ledger algorithm with real-time Firebase state sync and an intuitive mobile-first React UI.",
    impact: "Scaled to 500+ active residents with zero calculation disputes, sub-second ledger updates, and automated digital receipts.",
    bulletItems: [
      { text: "Developed complex bill splitting algorithms with ", highlight: "zero drift", postText: "" },
      { text: "Implemented real-time state sync for ", highlight: "500+ ACTIVE RESIDENTS", postText: "" },
      { text: "Designed a high-conversion ", highlight: "mobile-first React interface", postText: "" }
    ],
    tech: ["React.js", "Firebase Realtime DB", "Tailwind CSS", "Algorithms"],
    metric: { value: "500+", label: "Active Residents" },
    planetCoord: { x: 1.8, y: 1.3, z: -0.5 },
    cameraPos: { x: 1.8, y: 1.5, z: 8.8 },
    lookAt: { x: 1.0, y: 0.5, z: 0 }
  },
  {
    id: "04",
    phase: "PHASE 04",
    role: "E-COMMERCE ARCHITECT",
    company: "PONYOPURI",
    date: "2022 - 2023",
    title: "BUILT AND SCALED A HIGH-CONVERSION E-COMMERCE STORE",
    description: "Developed a modern, responsive digital storefront focused on user experience and direct WhatsApp integrations.",
    problem: "Standard multi-step checkout funnels in the local market resulted in high cart abandonment due to payment friction and login walls.",
    solution: "Architected a high-speed digital storefront with a zero-friction 'Order via WhatsApp' checkout flow, instant catalog search, and optimized SEO.",
    impact: "Boosted direct sales conversion rates by 40%, achieved sub-second page transitions, and streamlined product inventory management.",
    bulletItems: [
      { text: "Engineered 1-tap WhatsApp checkout ", highlight: "boosting conversion by 40%", postText: "" },
      { text: "Optimized frontend for ", highlight: "sub-second render speeds", postText: " & SEO" },
      { text: "Streamlined inventory management with ", highlight: "zero transaction drift", postText: "" }
    ],
    tech: ["React", "Node.js", "WhatsApp Business API", "SEO Engine"],
    metric: { value: "+40%", label: "Conversion Rate" },
    planetCoord: { x: 4.0, y: -0.5, z: 0.8 },
    cameraPos: { x: 3.2, y: -0.6, z: 9.2 },
    lookAt: { x: 2.2, y: -0.2, z: 0 }
  }
];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [spawnOrigin, setSpawnOrigin] = useState<PlanetSpawnOffset>(defaultOffsets[0]);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const card3DRef = useRef<HTMLDivElement>(null);

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetGroupsRef = useRef<THREE.Group[]>([]);
  const lookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(-1.5, 0.4, 0));
  const isVisibleRef = useRef<boolean>(true);
  const animFrameId = useRef<number>(0);

  // 120 FPS High-Frequency Mouse Tilt Spring Coordinates
  const targetTiltX = useRef(0);
  const targetTiltY = useRef(0);
  const currentTiltX = useRef(0);
  const currentTiltY = useRef(0);

  // Framer Motion Mouse Spotlight Coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ---------------------------------------------------------------------------
  // 1. COMPUTE PLANET SCREEN COORDINATES (FOR EMERGENCE ANCHORING)
  // ---------------------------------------------------------------------------
  const computeSpawnOffset = useCallback((index: number): PlanetSpawnOffset => {
    const camera = cameraRef.current;
    const planetGroup = planetGroupsRef.current[index];
    const cardEl = card3DRef.current;
    if (!camera || !planetGroup || !cardEl || typeof window === "undefined") {
      return defaultOffsets[index] || defaultOffsets[0];
    }

    const worldPos = new THREE.Vector3();
    planetGroup.getWorldPosition(worldPos);

    // Project 3D planet position to Normalized Device Coordinates (-1 to +1)
    const ndc = worldPos.clone().project(camera);

    // Get current card center in window pixels
    const cardRect = cardEl.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    // Convert NDC to screen pixel coordinates
    const planetScreenX = (ndc.x * 0.5 + 0.5) * window.innerWidth;
    const planetScreenY = (-ndc.y * 0.5 + 0.5) * window.innerHeight;

    const offsetX = planetScreenX - cardCenterX;
    const offsetY = planetScreenY - cardCenterY;

    const isMobile = window.innerWidth < 1024;
    return {
      x: isMobile ? Math.max(-40, Math.min(40, offsetX * 0.3)) : offsetX,
      y: isMobile ? Math.max(-60, Math.min(60, offsetY * 0.3)) : offsetY,
      rY: isMobile ? 0 : (offsetX < 0 ? 25 : -25),
      rX: isMobile ? -8 : (offsetY < 0 ? -16 : 16)
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. THREE.JS 3D SCENE & 120 FPS RENDERING LOOP INITIALIZATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || 850;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialMilestone = experiences[0];
    camera.position.set(
      initialMilestone.cameraPos.x,
      initialMilestone.cameraPos.y,
      initialMilestone.cameraPos.z
    );
    camera.lookAt(lookAtRef.current);
    cameraRef.current = camera;

    // High-Performance WebGL Renderer (120 FPS Capable)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // Subtle 3D Depth Wireframe Grid
    const grid = new THREE.GridHelper(45, 45, 0x06b6d4, 0x083344);
    grid.position.y = -3.8;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    scene.add(grid);

    // Floating Ambient Dust Particles (500 depth stars)
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------------------
    // 4 DISTINCT HIGH-DETAIL CELESTIAL CYBER-PLANETS
    // -------------------------------------------------------------------------
    const planetGroups: THREE.Group[] = [];

    experiences.forEach((exp, idx) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(exp.planetCoord.x, exp.planetCoord.y, exp.planetCoord.z);

      let coreMesh: THREE.Mesh;
      let outerMesh: THREE.Mesh | null = null;
      let ring1: THREE.Mesh | null = null;
      let ring2: THREE.Mesh | null = null;
      let moonMesh: THREE.Mesh | null = null;

      if (idx === 0) {
        // Planet 01: Webpulse (Cyan Autonomous Synth Planet)
        const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x03141f,
          emissive: 0x06b6d4,
          emissiveIntensity: 1.1,
          roughness: 0.15,
          metalness: 0.9
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        pGroup.add(coreMesh);

        // Cybernetic Outer Wireframe Cage
        const wireGeo = new THREE.IcosahedronGeometry(0.92, 2);
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x22d3ee,
          wireframe: true,
          transparent: true,
          opacity: 0.4
        });
        outerMesh = new THREE.Mesh(wireGeo, wireMat);
        pGroup.add(outerMesh);

        // Equatorial Planetary Ring
        const rGeo = new THREE.TorusGeometry(1.25, 0.025, 16, 64);
        const rMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
        ring1 = new THREE.Mesh(rGeo, rMat);
        ring1.rotation.x = Math.PI / 2.8;
        pGroup.add(ring1);

      } else if (idx === 1) {
        // Planet 02: Freelance (Electric Azure Gyroscope Planet)
        const coreGeo = new THREE.SphereGeometry(0.76, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x04192b,
          emissive: 0x00f0ff,
          emissiveIntensity: 1.2,
          roughness: 0.1,
          metalness: 0.95
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        pGroup.add(coreMesh);

        // Dual Orbiting Gyro-Rings
        const r1Geo = new THREE.TorusGeometry(1.35, 0.03, 16, 64);
        const r1Mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.8 });
        ring1 = new THREE.Mesh(r1Geo, r1Mat);
        ring1.rotation.x = Math.PI / 3;
        pGroup.add(ring1);

        const r2Geo = new THREE.TorusGeometry(1.55, 0.025, 16, 64);
        const r2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 });
        ring2 = new THREE.Mesh(r2Geo, r2Mat);
        ring2.rotation.y = Math.PI / 2.5;
        pGroup.add(ring2);

        // Orbiting Satellite Moon
        const mGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const mMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        moonMesh = new THREE.Mesh(mGeo, mMat);
        pGroup.add(moonMesh);

      } else if (idx === 2) {
        // Planet 03: BD Mess (Emerald / Teal Matrix Core Planet)
        const coreGeo = new THREE.IcosahedronGeometry(0.74, 1);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x02201c,
          emissive: 0x10b981,
          emissiveIntensity: 1.1,
          roughness: 0.2,
          metalness: 0.85
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        pGroup.add(coreMesh);

        // Dodecahedron Outer Matrix Shield
        const wireGeo = new THREE.DodecahedronGeometry(0.98, 1);
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          wireframe: true,
          transparent: true,
          opacity: 0.45
        });
        outerMesh = new THREE.Mesh(wireGeo, wireMat);
        pGroup.add(outerMesh);

        // Planetary Ring
        const rGeo = new THREE.TorusGeometry(1.38, 0.028, 16, 64);
        const rMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.75 });
        ring1 = new THREE.Mesh(rGeo, rMat);
        ring1.rotation.x = -Math.PI / 3;
        pGroup.add(ring1);

      } else {
        // Planet 04: Ponyopuri (Violet / Cyan Celestial Pulsar)
        const coreGeo = new THREE.SphereGeometry(0.74, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x150b29,
          emissive: 0xa855f7,
          emissiveIntensity: 1.2,
          roughness: 0.15,
          metalness: 0.9
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        pGroup.add(coreMesh);

        // Broad Planetary Ring Disc
        const rGeo = new THREE.RingGeometry(1.1, 1.65, 48);
        const rMat = new THREE.MeshBasicMaterial({
          color: 0xc084fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55
        });
        ring1 = new THREE.Mesh(rGeo, rMat);
        ring1.rotation.x = Math.PI / 2.3;
        pGroup.add(ring1);
      }

      // Shockwave Ejection Portal Ring (Fires when card emerges from planet!)
      const shockwaveGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 64);
      const shockwaveMat = new THREE.MeshBasicMaterial({
        color: idx === 2 ? 0x34d399 : idx === 3 ? 0xc084fc : 0x22d3ee,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
      shockwave.scale.set(0.1, 0.1, 0.1);
      pGroup.add(shockwave);

      // Planet Point Light
      const light = new THREE.PointLight(
        idx === 2 ? 0x10b981 : idx === 3 ? 0xa855f7 : 0x06b6d4,
        idx === 0 ? 3.5 : 1.2,
        8
      );
      pGroup.add(light);

      pGroup.userData = {
        coreMesh,
        outerMesh,
        ring1,
        ring2,
        moonMesh,
        shockwave,
        shockwaveMat,
        light,
        rotSpeed: 0.45 + idx * 0.15,
        moonAngle: 0
      };

      scene.add(pGroup);
      planetGroups.push(pGroup);
    });
    planetGroupsRef.current = planetGroups;

    // Laser Connector Spline Connecting All 4 Planets
    const splineCurve = new THREE.CatmullRomCurve3(
      experiences.map(e => new THREE.Vector3(e.planetCoord.x, e.planetCoord.y, e.planetCoord.z))
    );
    const splineGeo = new THREE.BufferGeometry().setFromPoints(splineCurve.getPoints(80));
    const splineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45
    });
    const splineLine = new THREE.Line(splineGeo, splineMat);
    scene.add(splineLine);

    // Traveling Energy Pulse on the Spline
    const pulseMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    scene.add(pulseMesh);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x06b6d4, 1.3);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!canvas || !canvas.parentElement || !camera || !renderer) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener("resize", handleResize);

    // IntersectionObserver to pause loop when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // -------------------------------------------------------------------------
    // 120 FPS UNLOCKED ANIMATION LOOP
    // -------------------------------------------------------------------------
    let lastTime = performance.now();
    let pulseT = 0;

    const animate = (currentTime: number) => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Rotate ambient starfield
      particles.rotation.y += delta * 0.03;

      // Animate Celestial Planet Orbs & Orbiting Rings
      planetGroups.forEach((group) => {
        const u = group.userData;
        if (u.coreMesh) {
          u.coreMesh.rotation.y += delta * u.rotSpeed;
          u.coreMesh.rotation.x += delta * (u.rotSpeed * 0.4);
        }
        if (u.outerMesh) {
          u.outerMesh.rotation.y -= delta * (u.rotSpeed * 0.6);
          u.outerMesh.rotation.z += delta * (u.rotSpeed * 0.3);
        }
        if (u.ring1) {
          u.ring1.rotation.z -= delta * (u.rotSpeed * 0.5);
        }
        if (u.ring2) {
          u.ring2.rotation.x += delta * (u.rotSpeed * 0.6);
        }
        if (u.moonMesh) {
          u.moonAngle += delta * 1.8;
          u.moonMesh.position.x = Math.cos(u.moonAngle) * 1.85;
          u.moonMesh.position.z = Math.sin(u.moonAngle) * 1.85;
          u.moonMesh.position.y = Math.sin(u.moonAngle * 2) * 0.4;
        }
      });

      // Animate Traveling Energy Pulse safely
      pulseT = (pulseT + delta * 0.2) % 1;
      const safeT = Math.max(0, Math.min(0.999, pulseT));
      try {
        const pulsePt = splineCurve.getPoint(safeT);
        if (pulsePt && typeof pulsePt.x === "number") {
          pulseMesh.position.copy(pulsePt);
        }
      } catch {
        // fallback
      }

      // Smooth 120 FPS Spring Interpolation for Card Tilt (Desktop)
      currentTiltX.current += (targetTiltX.current - currentTiltX.current) * 0.12;
      currentTiltY.current += (targetTiltY.current - currentTiltY.current) * 0.12;

      if (card3DRef.current && window.innerWidth >= 1024) {
        card3DRef.current.style.transform = `perspective(1500px) rotateX(${currentTiltX.current.toFixed(2)}deg) rotateY(${currentTiltY.current.toFixed(2)}deg)`;
      }

      // Camera orientation update
      if (cameraRef.current && lookAtRef.current) {
        cameraRef.current.lookAt(lookAtRef.current);
      }

      renderer.render(scene, camera);
    };

    animFrameId.current = requestAnimationFrame(animate);

    // Initial shockwave on Planet 01 when section mounts
    setTimeout(() => {
      const p0 = planetGroups[0]?.userData;
      if (p0?.shockwave && p0?.shockwaveMat) {
        p0.shockwave.scale.set(0.1, 0.1, 0.1);
        p0.shockwaveMat.opacity = 1;
        gsap.to(p0.shockwave.scale, { x: 4.5, y: 4.5, z: 4.5, duration: 1.2, ease: "power2.out" });
        gsap.to(p0.shockwaveMat, { opacity: 0, duration: 1.2, ease: "power2.out" });
      }
    }, 400);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      // Dispose Three.js Resources
      grid.geometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      splineGeo.dispose();
      splineMat.dispose();
      renderer.dispose();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. TRIGGER 3D PLANETARY EJECTION & CAMERA FLIGHT VIA GSAP
  // ---------------------------------------------------------------------------
  const switchCameraToMilestone = useCallback((index: number) => {
    const targetMilestone = experiences[index];
    const camera = cameraRef.current;
    if (!camera || !targetMilestone) return;

    // Smooth 3D camera pan to frame the selected planet
    gsap.to(camera.position, {
      x: targetMilestone.cameraPos.x,
      y: targetMilestone.cameraPos.y,
      z: targetMilestone.cameraPos.z,
      duration: 1.2,
      ease: "power2.inOut",
      overwrite: "auto"
    });

    // Smooth camera focal lookAt point
    gsap.to(lookAtRef.current, {
      x: targetMilestone.lookAt.x,
      y: targetMilestone.lookAt.y,
      z: targetMilestone.lookAt.z,
      duration: 1.2,
      ease: "power2.inOut",
      overwrite: "auto"
    });

    // Trigger explosive Planetary Shockwave Ejection on the selected planet!
    planetGroupsRef.current.forEach((group, idx) => {
      const isActive = idx === index;
      const u = group.userData;

      if (isActive) {
        // Expand planetary scale with elastic recoil
        gsap.to(group.scale, {
          x: 1.35,
          y: 1.35,
          z: 1.35,
          duration: 0.8,
          ease: "back.out(1.8)"
        });

        // Fire expanding shockwave portal ring out of the planet!
        if (u.shockwave && u.shockwaveMat) {
          u.shockwave.scale.set(0.1, 0.1, 0.1);
          u.shockwaveMat.opacity = 1;
          gsap.killTweensOf(u.shockwave.scale);
          gsap.killTweensOf(u.shockwaveMat);
          gsap.to(u.shockwave.scale, { x: 4.8, y: 4.8, z: 4.8, duration: 1.2, ease: "power2.out" });
          gsap.to(u.shockwaveMat, { opacity: 0, duration: 1.2, ease: "power2.out" });
        }

        // Flash planet core lighting
        if (u.light) {
          gsap.killTweensOf(u.light);
          gsap.fromTo(u.light, { intensity: 8.5 }, { intensity: 3.5, duration: 1.1, ease: "power2.out" });
        }
        if (u.coreMesh?.material) {
          gsap.to(u.coreMesh.material, { emissiveIntensity: 1.8, duration: 0.6 });
        }
      } else {
        // Inactive planets return to baseline
        gsap.to(group.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.8, ease: "power2.out" });
        if (u.coreMesh?.material) {
          gsap.to(u.coreMesh.material, { emissiveIntensity: 0.6, duration: 0.6 });
        }
        if (u.light) {
          gsap.to(u.light, { intensity: 1.2, duration: 0.6 });
        }
      }
    });
  }, []);

  // ---------------------------------------------------------------------------
  // 4. SELECTION & EMERGENCE COORDINATOR
  // ---------------------------------------------------------------------------
  const selectIndex = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    const origin = computeSpawnOffset(nextIndex);
    setSpawnOrigin(origin);
    setActiveIndex(nextIndex);
    switchCameraToMilestone(nextIndex);
  };

  const prevMilestone = () => {
    const next = activeIndex > 0 ? activeIndex - 1 : experiences.length - 1;
    const origin = computeSpawnOffset(next);
    setSpawnOrigin(origin);
    setActiveIndex(next);
    switchCameraToMilestone(next);
  };

  const nextMilestone = () => {
    const next = activeIndex < experiences.length - 1 ? activeIndex + 1 : 0;
    const origin = computeSpawnOffset(next);
    setSpawnOrigin(origin);
    setActiveIndex(next);
    switchCameraToMilestone(next);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft") {
        prevMilestone();
      } else if (e.key === "ArrowRight") {
        nextMilestone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // Mouse Move Tilt Tracking (Normalized -0.5 to 0.5)
  function handleCardMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    mouseX.set(x);
    mouseY.set(y);

    const normX = (x / width) - 0.5;
    const normY = (y / height) - 0.5;

    targetTiltY.current = normX * 8; // rotateY up to ±8deg
    targetTiltX.current = -normY * 6; // rotateX up to ±6deg
  }

  function handleCardMouseLeave() {
    targetTiltX.current = 0;
    targetTiltY.current = 0;
  }

  const activeExp = experiences[activeIndex];

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="scroll-mt-28 md:scroll-mt-32 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 relative z-10 bg-black overflow-hidden w-full max-w-full"
    >
      {/* ------------------------------------------------------------------- */}
      {/* THREE.JS BACKGROUND 3D WEBGL CANVAS WITH 4 CELESTIAL PLANETS       */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-90">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Background Ambience Radial Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-blue-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header with Quick Stage Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-12 gap-6 sm:gap-8 pb-6 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-auto max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase mb-3 sm:mb-4 bg-cyan-950/20 backdrop-blur-md">
              <Diamond size={12} className="text-cyan-400 animate-pulse" /> 3D PLANETARY ARCHITECTURE TIMELINE
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white mb-3">
              WHAT I'VE BUILT <br />
              <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">& SOLVED.</span>
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-lg">
              A chronological timeline connecting foundational business challenges with bespoke architectural solutions and quantifiable production outcomes.
            </p>
          </motion.div>

          {/* Interactive Stage Indicator & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase">PLANET STAGE:</span>
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1">
                {experiences.map((exp, idx) => (
                  <button
                    key={exp.id}
                    onClick={() => selectIndex(idx)}
                    aria-label={`Jump to Planet ${exp.phase}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === activeIndex 
                        ? "w-6 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                        : "w-2 h-2 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 ml-1">
                0{activeIndex + 1} / 0{experiences.length}
              </span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevMilestone}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                aria-label="Previous milestone"
                title="Previous milestone (←)"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMilestone}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                aria-label="Next milestone"
                title="Next milestone (→)"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Tab Strip (< 1024px) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x">
          {experiences.map((exp, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={exp.id}
                onClick={() => selectIndex(idx)}
                className={`snap-start shrink-0 px-3.5 py-2 rounded-xl text-left transition-all duration-300 flex items-center gap-2.5 border cursor-pointer ${
                  isActive
                    ? "bg-cyan-950/40 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" : "bg-neutral-600"}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase whitespace-nowrap">
                  {exp.phase}
                </span>
                <span className="text-[11px] font-semibold text-neutral-300 whitespace-nowrap">
                  {exp.company}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Split Timeline Layout (>= 1024px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Left Column: Interactive Chronological Timeline Rail (lg:col-span-4) */}
          <div className="hidden lg:block lg:col-span-4 relative pl-7 space-y-3">
            
            {/* Continuous Vertical Connector Rail */}
            <div className="absolute left-[9px] top-6 bottom-6 w-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="w-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                initial={false}
                animate={{
                  height: `${(activeIndex / (experiences.length - 1)) * 100}%`
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            {/* Milestone Phase Selector Cards */}
            {experiences.map((exp, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div key={exp.id} className="relative">
                  {/* Timeline Node Indicator on the Rail */}
                  <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                    <div 
                      className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? "w-5 h-5 bg-black border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] scale-110"
                          : "w-3 h-3 bg-black border border-white/30 hover:border-cyan-400/60"
                      }`}
                    >
                      {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Interactive Tab Button */}
                  <button
                    onClick={() => selectIndex(idx)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 relative group overflow-hidden border cursor-pointer ${
                      isActive
                        ? "bg-[#0a1219]/90 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.12)]"
                        : "bg-white/[0.02] border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Active Background Accent Glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent pointer-events-none transition-opacity duration-300" />
                    )}

                    <div className="relative z-10 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                            isActive ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-white/5 text-neutral-400"
                          }`}>
                            {exp.phase}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {exp.date}
                          </span>
                        </div>

                        {/* Metric Micro-Badge */}
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                            : "bg-white/5 text-neutral-400"
                        }`}>
                          {exp.metric.value}
                        </span>
                      </div>

                      <h4 className={`text-sm font-display font-bold uppercase tracking-tight transition-colors ${
                        isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                      }`}>
                        {exp.company}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                        <span>{exp.role}</span>
                        <ChevronRight 
                          size={13} 
                          className={`transition-all duration-200 ${
                            isActive ? "text-cyan-400 translate-x-0.5" : "text-neutral-600 group-hover:text-neutral-300"
                          }`} 
                        />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Keyboard & Spatial Hint */}
            <div className="pt-2 px-2 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Globe size={11} className="text-cyan-400" /> PLANETARY EMERGENCE
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 text-[9px]">
                ← / → KEYS
              </kbd>
            </div>
          </div>

          {/* Right Column: 3D Perspective Tilt Container (lg:col-span-8) */}
          <div 
            className="w-full lg:col-span-8"
            style={{ perspective: "1500px" }}
          >
            <div
              ref={card3DRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ 
                transformStyle: "preserve-3d",
                transition: "transform 0.08s ease-out"
              }}
              className="w-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExp.id}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.03,
                    x: spawnOrigin.x,
                    y: spawnOrigin.y,
                    z: -420,
                    rotateY: spawnOrigin.rY, 
                    rotateX: spawnOrigin.rX,
                    filter: "blur(18px) brightness(3.5)"
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    rotateY: 0, 
                    rotateX: 0,
                    filter: "blur(0px) brightness(1)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.05,
                    z: -300,
                    filter: "blur(12px) brightness(2)",
                    transition: { duration: 0.28, ease: "easeIn" }
                  }}
                  transition={{ 
                    duration: 0.82, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="glass-card rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-9 relative overflow-hidden group border border-white/10 hover:border-cyan-500/40 transition-colors duration-500 bg-[#070b0e]/95 hover:bg-[#080e13] backdrop-blur-2xl w-full shadow-[0_15px_50px_rgba(0,0,0,0.7)]"
                >
                  {/* Magnetic Specular Spotlight Hover Glow (Floating at Z: 15px) */}
                  <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[1.75rem] sm:rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      transform: "translateZ(15px)",
                      background: useMotionTemplate`
                        radial-gradient(
                          650px circle at ${mouseX}px ${mouseY}px,
                          rgba(var(--theme-rgb), 0.14),
                          transparent 80%
                        )
                      `,
                    }}
                  />

                  {/* ------------------------------------------------------------- */}
                  {/* SPATIAL 3D PRESERVE-3D FLOATING LAYERS                        */}
                  {/* ------------------------------------------------------------- */}
                  <div 
                    className="relative z-10 flex flex-col flex-grow"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    
                    {/* 1. Header Information Bar (Z: 35px) */}
                    <div 
                      className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 mb-6"
                      style={{ transform: "translateZ(35px)" }}
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Company Badge with Conic Glow */}
                        <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,rgb(var(--theme-rgb))_50%,#000000_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-cyan-950/80 px-3.5 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 backdrop-blur-3xl border border-cyan-500/30 group-hover:border-transparent transition-all duration-300">
                            {activeExp.company}
                          </span>
                        </div>

                        {/* Role Tag */}
                        <span className="text-[10px] font-mono text-neutral-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                          {activeExp.role}
                        </span>

                        {/* Phase Marker */}
                        <span className="text-[9px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                          {activeExp.phase}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Metric Highlight Pill */}
                        <div className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.18)]">
                          {activeExp.metric.value} <span className="text-[9px] text-neutral-400 font-normal">{activeExp.metric.label}</span>
                        </div>

                        {/* Date Tag */}
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                          <Calendar size={11} className="text-cyan-400" />
                          {activeExp.date}
                        </span>
                      </div>
                    </div>

                    {/* 2. Main Milestone Title & Executive Overview (Z: 45px) */}
                    <div 
                      className="mb-6"
                      style={{ transform: "translateZ(45px)" }}
                    >
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight mb-2.5 leading-snug group-hover:text-cyan-300 transition-colors duration-300">
                        {activeExp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
                        {activeExp.description}
                      </p>
                    </div>

                    {/* 3. Streamlined Problem ➔ Architecture ➔ Result Process Flow (Z: 38px) */}
                    <div 
                      className="mb-6 pt-5 border-t border-white/10"
                      style={{ transform: "translateZ(38px)", transformStyle: "preserve-3d" }}
                    >
                      <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2 mb-3">
                        <Sparkles size={12} className="text-cyan-400" /> SYSTEM EXECUTION PIPELINE
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        
                        {/* Step 1: Challenge / Problem */}
                        <div className="bg-rose-950/15 border border-rose-500/20 rounded-xl p-3.5 flex flex-col justify-between hover:border-rose-500/40 transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                                <AlertCircle size={10} className="text-rose-400" /> THE CHALLENGE
                              </span>
                              <span className="text-[9px] font-mono text-rose-400/60">STAGE 01</span>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed mt-1.5">
                              {activeExp.problem}
                            </p>
                          </div>
                        </div>

                        {/* Step 2: Architecture & Solution */}
                        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-400 transition-colors shadow-[0_0_20px_rgba(var(--theme-rgb),0.06)]">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                                <Cpu size={10} className="text-cyan-400" /> ARCHITECTURE & SOLUTION
                              </span>
                              <span className="text-[9px] font-mono text-cyan-400/60">STAGE 02</span>
                            </div>
                            <p className="text-xs text-neutral-200 leading-relaxed mt-1.5">
                              {activeExp.solution}
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Measurable Impact & Results */}
                        <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold tracking-wider uppercase">
                                <TrendingUp size={10} className="text-emerald-400" /> MEASURABLE IMPACT
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400/60">STAGE 03</span>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed mt-1.5">
                              {activeExp.impact}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-emerald-500/15 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">OUTCOME</span>
                            <span className="text-[10px] font-mono text-emerald-300 font-bold">{activeExp.metric.value}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* 4. Structured Impact Badges & Contributions (Z: 32px) */}
                    <div 
                      className="pt-4 border-t border-white/10 space-y-2.5"
                      style={{ transform: "translateZ(32px)" }}
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck size={12} className="text-cyan-400" /> KEY MILESTONE CONTRIBUTIONS & IMPACT
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {activeExp.bulletItems.map((bullet, i) => (
                          <div 
                            key={i} 
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors"
                          >
                            <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                            <span className="text-xs text-neutral-300 leading-relaxed">
                              {bullet.text}
                              {bullet.highlight && (
                                <span className="text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 inline-block mx-0.5 shadow-sm">
                                  {bullet.highlight}
                                </span>
                              )}
                              {bullet.postText}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* 5. Executive Footer Bar with Quick Switch CTA (Z: 40px) */}
                  <div 
                    className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">ROLE:</span>
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">{activeExp.role}</span>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {activeExp.tech.map((t, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Action: Next Milestone or Restart */}
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
                        <ShieldCheck size={13} className="text-cyan-400" />
                        <span className="text-[9px] font-mono font-bold tracking-widest uppercase">VERIFIED MILESTONE</span>
                      </div>

                      <button
                        onClick={nextMilestone}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 group/btn cursor-pointer"
                      >
                        {activeIndex < experiences.length - 1 ? (
                          <>
                            <span>NEXT PHASE</span>
                            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            <span>RESTART TIMELINE</span>
                            <RotateCcw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
