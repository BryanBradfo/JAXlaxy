import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GalacticNucleus — the project logo rendered at galaxy origin.
 *
 * A single camera-facing sprite: /public/core-logo.png loaded at runtime,
 * drawn with NormalBlending + depthWrite:false. Normal blending preserves the
 * logo's original colors accurately; depthWrite:false keeps it layered like a
 * hologram instead of occluding stars behind it. It breathes slowly (3-second
 * opacity + scale cycle).
 *
 * A cyan pointLight at origin lets the nucleus cast rim-light on nearby
 * repo-stars (distance=55 world units, so outer constellations stay in
 * darkness — reinforces depth).
 */

// Route through Astro's BASE_URL so the asset resolves correctly in dev
// (base=/) and in production under the sub-path (base=/JAXlaxy/).
const LOGO_PATH = `${import.meta.env.BASE_URL}core-logo.png`;
// Desktop scales — kept as the canonical "size of the core" reference.
const LOGO_SCALE = 4.5; // world units — sharp, dense core (not a giant sun)
// Mobile scales — pulled in to fit the narrower portrait viewport without
// crowding the surrounding star clusters.
const LOGO_SCALE_MOBILE = 3.5;

// ─── loader ───────────────────────────────────────────────────────────────

/**
 * Loads the logo via THREE.TextureLoader and configures high-quality filtering.
 * Uses state-based loading (not Suspense): null until ready, and the
 * component bails out on null.
 */
function useLogoTexture(): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      LOGO_PATH,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        // Quality knobs: anisotropic filtering eliminates moiré at oblique
        // angles; trilinear mipmapping keeps edges crisp across zoom levels.
        tex.anisotropy = 16;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        // Color-space: PNG source is sRGB-encoded. Declaring this makes
        // Three.js convert correctly during sampling — without it, the logo
        // would render slightly washed-out under the scene's color pipeline.
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error(`Failed to load ${LOGO_PATH}:`, err);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return texture;
}

// ─── component ────────────────────────────────────────────────────────────

interface NucleusProps {
  isMobile?: boolean;
}

export function GalacticNucleus({ isMobile = false }: NucleusProps) {
  const logoTex = useLogoTexture();

  const logoRef = useRef<THREE.Sprite>(null);
  const logoMatRef = useRef<THREE.SpriteMaterial>(null);

  const logoBase = isMobile ? LOGO_SCALE_MOBILE : LOGO_SCALE;

  useFrame((state) => {
    const phase = state.clock.elapsedTime * ((2 * Math.PI) / 3); // 3s period

    // Logo breath — subtle opacity + scale swing
    const logoOpacity = 0.9 + Math.sin(phase) * 0.1; // 0.8 – 1.0
    const logoScale = 1 + Math.sin(phase) * 0.04; // 0.96 – 1.04
    if (logoMatRef.current) logoMatRef.current.opacity = logoOpacity;
    if (logoRef.current) logoRef.current.scale.setScalar(logoBase * logoScale);
  });

  if (!logoTex) return null;

  return (
    <group>
      {/* The nucleus actually casts light on the scene. Low intensity + short
          distance means only inner constellations catch the rim — far ones
          stay dark, reinforcing the depth cue. */}
      <pointLight color="#7dd3fc" intensity={0.22} distance={55} />

      {/* Logo — normal blending preserves the PNG's original colors exactly.
          depthWrite:false keeps it holographic (doesn't occlude what's behind). */}
      <sprite ref={logoRef} scale={logoBase} renderOrder={2}>
        <spriteMaterial
          ref={logoMatRef}
          map={logoTex}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </sprite>
    </group>
  );
}
