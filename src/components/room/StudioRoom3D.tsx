"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { buildRoomScene, InteractiveTarget } from "./RoomSceneBuilder";
import RoomNavigation, { CameraStage } from "./RoomNavigation";
import MacScreenOverlay from "./MacScreenOverlay";
import ProjectFrameModal, { ROOM_PROJECTS, ProjectData } from "./ProjectFrameModal";
import OriginStoryModal from "./OriginStoryModal";
import PhoneContactModal from "./PhoneContactModal";
import { playClickSound, playHoverSound } from "@/lib/sounds";

// Camera Targets for each of the 5 narrative stages
const STAGE_CAMERAS: Record<
  CameraStage,
  { pos: [number, number, number]; lookAt: [number, number, number]; fov: number }
> = {
  overview: {
    pos: [7.8, 5.8, 8.4],
    lookAt: [0.6, 2.0, 0.2],
    fov: 46,
  },
  desk: {
    pos: [0.6, 2.25, 1.65],
    lookAt: [0.6, 2.05, -0.2],
    fov: 48,
  },
  projects: {
    pos: [2.5, 3.4, 2.8],
    lookAt: [2.5, 3.4, -4.9],
    fov: 52,
  },
  shelf: {
    pos: [-4.2, 3.2, 0.5],
    lookAt: [-6.9, 3.2, 0.5],
    fov: 46,
  },
  contact: {
    pos: [1.32, 2.15, 0.65],
    lookAt: [1.25, 1.5, 0.35],
    fov: 42,
  },
};

