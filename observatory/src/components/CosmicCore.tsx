import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/**
 * CosmicCore — a faint glowing anchor at [0, 0, 0] that gives the scene a
 * visual center. Two concentric spheres:
 *   - A small near-white inner dot (MeshBasic, unaffected by lights).
 *     Its luminance easily crosses the Bloom threshold, so it reads as a
 *     bright pinpoint with a soft cyan halo in the final composite.
 *   - A larger translucent cyan shell that adds a subtle volumetric glow.
 *
 * A very slow intensity breath (~10-second cycle) keeps it alive without
 * ever pulling attention from the stars.
 */
export function CosmicCore() {
  const innerRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);

  useFrame((state) => {
    // Subtle breathing — 10s period, ±8% opacity swing. Slow enough that
    // it registers as "alive" without being a distracting strobe.
    const t = state.clock.elapsedTime * ((2 * Math.PI) / 10);
    const breath = 1 + Math.sin(t) * 0.08;
    if (innerRef.current) innerRef.current.scale.setScalar(breath);
    if (haloRef.current) haloRef.current.scale.setScalar(breath);
  });

  return (
    <group>
      {/* Inner core — near-white, small, bloom-dominant */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#cde8ff" />
      </mesh>
      {/* Outer halo — soft cyan, translucent for volumetric glow */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#5ec4ff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
