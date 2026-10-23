"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { buildRoomScene, InteractiveTarget } from "./RoomSceneBuilder";
import RoomNavigation, { CameraStage } from "./RoomNavigation";
import MacScreenOverlay from "./MacScreenOverlay";
import ProjectFrameModal, { ROOM_PROJECTS, ProjectData } from "./ProjectFrameModal";
import OriginStoryModal from "./OriginStoryModal";
import PhoneContactModal from "./PhoneContactModal";
import { playClickSound, playHoverSound } from "@/lib/sounds";

// Balanced & Proportional Camera Coordinates for Cozy Studio Loft
const STAGE_CAMERAS: Record<
  CameraStage,
  { pos: [number, number, number]; lookAt: [number, number, number]; fov: number }
> = {
  overview: {
    pos: [3.1, 2.3, 3.1],
    lookAt: [0.15, 1.25, -0.7],
    fov: 46,
  },
  desk: {
    pos: [0.0, 1.32, -0.05],
    lookAt: [0.0, 1.24, -0.75],
    fov: 42,
  },
  projects: {
    pos: [1.05, 2.15, 0.5],
    lookAt: [1.05, 2.15, -2.75],
    fov: 52,
  },
  shelf: {
    pos: [-1.4, 2.18, -0.4],
    lookAt: [-3.36, 2.18, -0.4],
    fov: 48,
  },
  contact: {
    pos: [0.46, 1.28, -0.08],
    lookAt: [0.48, 0.79, -0.48],
    fov: 40,
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
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(...STAGE_CAMERAS.overview.lookAt));

  // Mouse Drag Orbiting
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const orbitOffsetRef = useRef({ yaw: 0, pitch: 0 });

  // Smooth GSAP Camera Transition Helper
  const navigateToStage = useCallback((stage: CameraStage) => {
    setCurrentStage(stage);
    const target = STAGE_CAMERAS[stage];
    orbitOffsetRef.current = { yaw: 0, pitch: 0 };

    if (cameraRef.current) {
      gsap.killTweensOf(cameraRef.current.position);
      gsap.killTweensOf(currentLookAtRef.current);

      gsap.to(cameraRef.current.position, {
        x: target.pos[0],
        y: target.pos[1],
        z: target.pos[2],
        duration: 1.4,
        ease: "power2.inOut",
      });

      gsap.to(currentLookAtRef.current, {
        x: target.lookAt[0],
        y: target.lookAt[1],
        z: target.lookAt[2],
        duration: 1.4,
        ease: "power2.inOut",
      });
    }
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
    scene.background = new THREE.Color(0x0a0c12);

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
    renderer.toneMappingExposure = 1.2;
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
          -0.35,
          Math.min(0.35, orbitOffsetRef.current.pitch - deltaY * 0.003)
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
              setTimeout(() => setIsMacScreenOpen(true), 650);
            } else if (clickedTarget.id === "speaker") {
              toggleLoFi();
            } else if (clickedTarget.id.startsWith("project_")) {
              navigateToStage("projects");
              const projId = clickedTarget.id.replace("project_", "");
              const found = ROOM_PROJECTS.find((p) => p.id === projId) || ROOM_PROJECTS[0];
              setTimeout(() => setSelectedProject(found), 650);
            } else if (clickedTarget.id === "origin_shelf") {
              navigateToStage("shelf");
              setTimeout(() => setIsOriginStoryOpen(true), 650);
            } else if (clickedTarget.id === "smartphone") {
              navigateToStage("contact");
              setTimeout(() => setIsPhoneContactOpen(true), 650);
            }
          }
        }
      }
    };

    // Continuous Scroll Step Progression
    let lastScrollTime = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 380) return;

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

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 120 FPS Locked Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      updateScene(elapsedTime);

      // Camera lookAt constantly synchronizes with currentLookAtRef (animated via GSAP)
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
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab" />

      <RoomNavigation
        currentStage={currentStage}
        onSelectStage={navigateToStage}
        isLoFiPlaying={isLoFiPlaying}
        onToggleLoFi={toggleLoFi}
        onResetView={handleResetView}
      />

      <MacScreenOverlay
        isOpen={isMacScreenOpen}
        onClose={() => setIsMacScreenOpen(false)}
        onNavigateStage={navigateToStage}
      />

      <ProjectFrameModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      <OriginStoryModal
        isOpen={isOriginStoryOpen}
        onClose={() => setIsOriginStoryOpen(false)}
      />

      <PhoneContactModal
        isOpen={isPhoneContactOpen}
        onClose={() => setIsPhoneContactOpen(false)}
      />
    </div>
  );
}
