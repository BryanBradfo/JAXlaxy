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
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    fetch("/galaxy.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<GalaxyData>;
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (isMobile) {
    return (
      <div className="h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h2
            className="text-xl mb-3"
            style={{ color: "var(--color-cyan-neon)" }}
          >
            Observatory is desktop-first
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The interactive 3D galaxy is optimized for a larger screen. The
            mobile experience is under construction — for now, the{" "}
            <a href="/table" className="underline">
              Data Table
            </a>{" "}
            gives you the full list.
          </p>
        </div>
      </div>
    );
  }

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
      <Canvas
        camera={{ position: [0, 0, 85], fov: 55 }}
        gl={{ antialias: true }}
        // R3F fires onPointerMissed when a click hits no 3D object.
        // Dragging is handled upstream by OrbitControls, so this cleanly
        // captures "click the void" to deselect.
        onPointerMissed={() => setSelectedStar(null)}
      >
        <Nebula />

        <Stars
          radius={280}
          depth={70}
          count={5000}
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
        <GalacticNucleus />
        <AutoRotator paused={selectedStar !== null}>
          {data ? (
            <StarField
              stars={data.stars}
              selectedStar={selectedStar}
              onSelect={setSelectedStar}
            />
          ) : null}
        </AutoRotator>

        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.7}
            radius={0.4}
          />
        </EffectComposer>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          enablePan={false}
          minDistance={20}
          maxDistance={250}
        />
      </Canvas>

      {/* Sibling DOM overlay — fixed-position, independent of Canvas layout. */}
      <StarCard star={selectedStar} onClose={() => setSelectedStar(null)} />
    </>
  );
}
