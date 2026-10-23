"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  ContactShadows, 
  useGLTF, 
  Html,
  PerspectiveCamera
} from "@react-three/drei";
import * as THREE from "three";

interface GLTFModelProps {
  url?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}

/**
 * GLTFModel: Loads a .glb asset from public/models/
 * Automatically falls back to a procedural desk + monitor setup if url is not provided or still loading.
 */
export function GLTFModel({
  url = "/models/room.glb",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
}: GLTFModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hasError, setHasError] = useState(false);

  // If a valid URL is provided and not in error, load GLTF
  let gltf: { scene: THREE.Group } | null = null;
  try {
    if (!hasError && url) {
      gltf = useGLTF(url);
    }
  } catch {
    if (!hasError) setHasError(true);
  }

  // Fallback procedural workstation mesh (Henry Heffernan style)
  if (!gltf || hasError) {
    return (
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onClick}
      >
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#111216" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Minimalist Studio Desk */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.08, 1.2]} />
          <meshStandardMaterial color="#221812" roughness={0.4} />
        </mesh>

        {/* Desk Legs */}
        {[[-0.95, 0.375, -0.45], [0.95, 0.375, -0.45], [-0.95, 0.375, 0.45], [0.95, 0.375, 0.45]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.75, 16]} />
            <meshStandardMaterial color="#0c0d10" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Apple Mac mini M4 */}
        <mesh position={[-0.55, 0.83, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.07, 0.26]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Apple Studio Display Stand & Screen */}
        <group position={[0, 0.8, -0.15]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[1.2, 0.72, 0.035]} />
            <meshStandardMaterial color="#090a0f" roughness={0.15} />
          </mesh>
          {/* Glowing Screen Face */}
          <mesh position={[0, 0.55, 0.02]}>
            <planeGeometry args={[1.16, 0.68]} />
            <meshBasicMaterial color="#0ea5e9" />
          </mesh>
        </group>
      </group>
    );
  }

  return (
    <primitive
      ref={groupRef}
      object={gltf.scene}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    />
  );
}

/**
 * VirtualRoomBoilerplate: Production Ready Canvas Setup for 3D Room / Desk
 */
export default function VirtualRoomBoilerplate({
  modelUrl = "/models/room.glb",
  onObjectClick,
}: {
  modelUrl?: string;
  onObjectClick?: () => void;
}) {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0a0a0a] overflow-hidden select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <PerspectiveCamera makeDefault position={[3.8, 2.8, 4.2]} fov={45} />

        {/* Lighting Rig (Lusion / Studio Style) */}
        <ambientLight intensity={0.65} color="#0d1424" />
        
        {/* Warm Key Light (Desk Lamp Warm Glow) */}
        <spotLight
          position={[1.5, 3.2, 1.2]}
          angle={Math.PI / 4}
          penumbra={0.4}
          intensity={2.8}
          color="#ffb74d"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Cool Rim Moonlight */}
        <directionalLight
          position={[-4, 5, -2]}
          intensity={1.2}
          color="#60a5fa"
          castShadow
        />

        {/* 3D Scene Suspense Boundary with Loader */}
        <Suspense
          fallback={
            <Html center>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-black/80 px-4 py-2 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Streaming 3D Room Assets...</span>
              </div>
            </Html>
          }
        >
          <GLTFModel url={modelUrl} onClick={onObjectClick} />

          {/* Contact Shadows on Floor */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.65}
            scale={8}
            blur={2}
            far={4}
          />
        </Suspense>

        {/* Smooth Orbital Camera Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going beneath floor
          minDistance={1.8}
          maxDistance={8}
          target={[0, 1.1, 0]}
        />
      </Canvas>
    </div>
  );
}
