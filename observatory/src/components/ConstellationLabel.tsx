import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";

/**
 * Strip the leading emoji (+ whitespace), then truncate at the first colon
 * if present. Leaves sections without colons as-is, fully uppercased.
 *
 *   "☀️ The Sun: Core & Kernels"              → "THE SUN"
 *   "🪐 The Giants: Neural Network Frameworks" → "THE GIANTS"
 *   "🧪 Scientific Computing & Simulation"     → "SCIENTIFIC COMPUTING & SIMULATION"
 */
function shortName(section: string): string {
  const stripped = section.replace(/^[^\w\s]+/, "").trim();
  const beforeColon = stripped.split(":")[0].trim();
  return beforeColon.toUpperCase();
}

interface Props {
  position: [number, number, number];
  section: string;
}

export function ConstellationLabel({ position, section }: Props) {
  const [mounted, setMounted] = useState(false);

  // One-shot fade-in on mount. The effect runs after the first paint so the
  // transition catches the opacity change from 0 → 1 instead of snapping.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Html
      position={position}
      center
      zIndexRange={[20, 10]}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 14,
          fontWeight: 300,
          color: "rgba(255, 255, 255, 0.12)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: "0 1px 12px rgba(0, 0, 0, 0.7)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 400ms ease",
          userSelect: "none",
        }}
      >
        {shortName(section)}
      </div>
    </Html>
  );
}
