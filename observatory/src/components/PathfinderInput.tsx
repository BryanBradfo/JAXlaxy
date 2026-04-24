import { useState } from "react";
import type { CSSProperties } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

/**
 * Pathfinder search input — minimalist floating overlay at top-left.
 * Mirrors the Table page's search-input style (borderless, underline-only)
 * for visual consistency across the two views.
 */
export function PathfinderInput({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  const wrapperStyle: CSSProperties = {
    position: "fixed",
    top: 68,
    left: 24,
    width: 280,
    maxWidth: "calc(100vw - 48px)",
    zIndex: 40,
    pointerEvents: "auto",
    fontFamily: '"Inter", system-ui, sans-serif',
  };

  const labelStyle: CSSProperties = {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const inputStyle: CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${
      focused ? "#7dd3fc" : "rgba(255, 255, 255, 0.15)"
    }`,
    color: "white",
    padding: "6px 0",
    fontSize: 13,
    fontFamily: '"Inter", system-ui, sans-serif',
    letterSpacing: "0.01em",
    width: "100%",
    outline: "none",
    transition: "border-color 120ms ease",
  };

  return (
    <div style={wrapperStyle}>
      <div style={labelStyle}>Pathfinder</div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="e.g. llm training, kernels, diffusion…"
        aria-label="Search galaxy by mission"
        style={inputStyle}
      />
    </div>
  );
}