export default function StudioRoom3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState<CameraStage>("overview");

  // Interactive Modals State
  const [isMacScreenOpen, setIsMacScreenOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isOriginStoryOpen, setIsOriginStoryOpen] = useState(false);
  const [isPhoneContactOpen, setIsPhoneContactOpen] = useState(false);

  // Lo-Fi Audio state
  const [isLoFiPlaying, setIsLoFiPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Three.js References
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0.6, 2.0, 0.2));
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...STAGE_CAMERAS.overview.pos));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(...STAGE_CAMERAS.overview.lookAt));

  // Mouse Drag / Orbit Orbiting
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const orbitOffsetRef = useRef({ yaw: 0, pitch: 0 });

  // Switch camera stage helper
  const navigateToStage = useCallback((stage: CameraStage) => {
    setCurrentStage(stage);
    const target = STAGE_CAMERAS[stage];
    targetCamPosRef.current.set(...target.pos);
    targetLookAtRef.current.set(...target.lookAt);
    orbitOffsetRef.current = { yaw: 0, pitch: 0 };
  }, []);

  // Lo-Fi Audio Toggle
  const toggleLoFi = useCallback(() => {
    playClickSound();
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    if (isLoFiPlaying) {
      audioRef.current.pause();
      setIsLoFiPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.log("Audio play blocked: ", e));
      setIsLoFiPlaying(true);
    }
  }, [isLoFiPlaying]);

  // Reset View to Overview
  const handleResetView = useCallback(() => {
    navigateToStage("overview");
  }, [navigateToStage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === "undefined") return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080d);
    scene.fog = new THREE.FogExp2(0x06080d, 0.035);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(...STAGE_CAMERAS.overview.pos);
    camera.lookAt(...STAGE_CAMERAS.overview.lookAt);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Texture Loader & Room Scene Construction
    const textureLoader = new THREE.TextureLoader();
    const { interactiveTargets, updateScene } = buildRoomScene(scene, textureLoader);

    // 3. Raycaster & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Object3D | null = null;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Drag Orbiting
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        orbitOffsetRef.current.yaw -= deltaX * 0.003;
        orbitOffsetRef.current.pitch = Math.max(
          -0.4,
          Math.min(0.4, orbitOffsetRef.current.pitch - deltaY * 0.003)
        );

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Raycasting for hover cursor
        raycaster.setFromCamera(mouse, camera);
        const hitObjects = interactiveTargets.map((t) => t.mesh);
        const intersects = raycaster.intersectObjects(hitObjects, true);

        if (intersects.length > 0) {
          if (!hoveredMesh) {
            playHoverSound();
            container.style.cursor = "pointer";
          }
          hoveredMesh = intersects[0].object;
        } else {
          container.style.cursor = "grab";
          hoveredMesh = null;
        }
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      isDraggingRef.current = false;
      container.style.cursor = hoveredMesh ? "pointer" : "grab";

      // If clicked without substantial drag, treat as click selection
      const deltaMove = Math.hypot(
        e.clientX - previousMousePositionRef.current.x,
        e.clientY - previousMousePositionRef.current.y
      );

      if (deltaMove < 8) {
        raycaster.setFromCamera(mouse, camera);
        const hitObjects = interactiveTargets.map((t) => t.mesh);
        const intersects = raycaster.intersectObjects(hitObjects, true);

        if (intersects.length > 0) {
          let clickedTarget: InteractiveTarget | undefined;
          for (const target of interactiveTargets) {
            if (target.mesh === intersects[0].object || target.mesh.children.includes(intersects[0].object)) {
              clickedTarget = target;
              break;
            }
          }

          if (clickedTarget) {
            playClickSound();

            if (clickedTarget.id === "mac_monitor") {
              navigateToStage("desk");
              setTimeout(() => setIsMacScreenOpen(true), 600);
            } else if (clickedTarget.id === "speaker") {
              toggleLoFi();
            } else if (clickedTarget.id.startsWith("project_")) {
              navigateToStage("projects");
              const projId = clickedTarget.id.replace("project_", "");
              const found = ROOM_PROJECTS.find((p) => p.id === projId) || ROOM_PROJECTS[0];
              setTimeout(() => setSelectedProject(found), 600);
            } else if (clickedTarget.id === "origin_shelf") {
              navigateToStage("shelf");
              setTimeout(() => setIsOriginStoryOpen(true), 600);
            } else if (clickedTarget.id === "smartphone") {
              navigateToStage("contact");
              setTimeout(() => setIsPhoneContactOpen(true), 600);
            }
          }
        }
      }
    };

    // 4. Scroll Step Progression (Continuous Scroll Journey)
    let lastScrollTime = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 380) return; // Debounce rapid scroll ticks

      if (Math.abs(e.deltaY) > 20) {
        lastScrollTime = now;
        const stages: CameraStage[] = ["overview", "desk", "projects", "shelf", "contact"];
        setCurrentStage((prev) => {
          const currentIndex = stages.indexOf(prev);
          if (e.deltaY > 0) {
            const nextIdx = Math.min(stages.length - 1, currentIndex + 1);
            navigateToStage(stages[nextIdx]);
            return stages[nextIdx];
          } else {
            const prevIdx = Math.max(0, currentIndex - 1);
            navigateToStage(stages[prevIdx]);
            return stages[prevIdx];
          }
        });
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: true });

    // 5. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 6. 120 FPS Locked Render Loop (Smooth Camera Damping)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Update steam & breathing lights
      updateScene(elapsedTime);

      // Smooth Camera Lerping (Exponential ease out)
      const targetPos = targetCamPosRef.current.clone();
      
      // Apply subtle orbit yaw/pitch offset
      if (orbitOffsetRef.current.yaw !== 0 || orbitOffsetRef.current.pitch !== 0) {
        const offset = new THREE.Vector3(
          Math.sin(orbitOffsetRef.current.yaw) * 1.5,
          orbitOffsetRef.current.pitch * 1.2,
          Math.cos(orbitOffsetRef.current.yaw) * 1.5 - 1.5
        );
        targetPos.add(offset);
      }

      camera.position.lerp(targetPos, 0.055);

      // Smooth LookAt Lerping
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.055);
      camera.lookAt(currentLookAtRef.current);

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      audioRef.current?.pause();
    };
  }, [navigateToStage, toggleLoFi]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#06080d]">
      {/* Three.js 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab" />

      {/* Floating Minimalist Top Navigation */}
      <RoomNavigation
        currentStage={currentStage}
        onSelectStage={navigateToStage}
        isLoFiPlaying={isLoFiPlaying}
        onToggleLoFi={toggleLoFi}
        onResetView={handleResetView}
      />

      {/* Interactive macOS Screen Overlay (Terminal, AI Chat, Skills, Launcher) */}
      <MacScreenOverlay
        isOpen={isMacScreenOpen}
        onClose={() => setIsMacScreenOpen(false)}
        onNavigateStage={navigateToStage}
      />

      {/* Interactive Wall Project Case Study Viewer */}
      <ProjectFrameModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* The Origin Story Modal (Biker's Helmet & Authentic Journey) */}
      <OriginStoryModal
        isOpen={isOriginStoryOpen}
        onClose={() => setIsOriginStoryOpen(false)}
      />

      {/* Direct Smartphone Contact Modal (WhatsApp, Email & Direct Message) */}
      <PhoneContactModal
        isOpen={isPhoneContactOpen}
        onClose={() => setIsPhoneContactOpen(false)}
      />
    </div>
  );
}
