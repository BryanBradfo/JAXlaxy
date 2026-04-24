import { useMemo } from "react";
import type { Star as StarData } from "../types/galaxy";
import { Star } from "./Star";
import { ConstellationLabel } from "./ConstellationLabel";

// xmur3 — a tiny seeded PRNG. Same `user/repo` string always produces the
// same position across reloads, so google/jax stays put.
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

// Golden angle for azimuth spacing — keeps section anchors aperiodic.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Disk geometry: spread wide in X and Z (the camera-facing plane), thin in Y
// (the "height above/below the disk"). This gives genuine depth-to-camera
// variation — the 2D-shell fix.
const DISK_INNER_RADIUS = 15;
const DISK_OUTER_RADIUS = 48;
const DISK_HEIGHT = 12; // ± units in Y

/**
 * Place a section anchor inside the volumetric disk.
 *
 * - Azimuth uses golden-angle spacing so anchors never align into periodic rings.
 * - Radius is hash-derived per-section, giving a mix of inner-disk (dense) and
 *   outer-disk (spread) constellations.
 * - Height is hash-derived too, with the sign flipped for odd indices so
 *   roughly half the constellations sit above the disk plane and half below.
 */
function sectionCenter(i: number, total: number): [number, number, number] {
  const rand = xmur3(`section-${i}-of-${total}`);
  const r = rand() / 0xffffffff;
  const h = rand() / 0xffffffff;

  const azimuth = (GOLDEN_ANGLE * i) % (2 * Math.PI);
  const radius = DISK_INNER_RADIUS + r * (DISK_OUTER_RADIUS - DISK_INNER_RADIUS);
  // Alternate hemisphere bias so consecutive sections don't clump above the disk.
  const height = (h - 0.5) * 2 * DISK_HEIGHT * (i % 2 === 0 ? 1 : -1) * 0.9;

  const x = radius * Math.cos(azimuth);
  const y = height;
  const z = radius * Math.sin(azimuth);
  return [x, y, z];
}

/**
 * TODO(user-contribution): this function defines the galaxy's visual identity.
 *
 * Each repo's [x, y, z] is:
 *   1. Its section's volumetric-disk anchor (from sectionCenter)
 *   2. Plus a Gaussian offset (Box-Muller) in 3D, wider in radial/depth axes
 *      than in height — so clusters feel disk-shaped within the larger disk.
 *
 * Result: each README section becomes a visibly distinct clump at its own
 * depth (Z) and height (Y), and the whole galaxy reads as a 3D structure
 * rather than a shell.
 *
 * Taste calls worth trying:
 *   - Tighter clusters — lower `sigmaRadial`
 *   - Spiral arms — bias azimuth by section index * angle offset
 *   - Pull 🟢 stars to +Z (front) and 🔴 to -Z (back) of their cluster
 *   - Bigger disk — raise DISK_OUTER_RADIUS and camera maxDistance together
 *
 * Keep the signature stable; tweak the body.
 */
function hashToPosition(
  user: string,
  repo: string,
  sectionIndex: number,
  totalSections: number,
): [number, number, number] {
  const rand = xmur3(`${user}/${repo}`);
  const u = rand() / 0xffffffff;
  const v = rand() / 0xffffffff;
  const w = rand() / 0xffffffff;
  const t = rand() / 0xffffffff;

  // Box-Muller → two Gaussian offsets (σ = 1) for the XZ plane …
  const safeU = Math.max(u, 1e-6);
  const mag1 = Math.sqrt(-2 * Math.log(safeU));
  const gaussX = mag1 * Math.cos(2 * Math.PI * v);
  const gaussZ = mag1 * Math.sin(2 * Math.PI * v);
  // … and a third for Y (height).
  const safeW = Math.max(w, 1e-6);
  const mag2 = Math.sqrt(-2 * Math.log(safeW));
  const gaussY = mag2 * Math.cos(2 * Math.PI * t);

  const [cx, cy, cz] = sectionCenter(sectionIndex, totalSections);

  // Generous cluster spread — stars occupy genuine volume per constellation
  // so they don't overlap at rest.
  const sigmaRadial = 5.5; // XZ plane spread (the primary depth axes)
  const sigmaHeight = 3.0; // Y spread (disk thickness within each cluster)

  return [
    cx + gaussX * sigmaRadial,
    cy + gaussY * sigmaHeight,
    cz + gaussZ * sigmaRadial,
  ];
}

export interface PositionedStar extends StarData {
  position: [number, number, number];
  isLandmark: boolean;
}

// How many of the brightest (by GitHub stars) repos should always display
// their label, acting as galactic landmarks for orientation.
const LANDMARK_COUNT = 5;

interface StarFieldProps {
  stars: StarData[];
  selectedStar: PositionedStar | null;
  onSelect: (star: PositionedStar | null) => void;
  query: string;
}

export function StarField({
  stars,
  selectedStar,
  onSelect,
  query,
}: StarFieldProps) {
  const positioned = useMemo<PositionedStar[]>(() => {
    // Collect unique sections in order of first appearance (stable mapping).
    const sectionOrder: string[] = [];
    stars.forEach((s) => {
      if (s.section && !sectionOrder.includes(s.section)) {
        sectionOrder.push(s.section);
      }
    });
    const idx = new Map(sectionOrder.map((s, i) => [s, i] as const));

    // Pick the top-N repos by GitHub stars as permanent landmarks. Using a
    // Set keyed on `user/repo` keeps the lookup O(1) when we mark each
    // positioned star below.
    const landmarkSet = new Set(
      [...stars]
        .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
        .slice(0, LANDMARK_COUNT)
        .map((s) => `${s.user}/${s.repo}`),
    );

    return stars.map((s) => ({
      ...s,
      position: hashToPosition(
        s.user,
        s.repo,
        idx.get(s.section) ?? 0,
        sectionOrder.length,
      ),
      isLandmark: landmarkSet.has(`${s.user}/${s.repo}`),
    }));
  }, [stars]);

  // Average position per section — anchors for the macro-scale constellation
  // labels. Computed once per data change; typical input is 75 stars so
  // the single pass is trivial.
  const centroids = useMemo(() => {
    type Acc = { sum: [number, number, number]; count: number };
    const acc = new Map<string, Acc>();
    for (const s of positioned) {
      const existing = acc.get(s.section) ?? {
        sum: [0, 0, 0] as [number, number, number],
        count: 0,
      };
      existing.sum[0] += s.position[0];
      existing.sum[1] += s.position[1];
      existing.sum[2] += s.position[2];
      existing.count += 1;
      acc.set(s.section, existing);
    }
    return Array.from(acc, ([section, { sum, count }]) => ({
      section,
      position: [
        sum[0] / count,
        sum[1] / count,
        sum[2] / count,
      ] as [number, number, number],
    }));
  }, [positioned]);

  const selectedKey = selectedStar
    ? `${selectedStar.user}/${selectedStar.repo}`
    : null;

  return (
    <>
      {centroids.map((c) => (
        <ConstellationLabel
          key={c.section}
          section={c.section}
          position={c.position}
        />
      ))}
      {positioned.map((s) => {
        const key = `${s.user}/${s.repo}`;
        return (
          <Star
            key={key}
            star={s}
            isSelected={selectedKey === key}
            onSelect={onSelect}
            query={query}
          />
        );
      })}
    </>
  );
}
