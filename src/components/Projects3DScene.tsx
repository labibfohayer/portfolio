"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ExternalLink, 
  CheckCircle2, 
  Code2, 
  Sparkles, 
  Layers, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  ChevronDown
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================================================
// 1. DATA DEFINITIONS & RICH METADATA
// =========================================================================
interface ProjectItem {
  id: string;
  title: string;
  role: string;
  desc: string;
  tech: string[];
  image?: string;
  isMobile?: boolean;
  metricBadges: string[];
  contributions: string[];
  liveUrl: string;
  githubUrl: string;
  themeColor: string;
  accentHex: number;
}

const defaultProjectsData: ProjectItem[] = [
  {
    id: "01",
    title: "WEBPULSE AUTOMATION",
    role: "AGENCY PLATFORM & AUTOMATION",
    desc: "A scalable tech agency platform offering custom web development and smart workflow automations to help businesses scale effortlessly.",
    tech: ["NEXT.JS", "REACT", "TAILWIND CSS", "AUTOMATION"],
    metricBadges: ["⚡ <100ms Latency", "🤖 Automated Pipeline", "99.9% Uptime"],
    contributions: [
      "Architected the entire agency landing page and service workflows.",
      "Integrated automated pipelines for lead generation and business scaling.",
      "Engineered ultra-fast UI with modern glassmorphism and animations."
    ],
    liveUrl: "https://webpulseautomation.com",
    githubUrl: "https://github.com/labibfohayer/webpulse-agency",
    themeColor: "#06b6d4",
    accentHex: 0x06b6d4
  },
  {
    id: "02",
    title: "AL MADINA MADRASA",
    role: "INSTITUTIONAL WEBSITE & MANAGEMENT",
    desc: "Complete digital presence and automation foundation for Al Madina Model Madrasa & Research Institute.",
    tech: ["REACT", "TAILWIND", "NODE.JS", "DATABASE"],
    metricBadges: ["⚡ 99/100 Lighthouse", "🏛️ 100% Online Admissions"],
    contributions: [
      "Built a highly responsive and fast public-facing institutional website.",
      "Set up the foundational architecture for student and staff data routing.",
      "Modernized the digital branding and online admission processes."
    ],
    liveUrl: "https://almadinamodelmadrasa.com",
    githubUrl: "https://github.com/labibfohayer",
    themeColor: "#10b981",
    accentHex: 0x10b981
  },
  {
    id: "03",
    title: "MADRASA OS",
    role: "INSTITUTIONAL OPERATING SYSTEM",
    desc: "A comprehensive management dashboard for madrasas covering student tracking, attendance, fees, staff payroll, and daily operations.",
    tech: ["FULL-STACK", "DASHBOARD UI", "API ARCHITECTURE", "SECURITY"],
    metricBadges: ["🛡️ Zero-Trust RBAC", "👥 1,000+ Active Base"],
    contributions: [
      "Engineered a centralized dashboard for managing 1000+ students and staff.",
      "Automated complex fee collection, daily accounting, and attendance tracking.",
      "Built role-based access control (RBAC) for admins, teachers, and parents."
    ],
    liveUrl: "https://madrasa-os-demo.vercel.app",
    githubUrl: "https://github.com/labibfohayer",
    themeColor: "#8b5cf6",
    accentHex: 0x8b5cf6
  },
  {
    id: "04",
    title: "BD MESS",
    role: "SMART LIVING & MEAL MANAGEMENT SYSTEM",
    desc: "A modern, high-craft living platform featuring automated utility splitting, meal calculation, and streamlined resident management flow.",
    tech: ["REACT.JS", "TAILWIND CSS", "FIREBASE", "ALGORITHMS"],
    metricBadges: ["⚡ <50ms Sync", "📊 Zero-Drift Ledger"],
    contributions: [
      "Architected an interactive dashboard with instant metrics and state persistence.",
      "Engineered responsive visual aesthetics with fluid mobile-first UX.",
      "Optimized build pipeline and automated complex billing calculations."
    ],
    liveUrl: "https://bd-mess.vercel.app",
    githubUrl: "https://github.com/labibfohayer",
    themeColor: "#f59e0b",
    accentHex: 0xf59e0b
  },
  {
    id: "05",
    title: "EXPENSE TRACKER",
    role: "FINANCIAL ANALYTICS & ACCOUNTING",
    desc: "Production financial tracking and analytics platform featuring daily safe limits, digital vaults, and real-time computation.",
    tech: ["NEXT.JS", "TYPESCRIPT", "REST API", "FRAMER MOTION"],
    metricBadges: ["⚡ <100ms Ingestion", "📈 Real-Time Charts"],
    contributions: [
      "Built resilient microservices architecture for safe expense tracking.",
      "Engineered dynamic real-time expenditure charts with category breakdown.",
      "Ensured 99.9% uptime with zero-friction database communication."
    ],
    liveUrl: "https://expense-tracker-iota-blush.vercel.app",
    githubUrl: "https://github.com/labibfohayer",
    themeColor: "#00f5d4",
    accentHex: 0x00f5d4
  },
  {
    id: "06",
    title: "PONYOPURI E-COMMERCE",
    role: "SCALABLE DIGITAL STOREFRONT",
    desc: "Custom high-performance storefront that handles inventory management and direct WhatsApp ordering workflows.",
    tech: ["E-COMMERCE", "NODE.JS", "PAYMENT GATEWAYS", "REACT"],
    metricBadges: ["⚡ Sub-Second Load", "🛍️ 1-Click WA Checkout"],
    contributions: [
      "Orchestrated seamless checkout flows with instant WhatsApp conversion.",
      "Created highly optimized product grids with sub-second render speeds.",
      "Designed responsive mobile layout ensuring maximum conversion and fast load speeds."
    ],
    liveUrl: "https://ponyopuri.com",
    githubUrl: "https://github.com/labibfohayer",
    themeColor: "#ec4899",
    accentHex: 0xec4899
  }
];

