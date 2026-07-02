import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Group } from "three";
import type { Galaxy as GalaxyData } from "../types/galaxy";
import { StarField, type PositionedStar } from "./StarField";
import { Nebula } from "./Nebula";
import { GalacticNucleus } from "./GalacticNucleus";
import { StarCard } from "./StarCard";
import { PathfinderInput } from "./PathfinderInput";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format galaxy.json's `generated_at` (e.g. "2026-04-28T20:45+00:00") as a
 * short human date like "28 Apr 2026". We slice the date part with a regex
 * rather than `new Date(...)` so the displayed day never drifts across a
 * timezone boundary — the audit stamps UTC and we want to show that same day.
 */
function formatUpdated(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const [, year, month, day] = m;
  const label = MONTHS[Number(month) - 1];
  return label ? `${Number(day)} ${label} ${year}` : null;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

/**
 * Y-axis auto-rotate wrapper. Pauses when `paused` is true so the user can
 * focus on a selected star without the scene drifting out from under them.
 * Rate: 0.06 rad/s (= 0.001 rad/frame @ 60fps), framerate-independent.
 */
function AutoRotator({
  paused,
  children,
}: {
  paused: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !paused) ref.current.rotation.y += delta * 0.06;
  });
  return <group ref={ref}>{children}</group>;
}

export default function Galaxy() {
  const [data, setData] = useState<GalaxyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStar, setSelectedStar] = useState<PositionedStar | null>(null);
  const [pathfinderQuery, setPathfinderQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    // Route through Astro's BASE_URL so fetches work both at the dev server
    // root (/galaxy.json) and when deployed under a sub-path (/JAXlaxy/galaxy.json).
    fetch(`${import.meta.env.BASE_URL}galaxy.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<GalaxyData>;
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center px-6 text-center">
        <p className="text-white/60 text-sm max-w-md">
          Failed to load <code>galaxy.json</code>: {error}. Generate it with{" "}
          <code className="text-[color:var(--color-cyan-neon)]">
            python scripts/health_check.py --json observatory/public/galaxy.json
          </code>{" "}
          from the repo root.
        </p>
      </div>
    );
  }

  return (
    <>
      <PathfinderInput
        value={pathfinderQuery}
        onChange={setPathfinderQuery}
        isMobile={isMobile}
      />
      <Canvas
        camera={{
          position: isMobile ? [0, 0, 100] : [0, 0, 85],
          fov: isMobile ? 65 : 55,
        }}
        // Clamp DPR on mobile — phones report devicePixelRatio up to 3, but
        // the perceptual gain on a galaxy of glowing dots is ~zero, while
        // pixel cost is quadratic. 1.5 cap keeps mid-tier phones at 30+ fps.
        dpr={isMobile ? [1, 1.5] : undefined}
        gl={{ antialias: !isMobile }}
        // touch-action:none tells the browser to forward all touch gestures
        // to our handlers instead of interpreting them as page scroll/zoom.
        // Required for OrbitControls' two-finger pinch-to-zoom to work on
        // mobile without fighting Safari/Chrome's native page pinch.
        style={{ touchAction: "none" }}
        // R3F fires onPointerMissed when a click hits no 3D object.
        // Dragging is handled upstream by OrbitControls, so this cleanly
        // captures "click the void" to deselect.
        onPointerMissed={() => setSelectedStar(null)}
      >
        <Nebula />

        <Stars
          radius={280}
          depth={70}
          count={isMobile ? 1500 : 5000}
          factor={5}
          saturation={0}
          fade
          speed={0.3}
        />

        <ambientLight intensity={0.05} />
        <directionalLight position={[20, 20, 10]} intensity={0.08} />

        {/* Holographic nucleus anchored at origin — the XLA/JAX core the
            galaxy revolves around. Its point light catches the rim of nearby
            stars, selling "the nucleus illuminates the constellations." */}
        <GalacticNucleus isMobile={isMobile} />
        <AutoRotator paused={selectedStar !== null}>
          {data ? (
            <StarField
              stars={data.stars}
              selectedStar={selectedStar}
              onSelect={setSelectedStar}
              query={pathfinderQuery}
              isMobile={isMobile}
            />
          ) : null}
        </AutoRotator>

        {/* Bloom is the most expensive shader in the scene — disabled on
            mobile to prevent thermal throttling on mid-tier phones. */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.7}
              radius={0.4}
            />
          </EffectComposer>
        )}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          enablePan={false}
          // Pinch-to-zoom: drei's OrbitControls maps two-finger pinch to
          // dolly. The Canvas's touch-action:none above prevents the
          // browser from intercepting the gesture as page zoom.
          enableZoom
          // Gentler zoomSpeed on mobile — finger-distance deltas are small
          // in absolute pixels, so default 1.0 produces lurchy dollying.
          zoomSpeed={isMobile ? 0.6 : 1}
          rotateSpeed={isMobile ? 0.45 : 1}
          minDistance={20}
          maxDistance={250}
        />
      </Canvas>

      {/* Sibling DOM overlay — fixed-position, independent of Canvas layout. */}
      <StarCard
        star={selectedStar}
        onClose={() => setSelectedStar(null)}
        isMobile={isMobile}
      />

      {/* Freshness stamp — mirrors the "Generated" column on the Data Table.
          Bottom-right so it never collides with the bottom-left caption.
          Only renders once data loads, matching the runtime-fetch pattern. */}
      {data && formatUpdated(data.generated_at) && (
        <div
          className="absolute bottom-6 right-6 text-xs text-white/40 z-10 pointer-events-none tracking-[0.005em]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Data updated {formatUpdated(data.generated_at)}
        </div>
      )}
    </>
  );
}
