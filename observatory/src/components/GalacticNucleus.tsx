import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GalacticNucleus — holographic render of the project logo at galaxy origin.
 *
 * Two stacked camera-facing sprites:
 *   1. Aura layer (back) — cyan radial gradient rendered to a 256×256 canvas,
 *      drawn with AdditiveBlending so it only ever brightens the scene.
 *      This is the "light spill" component of the hologram.
 *   2. Logo layer (front) — /public/core-logo.png loaded at runtime, drawn
 *      with NormalBlending + depthWrite:false. Normal blending preserves the
 *      logo's original colors accurately; depthWrite:false keeps it layered
 *      like a hologram instead of occluding stars behind it.
 *
 * Both sprites share a slow 3-second breath (opacity + scale), with the aura
 * pulsing ~45° out of phase with the logo so the halo feels independent of
 * the core — like the core is emitting the glow, not merging with it.
 *
 * A cyan pointLight at origin lets the nucleus literally cast rim-light on
 * nearby repo-stars (distance=55 world units, so outer constellations stay
 * in darkness — reinforces depth).
 */

const LOGO_PATH = "/core-logo.png";
const LOGO_SCALE = 4.5; // world units — sharp, dense core (not a giant sun)
const AURA_SCALE = 8.5; // aura ~1.89× logo for soft halo (proportional to new logo size)

// ─── aura texture ─────────────────────────────────────────────────────────

function createAuraTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  if (!ctx) return texture;

  const cx = size / 2;
  const cy = size / 2;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  // Stops tuned to fall off smoothly — no hard edges.
  gradient.addColorStop(0, "rgba(125, 211, 252, 0.55)");
  gradient.addColorStop(0.3, "rgba(125, 211, 252, 0.22)");
  gradient.addColorStop(0.7, "rgba(125, 211, 252, 0.05)");
  gradient.addColorStop(1, "rgba(125, 211, 252, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  texture.needsUpdate = true;
  return texture;
}

// ─── loaders ──────────────────────────────────────────────────────────────

function useAuraTexture(): THREE.CanvasTexture | null {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    setTexture(createAuraTexture());
  }, []);
  return texture;
}

/**
 * Loads the logo via THREE.TextureLoader and configures high-quality filtering.
 * Uses state-based loading (not Suspense) so it composes cleanly with the
 * aura hook — both are null until ready, and the component bails out on null.
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

export function GalacticNucleus() {
  const auraTex = useAuraTexture();
  const logoTex = useLogoTexture();

  const logoRef = useRef<THREE.Sprite>(null);
  const logoMatRef = useRef<THREE.SpriteMaterial>(null);
  const auraRef = useRef<THREE.Sprite>(null);
  const auraMatRef = useRef<THREE.SpriteMaterial>(null);

  useFrame((state) => {
    const phase = state.clock.elapsedTime * ((2 * Math.PI) / 3); // 3s period

    // Logo breath — subtle opacity + scale swing
    const logoOpacity = 0.9 + Math.sin(phase) * 0.1; // 0.8 – 1.0
    const logoScale = 1 + Math.sin(phase) * 0.04; // 0.96 – 1.04
    if (logoMatRef.current) logoMatRef.current.opacity = logoOpacity;
    if (logoRef.current) logoRef.current.scale.setScalar(LOGO_SCALE * logoScale);

    // Aura breath — phased 45° behind so the halo feels independent of the
    // core, like a glow that expands after the logo brightens.
    const auraOpacity = 0.55 + Math.sin(phase - Math.PI / 4) * 0.25; // 0.30 – 0.80
    const auraScale = 1 + Math.sin(phase - Math.PI / 4) * 0.07; // 0.93 – 1.07
    if (auraMatRef.current) auraMatRef.current.opacity = auraOpacity;
    if (auraRef.current) auraRef.current.scale.setScalar(AURA_SCALE * auraScale);
  });

  if (!auraTex || !logoTex) return null;

  return (
    <group>
      {/* The nucleus actually casts light on the scene. Low intensity + short
          distance means only inner constellations catch the rim — far ones
          stay dark, reinforcing the depth cue. */}
      <pointLight color="#7dd3fc" intensity={0.22} distance={55} />

      {/* Aura — additive blending so it only adds brightness to the scene,
          matching the holographic "light projection" read. */}
      <sprite ref={auraRef} scale={AURA_SCALE} renderOrder={1}>
        <spriteMaterial
          ref={auraMatRef}
          map={auraTex}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Logo — normal blending preserves the PNG's original colors exactly.
          depthWrite:false keeps it holographic (doesn't occlude what's behind). */}
      <sprite ref={logoRef} scale={LOGO_SCALE} renderOrder={2}>
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
