import { useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  isMobile?: boolean;
}

/**
 * Pathfinder search input.
 *
 * - Desktop: minimalist floating overlay at top-left, borderless underline.
 * - Mobile: full-width bar pinned just below the NavHeader. The bottom
 *   sheet (StarCard mobile) lives at the opposite end of the viewport, so
 *   the two surfaces never collide and the search bar never has to jump.
 *   Selection is reactive (no submit button) — Enter just blurs the input
 *   to dismiss the keyboard.
 */
export function PathfinderInput({
  value,
  onChange,
  isMobile = false,
}: Props) {
  const [focused, setFocused] = useState(false);

  const wrapperStyle: CSSProperties = isMobile
    ? {
        position: "fixed",
        // NavHeader is h-14 (56px). Sit 4px below so it doesn't kiss the
        // header line, with horizontal margins for breathing room.
        top: 60,
        left: 12,
        right: 12,
        width: "auto",
        zIndex: 40,
        pointerEvents: "auto",
        fontFamily: '"Inter", system-ui, sans-serif',
        background: "rgba(5, 8, 15, 0.78)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 8,
        padding: "8px 12px",
      }
    : {
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
    marginBottom: isMobile ? 2 : 6,
  };

  const inputStyle: CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: isMobile
      ? "none"
      : `1px solid ${focused ? "#7dd3fc" : "rgba(255, 255, 255, 0.15)"}`,
    color: "white",
    padding: isMobile ? "4px 0 2px" : "6px 0",
    fontSize: isMobile ? 14 : 13,
    fontFamily: '"Inter", system-ui, sans-serif',
    letterSpacing: "0.01em",
    width: "100%",
    outline: "none",
    transition: "border-color 120ms ease",
  };

  // Enter on mobile dismisses the keyboard so the user can see the galaxy
  // react to their query. Selection is already reactive on every keystroke.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isMobile && e.key === "Enter") {
      (e.currentTarget as HTMLInputElement).blur();
    }
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
        onKeyDown={handleKeyDown}
        placeholder="e.g. llm training, kernels, diffusion…"
        aria-label="Search galaxy by mission"
        inputMode="search"
        enterKeyHint="search"
        style={inputStyle}
      />
    </div>
  );
}