// Helper: GitHub SVG icon
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// =========================================================================
// 2. PROCEDURAL 3D CLUSTER GENERATORS
// =========================================================================

// Project 01: Webpulse Automation (Agentic Core with Gyro Rings)
function createWebpulseCluster(): THREE.Group {
  const group = new THREE.Group();
  
  // Outer Gyro Rings
  const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.9,
  });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.x = Math.PI / 2;
  group.add(ring1, ring2);

  // Central Icosahedron Geodesic Core
  const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Solid Inner Jewel
  const jewelGeo = new THREE.OctahedronGeometry(0.5);
  const jewelMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.0,
    metalness: 0.9,
    roughness: 0.1,
  });
  const jewel = new THREE.Mesh(jewelGeo, jewelMat);
  group.add(jewel);

  // Orbiting Satellite Data Nodes
  const satGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
  const satMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 1.2 });
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const sat = new THREE.Mesh(satGeo, satMat);
    sat.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
    group.add(sat);
  }

  // Point Light
  const light = new THREE.PointLight(0x06b6d4, 3, 8);
  group.add(light);

  group.userData = {
    animate: (delta: number) => {
      ring1.rotation.y += delta * 0.8;
      ring2.rotation.x += delta * 0.6;
      core.rotation.y -= delta * 0.4;
      jewel.rotation.x += delta * 1.2;
    }
  };

  return group;
}

