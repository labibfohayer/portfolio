"use client";

import { useRef, useEffect, useState, useCallback, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Html 
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { buildRoomScene, InteractiveTarget } from "./RoomSceneBuilder";
import RoomNavigation, { CameraStage } from "./RoomNavigation";
import MonitorWebsiteScreen from "./MonitorWebsiteScreen";
import ProjectFrameModal, { ROOM_PROJECTS, ProjectData } from "./ProjectFrameModal";
import OriginStoryModal from "./OriginStoryModal";
import PhoneContactModal from "./PhoneContactModal";
import { playClickSound, playHoverSound } from "@/lib/sounds";
import { RotateCcw } from "lucide-react";

// Balanced & Proportional Camera Coordinates for Cozy Studio Loft
const STAGE_CAMERAS: Record<
  CameraStage,
  { pos: [number, number, number]; lookAt: [number, number, number]; fov: number }
> = {
  overview: {
    pos: [3.1, 2.35, 3.1],
    lookAt: [0.15, 1.25, -0.7],
    fov: 46,
  },
  desk: {
    pos: [0.1, 1.26, 0.38],
    lookAt: [0.1, 1.26, -0.73],
    fov: 46,
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

/**
 * 3D Scene Core: Hosts procedural architecture, interactive targets, and monitor HTML
 */
function RoomSceneContent({
  currentStage,
  onNavigateStage,
  onSelectProject,
  onOpenOrigin,
  onOpenContact,
  onToggleLoFi,
  isScreenHovered,
  setIsScreenHovered,
}: {
  currentStage: CameraStage;
  onNavigateStage: (stage: CameraStage) => void;
  onSelectProject: (proj: ProjectData) => void;
  onOpenOrigin: () => void;
  onOpenContact: () => void;
  onToggleLoFi: () => void;
  isScreenHovered: boolean;
  setIsScreenHovered: (hovered: boolean) => void;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const roomGroupRef = useRef<THREE.Group>(null);
  const updateSceneRef = useRef<((time: number) => void) | null>(null);
  const interactiveTargetsRef = useRef<InteractiveTarget[]>([]);

  // Smooth GSAP Camera Animation on Stage Change
  useEffect(() => {
    const target = STAGE_CAMERAS[currentStage];
    if (!target || !controlsRef.current) return;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);

    gsap.to(camera.position, {
      x: target.pos[0],
      y: target.pos[1],
      z: target.pos[2],
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });

    gsap.to(controlsRef.current.target, {
      x: target.lookAt[0],
      y: target.lookAt[1],
      z: target.lookAt[2],
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        controlsRef.current?.update();
      },
    });
  }, [currentStage, camera]);

  // Build Procedural Studio Loft Architecture
  useEffect(() => {
    if (!roomGroupRef.current) return;
    const group = roomGroupRef.current;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const textureLoader = new THREE.TextureLoader();
    const { interactiveTargets, updateScene } = buildRoomScene(group, textureLoader);
    interactiveTargetsRef.current = interactiveTargets;
    updateSceneRef.current = updateScene;

    return () => {
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }
    };
  }, []);

  // 120 FPS Update Loop
  useFrame((state) => {
    updateSceneRef.current?.(state.clock.getElapsedTime());
  });

  // Raycasting for interactive meshes (Monitor, Speaker, Wall Frames, Shelf Helmet, Smartphone)
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const handlePointerDown = (e: any) => {
    // If the click is inside the HTML monitor screen, ignore raycasting
    if (isScreenHovered) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const hitObjects = interactiveTargetsRef.current.map((t) => t.mesh);
    const intersects = raycaster.current.intersectObjects(hitObjects, true);

    if (intersects.length > 0) {
      let clicked: InteractiveTarget | undefined;
      for (const target of interactiveTargetsRef.current) {
        if (target.mesh === intersects[0].object || target.mesh.children.includes(intersects[0].object)) {
          clicked = target;
          break;
        }
      }

      if (clicked) {
        playClickSound();

        if (clicked.id === "mac_monitor") {
          onNavigateStage("desk");
        } else if (clicked.id === "speaker") {
          onToggleLoFi();
        } else if (clicked.id.startsWith("project_")) {
          onNavigateStage("projects");
          const projId = clicked.id.replace("project_", "");
          const found = ROOM_PROJECTS.find((p) => p.id === projId) || ROOM_PROJECTS[0];
          setTimeout(() => onSelectProject(found), 650);
        } else if (clicked.id === "origin_shelf") {
          onNavigateStage("shelf");
          setTimeout(() => onOpenOrigin(), 650);
        } else if (clicked.id === "smartphone") {
          onNavigateStage("contact");
          setTimeout(() => onOpenContact(), 650);
        }
      }
    }
  };

  return (
    <>
      {/* Free-Look Orbit Controls: Disabled while cursor is inside monitor */}
      <OrbitControls
        ref={controlsRef}
        enabled={!isScreenHovered}
        enableDamping
        dampingFactor={0.06}
        maxPolarAngle={Math.PI / 2 - 0.04}
        minDistance={0.7}
        maxDistance={9.0}
        target={[0.15, 1.25, -0.7]}
      />

      {/* Procedural Architecture */}
      <group ref={roomGroupRef} onPointerDown={handlePointerDown} />

      {/* Embedded Scrollable Portfolio Website Inside Apple Studio Display */}
      <group position={[0.1, 1.26, -0.725]}>
        <Html
          transform
          distanceFactor={0.375}
          position={[0, 0, 0]}
        >
          <MonitorWebsiteScreen
            onHoverScreen={setIsScreenHovered}
            isZoomed={currentStage === "desk"}
            onZoomToDesk={() => onNavigateStage("desk")}
          />
        </Html>
      </group>

      {/* Soft Contact Shadows on Floor */}
      <ContactShadows
        position={[0.1, 0.01, -0.4]}
        opacity={0.65}
        scale={6}
        blur={2.4}
        far={4}
      />
    </>
  );
}

export default function StudioRoom3D() {
  const [currentStage, setCurrentStage] = useState<CameraStage>("overview");
  const [isScreenHovered, setIsScreenHovered] = useState(false);

  // Modals for external items (Frames, Shelf, Smartphone)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isOriginStoryOpen, setIsOriginStoryOpen] = useState(false);
  const [isPhoneContactOpen, setIsPhoneContactOpen] = useState(false);

  // Lo-Fi Audio
  const [isLoFiPlaying, setIsLoFiPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const navigateToStage = useCallback((stage: CameraStage) => {
    setCurrentStage(stage);
  }, []);

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

  // Keyboard shortcut: Press Escape to zoom back to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigateToStage("overview");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateToStage]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#06080d]">
      {/* R3F WebGL Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{
          position: [3.1, 2.35, 3.1],
          fov: 46,
          near: 0.1,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.35} />
        </Suspense>

        <RoomSceneContent
          currentStage={currentStage}
          onNavigateStage={navigateToStage}
          onSelectProject={setSelectedProject}
          onOpenOrigin={() => setIsOriginStoryOpen(true)}
          onOpenContact={() => setIsPhoneContactOpen(true)}
          onToggleLoFi={toggleLoFi}
          isScreenHovered={isScreenHovered}
          setIsScreenHovered={setIsScreenHovered}
        />
      </Canvas>

      {/* Top Floating Glass HUD Navigation */}
      <RoomNavigation
        currentStage={currentStage}
        onSelectStage={navigateToStage}
        isLoFiPlaying={isLoFiPlaying}
        onToggleLoFi={toggleLoFi}
        onResetView={handleResetView}
      />

      {/* Floating "Back to Room View" Button when Zoomed in at Desk */}
      {currentStage === "desk" && (
        <button
          onClick={() => {
            playClickSound();
            navigateToStage("overview");
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white font-mono text-xs flex items-center gap-2 hover:bg-white/10 transition-all shadow-2xl hover:scale-105 pointer-events-auto"
        >
          <RotateCcw size={14} className="text-cyan-400" />
          <span>Back to Room View</span>
        </button>
      )}

      {/* Interactive Modals for Wall Frames, Origin Shelf & Smartphone */}
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
