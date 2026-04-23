import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Status } from "../types/galaxy";
import type { PositionedStar } from "./StarField";

/**
 * TODO(user-contribution): tune for taste.
 *
 * Under bloom post-processing with a high threshold (~0.5), only the
 * brightest pixels cross the bloom cutoff and halo outward — the rest of
 * the sphere surface sits below threshold and reads as a crisp disc.
 * These intensities are tuned for that regime: low enough to keep the
 * star-body subtle, high enough that the peak still blooms.
 *
 * Each entry: hex color (shared by `color` and `emissive`) + emissiveIntensity.
 */
const STATUS_PALETTE: Record<Status, { hex: string; intensity: number }> = {
  "🟢": { hex: "#39ff88", intensity: 0.45 },
  "🟡": { hex: "#ffd93d", intensity: 0.35 },
  "🔴": { hex: "#ff4d4d", intensity: 0.25 },
};

function sizeFor(stars: number | null): number {
  return Math.log((stars ?? 100) + 1) * 0.06 + 0.1;
}

const LABEL_BASE: CSSProperties = {
  borderRadius: 4,
  fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 500,
  whiteSpace: "nowrap",
  letterSpacing: 0.3,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

const LABEL_HOVER: CSSProperties = {
  ...LABEL_BASE,
  background: "rgba(0, 0, 0, 0.72)",
  border: "1px solid rgba(0, 242, 255, 0.3)",
  color: "#00f2ff",
  padding: "2px 7px",
};

const LABEL_LANDMARK: CSSProperties = {
  ...LABEL_BASE,
  background: "rgba(0, 0, 0, 0.55)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.65)",
  padding: "1px 6px",
  fontSize: 9,
};

interface StarProps {
  star: PositionedStar;
  isSelected: boolean;
  onSelect: (star: PositionedStar | null) => void;
}

export function Star({ star, isSelected, onSelect }: StarProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const palette = STATUS_PALETTE[star.status] ?? STATUS_PALETTE["🟡"];
  const baseSize = sizeFor(star.stars);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Hover and selected both enlarge the star; they compose additively.
    const activeScale = isSelected && hovered ? 1.7 : hovered || isSelected ? 1.5 : 1;
    if (star.status === "🟡") {
      const pulse =
        1 + Math.sin(state.clock.elapsedTime * 1.2 + baseSize * 5) * 0.08;
      mesh.scale.setScalar(baseSize * (hovered || isSelected ? activeScale : pulse));
    } else {
      mesh.scale.setScalar(baseSize * activeScale);
    }
  });

  // Emissive also composes: selected brightens (×2.2), hovering on top of
  // selected brightens further (×3.0), hover alone brightens (×2.2).
  const emissiveMultiplier = isSelected && hovered ? 3.0 : hovered || isSelected ? 2.2 : 1;

  const showLabel = hovered || star.isLandmark;
  const labelStyle = hovered ? LABEL_HOVER : LABEL_LANDMARK;

  return (
    <group position={star.position}>
      {/* Visible star */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={palette.hex}
          emissive={palette.hex}
          emissiveIntensity={palette.intensity * emissiveMultiplier}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Selection ring — horizontal torus, cyan, translucent. depthWrite
          off so it never occludes stars rendered through it. */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.04, 10, 48]} />
          <meshBasicMaterial
            color="#00f2ff"
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Invisible pointer target — larger pickup area for easy hover/click. */}
      <mesh
        scale={baseSize * 2.8}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(star);
        }}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {showLabel && (
        <Html
          position={[0, baseSize + 0.4, 0]}
          center
          zIndexRange={[100, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div style={labelStyle}>
            {star.user}/{star.repo}
          </div>
        </Html>
      )}
    </group>
  );
}