// Project 02: Al Madina Madrasa (Rotunda Sanctuary with Knowledge Ring)
function createAlMadinaCluster(): THREE.Group {
  const group = new THREE.Group();

  // Octagonal Sanctuary Base
  const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.3, 8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0f2a24,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x047857,
    emissiveIntensity: 0.3
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.7;
  group.add(base);

  // 8 Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8, roughness: 0.2 });
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const p = new THREE.Mesh(pillarGeo, pillarMat);
    p.position.set(Math.cos(angle) * 0.9, -0.1, Math.sin(angle) * 0.9);
    group.add(p);
  }

  // Dome Roof
  const domeGeo = new THREE.SphereGeometry(0.75, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.7,
    metalness: 0.9,
    roughness: 0.15,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.y = 0.45;
  group.add(dome);

  // Golden Floating Halo Ring
  const haloGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 48);
  const haloMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.0,
    metalness: 0.9,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 4;
  group.add(halo);

  const light = new THREE.PointLight(0x10b981, 3, 8);
  group.add(light);

  group.userData = {
    animate: (delta: number) => {
      halo.rotation.z += delta * 0.7;
      base.rotation.y += delta * 0.3;
      dome.rotation.y += delta * 0.3;
    }
  };

  return group;
}

// Project 03: Madrasa OS (Mainframe Matrix Cube with Security Shields)
function createMadrasaOSCluster(): THREE.Group {
  const group = new THREE.Group();

  // Central Hyper-Matrix Cube
  const cubeGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x1e153b,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.5,
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  group.add(cube);

  // Wireframe Outer Enclosure
  const wireGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.8,
    wireframe: true,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  // Interlocking Gimbal Rings
  const g1 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.035, 16, 64), new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x8b5cf6, emissiveIntensity: 0.7 }));
  const g2 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.035, 16, 64), new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.7 }));
  g2.rotation.x = Math.PI / 3;
  group.add(g1, g2);

  const light = new THREE.PointLight(0x8b5cf6, 3, 8);
  group.add(light);

  group.userData = {
    animate: (delta: number) => {
      cube.rotation.x += delta * 0.5;
      cube.rotation.y += delta * 0.7;
      wire.rotation.x -= delta * 0.4;
      wire.rotation.y -= delta * 0.3;
      g1.rotation.y += delta * 0.8;
      g2.rotation.x += delta * 0.6;
    }
  };

  return group;
}

// Project 04: BD Mess (Algorithmic Balance & Hexagonal Living Nodes)
function createBDMessCluster(): THREE.Group {
  const group = new THREE.Group();

  // Center Hexagonal Pillar
  const hex1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 1.5, 6),
    new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.8, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.6 })
  );
  
  // Flanking Balanced Hexagonal Prisms
  const hex2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 1.1, 6),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15, emissive: 0xd97706, emissiveIntensity: 0.8 })
  );
  hex2.position.set(0.85, -0.2, 0);

  const hex3 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.9, 6),
    new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.9, roughness: 0.15, emissive: 0xea580c, emissiveIntensity: 0.8 })
  );
  hex3.position.set(-0.85, 0.2, 0);

  group.add(hex1, hex2, hex3);

  // Algorithmic Orbiting Balance Ring
  const balanceRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.04, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  balanceRing.rotation.x = Math.PI / 2.5;
  group.add(balanceRing);

  const light = new THREE.PointLight(0xf59e0b, 3, 8);
  group.add(light);

  group.userData = {
    animate: (delta: number) => {
      hex1.rotation.y += delta * 0.5;
      hex2.rotation.y -= delta * 0.7;
      hex3.rotation.y += delta * 0.6;
      balanceRing.rotation.z += delta * 0.8;
      // Gentle floating bob
      hex2.position.y = -0.2 + Math.sin(Date.now() * 0.002) * 0.1;
      hex3.position.y = 0.2 - Math.sin(Date.now() * 0.002) * 0.1;
    }
  };

  return group;
}

// Project 05: Expense Tracker (Holographic Digital Safe Vault & Growth Bars)
function createExpenseTrackerCluster(): THREE.Group {
  const group = new THREE.Group();

  // Vault Dial Cylinder
  const vaultBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.45, 24),
    new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.95, roughness: 0.1, emissive: 0x059669, emissiveIntensity: 0.4 })
  );
  vaultBody.rotation.x = Math.PI / 2;
  group.add(vaultBody);

  // Vault Gear Rim
  const dial = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.07, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x34d399, emissiveIntensity: 0.9, metalness: 0.9 })
  );
  dial.rotation.x = Math.PI / 2;
  group.add(dial);

  // 4 Tiered 3D Growth Bars
  const barMat = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 1.1, metalness: 0.8 });
  const barHeights = [0.4, 0.75, 1.1, 1.45];
  barHeights.forEach((h, i) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.16), barMat);
    bar.position.set(-0.45 + i * 0.3, h / 2 + 0.3, 0);
    group.add(bar);
  });

  // Orbiting Cashflow Ring
  const flowRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.03, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 0.8 })
  );
  flowRing.rotation.y = Math.PI / 3;
  group.add(flowRing);

  const light = new THREE.PointLight(0x00f5d4, 3, 8);
  group.add(light);

  group.userData = {
    animate: (delta: number) => {
      vaultBody.rotation.z += delta * 0.4;
      dial.rotation.z -= delta * 0.6;
      flowRing.rotation.x += delta * 0.7;
    }
  };

  return group;
}

// Project 06: Ponyopuri E-Commerce (Faceted Storefront Capsule & WA Rails)
function createPonyopuriCluster(): THREE.Group {
  const group = new THREE.Group();

  // Central Faceted Commerce Capsule
  const capsule = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.85, 0),
    new THREE.MeshStandardMaterial({
      color: 0x831843,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xdb2777,
      emissiveIntensity: 0.6
    })
  );
  group.add(capsule);

  // High-Speed Acceleration Ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.045, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xf43f5e, emissiveIntensity: 1.2 })
  );
  ring.rotation.x = Math.PI / 3;
  group.add(ring);

  // 3 Orbiting Dispatch Cubes
  const pBoxMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 1.0 });
  const parcels: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), pBoxMat);
    parcels.push(p);
    group.add(p);
  }

  const light = new THREE.PointLight(0xec4899, 3, 8);
  group.add(light);

  group.userData = {
    animate: (delta: number) => {
      capsule.rotation.x += delta * 0.5;
      capsule.rotation.y += delta * 0.8;
      ring.rotation.z += delta * 1.0;
      parcels.forEach((p, idx) => {
        const time = Date.now() * 0.002 + (idx * Math.PI * 2) / 3;
        p.position.set(Math.cos(time) * 1.6, Math.sin(time) * 0.8, Math.sin(time) * 1.2);
        p.rotation.x += delta * 2;
        p.rotation.y += delta * 2;
      });
    }
  };

  return group;
}

// Central Cosmic Core
function createCentralEcosystemCore(): THREE.Group {
  const group = new THREE.Group();

  // Multi-layered Wireframe Icosahedron Core
  const wireGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.5,
    wireframe: true,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  // Metallic Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.28, 128, 32);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x07111a,
    metalness: 0.95,
    roughness: 0.1,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  group.add(knot);

  // Dual Planetary Gyro-Rings
  const gyro1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.04, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x06b6d4, emissiveIntensity: 0.6 })
  );
  const gyro2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.6, 0.04, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0x0891b2, emissive: 0x0891b2, emissiveIntensity: 0.5 })
  );
  gyro2.rotation.x = Math.PI / 2.3;
  group.add(gyro1, gyro2);

  // Ambient Starfield
  const starCount = 600;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    const r = 14 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    starPos[i] = r * Math.cos(phi) * Math.cos(theta);
    starPos[i + 1] = r * Math.sin(phi);
    starPos[i + 2] = r * Math.cos(phi) * Math.sin(theta);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.6,
  });
  const stars = new THREE.Points(starGeo, starMat);
  group.add(stars);

  group.userData = {
    animate: (delta: number) => {
      wire.rotation.y += delta * 0.15;
      knot.rotation.x += delta * 0.2;
      knot.rotation.y += delta * 0.25;
      gyro1.rotation.y -= delta * 0.3;
      gyro2.rotation.x += delta * 0.25;
      stars.rotation.y += delta * 0.02;
    }
  };

  return group;
}

// =========================================================================
// 3. MAIN COMPONENT: Projects3DScene
// =========================================================================
export default function Projects3DScene() {
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjectsData);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(-1); // -1 = Overview/Intro
  const [isDesktop, setIsDesktop] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates & lerping for parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Camera targets interpolated via scroll progress
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Cluster references for dynamic animation
  const clustersRef = useRef<THREE.Group[]>([]);
  const coreRef = useRef<THREE.Group | null>(null);

  // Fetch updated project data if provided by CMS / API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const updated = data.projects.map((p: any) => {
            const fallback = defaultProjectsData.find(dp => dp.id === p.id) || defaultProjectsData[0];
            return {
              ...fallback,
              ...p,
              metricBadges: p.metricBadges || fallback.metricBadges,
              contributions: Array.isArray(p.contributions) && p.contributions.length > 0 
                ? p.contributions 
                : fallback.contributions
            };
          });
          setProjects(updated);
        }
      })
      .catch(() => {
        // Fallback to defaultProjectsData
      });
  }, []);

  // Screen check
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse move handler for 3D parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Coordinates of the 6 Orbiting Clusters in 3D Space
  const clusterCoordinates = useMemo(() => {
    const R = 9.2;
    return [
      { x: R * Math.cos(0), y: 0.6, z: 0 },                       // 01: Webpulse
      { x: R * Math.cos(Math.PI / 3), y: -1.0, z: R * Math.sin(Math.PI / 3) },    // 02: Al Madina
      { x: R * Math.cos((2 * Math.PI) / 3), y: 1.0, z: R * Math.sin((2 * Math.PI) / 3) }, // 03: Madrasa OS
      { x: R * Math.cos(Math.PI), y: -0.5, z: 0 },                  // 04: BD Mess
      { x: R * Math.cos((4 * Math.PI) / 3), y: 1.1, z: R * Math.sin((4 * Math.PI) / 3) }, // 05: Expense Tracker
      { x: R * Math.cos((5 * Math.PI) / 3), y: -0.9, z: R * Math.sin((5 * Math.PI) / 3) }, // 06: Ponyopuri
    ];
  }, []);

  // Camera choreography keyframes for smooth scroll interpolation
  const cameraKeyframes = useMemo(() => [
    {
      progress: 0.0,
      camPos: new THREE.Vector3(0, 3.2, 21.0),
      lookAt: new THREE.Vector3(0, 0, 0),
      activeIdx: -1
    },
    {
      progress: 0.16,
      camPos: new THREE.Vector3(5.8, 1.2, 4.2),
      lookAt: new THREE.Vector3(clusterCoordinates[0].x, clusterCoordinates[0].y, clusterCoordinates[0].z),
      activeIdx: 0
    },
    {
      progress: 0.32,
      camPos: new THREE.Vector3(7.8, -0.2, 4.4),
      lookAt: new THREE.Vector3(clusterCoordinates[1].x, clusterCoordinates[1].y, clusterCoordinates[1].z),
      activeIdx: 1
    },
    {
      progress: 0.48,
      camPos: new THREE.Vector3(-1.4, 1.8, 4.6),
      lookAt: new THREE.Vector3(clusterCoordinates[2].x, clusterCoordinates[2].y, clusterCoordinates[2].z),
      activeIdx: 2
    },
    {
      progress: 0.64,
      camPos: new THREE.Vector3(-5.8, 0.2, 4.4),
      lookAt: new THREE.Vector3(clusterCoordinates[3].x, clusterCoordinates[3].y, clusterCoordinates[3].z),
      activeIdx: 3
    },
    {
      progress: 0.80,
      camPos: new THREE.Vector3(-1.4, 1.9, -4.6),
      lookAt: new THREE.Vector3(clusterCoordinates[4].x, clusterCoordinates[4].y, clusterCoordinates[4].z),
      activeIdx: 4
    },
    {
      progress: 0.94,
      camPos: new THREE.Vector3(7.8, -0.3, -4.4),
      lookAt: new THREE.Vector3(clusterCoordinates[5].x, clusterCoordinates[5].y, clusterCoordinates[5].z),
      activeIdx: 5
    },
    {
      progress: 1.0,
      camPos: new THREE.Vector3(0, 2.8, 20.0),
      lookAt: new THREE.Vector3(0, 0, 0),
      activeIdx: -1
    }
  ], [clusterCoordinates]);

  // Current smoothed camera vectors
  const currentCamPos = useRef(new THREE.Vector3(0, 3.2, 21.0));
  const currentCamLook = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 3.2, 21.0));
  const targetCamLook = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = canvasContainerRef.current.clientWidth;
    const height = canvasContainerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 21.0);
    cameraRef.current = camera;

    // WebGL Renderer with High Performance
    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    canvasContainerRef.current.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 3.5);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 2.0);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const blueRimLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    blueRimLight.position.set(0, -15, 5);
    scene.add(blueRimLight);

    // Central Core
    const core = createCentralEcosystemCore();
    scene.add(core);
    coreRef.current = core;

    // Build the 6 Orbiting Clusters
    const clusterGenerators = [
      createWebpulseCluster,
      createAlMadinaCluster,
      createMadrasaOSCluster,
      createBDMessCluster,
      createExpenseTrackerCluster,
      createPonyopuriCluster
    ];

    const clusters: THREE.Group[] = [];
    clusterGenerators.forEach((gen, idx) => {
      const cluster = gen();
      const coords = clusterCoordinates[idx];
      cluster.position.set(coords.x, coords.y, coords.z);
      scene.add(cluster);
      clusters.push(cluster);
    });
    clustersRef.current = clusters;

    // Resize Handler
    const handleWindowResize = () => {
      if (!canvasContainerRef.current || !renderer || !camera) return;
      const w = canvasContainerRef.current.clientWidth;
      const h = canvasContainerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleWindowResize);

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Animate core & clusters
      if (coreRef.current?.userData?.animate) {
        coreRef.current.userData.animate(delta);
      }
      clustersRef.current.forEach(c => {
        if (c.userData?.animate) c.userData.animate(delta);
      });

      // Mouse Lerping (Damping: 0.05)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smooth Camera Lerping
      currentCamPos.current.lerp(targetCamPos.current, 0.08);
      currentCamLook.current.lerp(targetCamLook.current, 0.08);

      // Apply subtle mouse parallax
      camera.position.x = currentCamPos.current.x + mouseRef.current.x * 0.5;
      camera.position.y = currentCamPos.current.y + mouseRef.current.y * 0.4;
      camera.position.z = currentCamPos.current.z;

      camera.lookAt(currentCamLook.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleWindowResize);
      observer.disconnect();

      // Deep Disposal of Three.js Resources
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (canvasContainerRef.current && renderer.domElement) {
        canvasContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [clusterCoordinates]);

  // GSAP ScrollTrigger for 3D Camera Choreography
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;

          // Find the two keyframes surrounding the current scroll progress
          let kIndex = 0;
          for (let i = 0; i < cameraKeyframes.length - 1; i++) {
            if (progress >= cameraKeyframes[i].progress && progress <= cameraKeyframes[i + 1].progress) {
              kIndex = i;
              break;
            }
          }

          const kA = cameraKeyframes[kIndex];
          const kB = cameraKeyframes[kIndex + 1] || kA;
          const range = kB.progress - kA.progress;
          const u = range > 0 ? (progress - kA.progress) / range : 0;
          
          // Smoothstep easing for cinematic glide
          const s = u * u * (3 - 2 * u);

          targetCamPos.current.copy(kA.camPos).lerp(kB.camPos, s);
          targetCamLook.current.copy(kA.lookAt).lerp(kB.lookAt, s);

          // Update Active Project
          const determinedIdx = u < 0.5 ? kA.activeIdx : kB.activeIdx;
          setActiveProjectIdx(determinedIdx);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cameraKeyframes]);

  // Jump to specific project index
  const handleJumpToProject = (idx: number) => {
    if (!sectionRef.current) return;
    const progressTargets = [0.16, 0.32, 0.48, 0.64, 0.80, 0.94];
    const targetProgress = progressTargets[idx] ?? 0;
    const scrollDistance = sectionRef.current.scrollHeight - window.innerHeight;
    const targetScrollY = sectionRef.current.offsetTop + scrollDistance * targetProgress;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  const currentProject = activeProjectIdx >= 0 && activeProjectIdx < projects.length 
    ? projects[activeProjectIdx] 
    : null;

  // Determine HUD Card Alignment (Alternating Left vs Right)
  const isCardOnRight = activeProjectIdx % 2 === 1;

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="relative z-10 bg-[#030305] text-white w-full max-w-full"
    >
      {/* ======================================================== */}
      {/* DESKTOP 3D SPATIAL SHOWCASE (>= 768px)                   */}
      {/* Sticky 400vh scroll container controlling Three.js camera */}
      {/* ======================================================== */}
      <div className="hidden md:block relative w-full h-[450vh]">
        
        {/* Sticky Viewport Stage */}
        <div 
          ref={stickyContainerRef} 
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none"
        >
          {/* Central 3D Three.js WebGL Canvas */}
          <div 
            ref={canvasContainerRef} 
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          />

          {/* Ambient Lighting Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,3,5,0.7)_80%,#030305_100%)] pointer-events-none z-1" />

          {/* Top HUD Bar: Section Badge & 3D Project Stepper */}
          <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
            {/* Left Header */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md text-[10px] font-mono tracking-widest text-cyan-300 uppercase shadow-lg">
                <Radio size={12} className="text-cyan-400 animate-pulse" />
                <span>3D ECOSYSTEM RADAR</span>
              </div>
              <span className="text-xs font-mono text-neutral-400 hidden lg:inline">
                // SYSTEM NODES: 06 ACTIVE
              </span>
            </div>

            {/* Right Project Stepper Pills (Clickable navigation) */}
            <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl">
              {projects.map((p, idx) => {
                const isActive = activeProjectIdx === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleJumpToProject(idx)}
                    className={`relative px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${
                      isActive 
                        ? "text-black bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-105" 
                        : "text-neutral-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{p.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* INTRO HERO OVERLAY (When activeProjectIdx === -1)         */}
          {/* ======================================================== */}
          <AnimatePresence>
            {activeProjectIdx === -1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6 pointer-events-none"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase mb-5 bg-cyan-950/30 backdrop-blur-md">
                  <Sparkles size={12} className="text-cyan-400" /> BENTO 3D SPATIAL SHOWCASE
                </div>

                <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-white mb-4 leading-[0.95] drop-shadow-2xl">
                  ARCHITECTING <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                    DIGITAL ECOSYSTEMS
                  </span>
                </h2>

                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                  Explore my production web systems, autonomous AI agent pipelines, and enterprise management operating systems rendered as interactive 3D spatial clusters.
                </p>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300/90 shadow-xl backdrop-blur-md animate-bounce">
                  <Compass size={14} className="text-cyan-400" />
                  <span>SCROLL DOWN TO ENGAGE 3D CAMERA</span>
                  <ChevronDown size={14} className="text-cyan-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ======================================================== */}
          {/* DYNAMIC MICRO-UI CONTENT CARD OVERLAY                    */}
          {/* Positioned cleanly on Left or Right opposite to 3D focus */}
          {/* ======================================================== */}
          <AnimatePresence mode="wait">
            {currentProject && (
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, x: isCardOnRight ? 60 : -60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isCardOnRight ? 40 : -40, scale: 0.96 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={`absolute z-10 max-w-lg w-[90%] md:w-[480px] lg:w-[520px] pointer-events-auto ${
                  isCardOnRight 
                    ? "right-6 sm:right-10 lg:right-16" 
                    : "left-6 sm:left-10 lg:left-16"
                }`}
              >
                <div className="relative rounded-[2rem] p-7 sm:p-8 bg-[#070b0e]/85 border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.15)] overflow-hidden">
                  
                  {/* Subtle Accent Glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: currentProject.themeColor }}
                  />

                  {/* Top Bar: System ID & Status */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-cyan-400">
                        NODE // {currentProject.id}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      {currentProject.role}
                    </span>
                  </div>

                  {/* Project Name Headline */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black uppercase tracking-tight text-white mb-3">
                    {currentProject.title}
                  </h3>

                  {/* Project Summary */}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
                    {currentProject.desc}
                  </p>

                  {/* Metric Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {currentProject.metricBadges.map((badge, bIdx) => (
                      <span 
                        key={bIdx}
                        className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-cyan-950/50 border border-cyan-500/30 text-cyan-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Core Deliverables Checklist */}
                  <div className="space-y-2 border-t border-white/10 pt-4 mb-6">
                    <div className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-2">
                      <Sparkles size={11} className="text-cyan-400" /> KEY CONTRIBUTIONS
                    </div>
                    {currentProject.contributions.map((item, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                        <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.tech.map((t, tIdx) => (
                        <span 
                          key={tIdx}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300"
                    >
                      <span>LIVE PREVIEW</span>
                      <ExternalLink size={13} />
                    </a>

                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-semibold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300"
                      title="Source Code"
                    >
                      <GithubIcon className="w-4 h-4 text-neutral-300" />
                      <span className="hidden sm:inline">SOURCE</span>
                    </a>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom HUD Telemetry */}
          <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between text-[10px] font-mono text-neutral-500 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SPATIAL WEBGL ENGINE: ONLINE // 60 FPS</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span>{activeProjectIdx >= 0 ? `NODE 0${activeProjectIdx + 1} OF 06` : "OVERVIEW MODE"}</span>
              <ArrowRight size={12} />
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MOBILE FALLBACK (< 768px): Responsive Clean Vertical Stack */}
      {/* Ensures zero horizontal scroll lock or heavy 3D freezes  */}
      {/* ======================================================== */}
      <div className="block md:hidden px-4 py-16 sm:py-20 w-full max-w-xl mx-auto">
        
        {/* Mobile Section Header */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-[9px] font-mono tracking-widest text-cyan-400 uppercase mb-3 bg-cyan-950/30">
            <Code2 size={11} /> ARCHITECTURAL COMPETENCIES
          </div>
          <h2 className="text-3xl font-display font-black uppercase tracking-tight text-white">
            DIGITAL <span className="text-cyan-400">ECOSYSTEMS</span>
          </h2>
          <p className="text-neutral-400 text-xs mt-2 max-w-sm leading-relaxed">
            Scalable web platforms, autonomous AI workflows, and enterprise management systems built with modern engineering craftsmanship.
          </p>
        </div>

        {/* Mobile Project Cards */}
        <div className="space-y-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="rounded-2xl p-6 bg-[#080d11] border border-white/10 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  NODE // {project.id}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase">
                  {project.role}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white uppercase">
                {project.title}
              </h3>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.metricBadges.map((badge, bIdx) => (
                  <span key={bIdx} className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950/60 border border-cyan-500/25 text-cyan-300">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                {project.contributions.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-[11px] text-neutral-300">
                    <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {project.tech.map((t, tIdx) => (
                  <span key={tIdx} className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-cyan-500 text-black font-mono font-bold text-xs uppercase"
                >
                  <span>LIVE DEMO</span>
                  <ExternalLink size={12} />
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
