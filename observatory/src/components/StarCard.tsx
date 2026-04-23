import { useEffect, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { PositionedStar } from "./StarField";

interface Props {
  star: PositionedStar | null;
  onClose: () => void;
}

const CARD_STYLE: CSSProperties = {
  position: "fixed",
  bottom: 24,
  right: 24,
  width: 380,
  maxWidth: "calc(100vw - 48px)",
  padding: 20,
  background: "rgba(2, 6, 16, 0.72)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(0, 242, 255, 0.22)",
  borderRadius: 14,
  boxShadow:
    "0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 242, 255, 0.06) inset",
  transition: "opacity 260ms ease, transform 260ms ease",
  zIndex: 50,
  fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
  color: "white",
};

const CLOSE_BUTTON_STYLE: CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 6,
  color: "rgba(255, 255, 255, 0.6)",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  transition: "background 120ms ease, color 120ms ease, border-color 120ms ease",
};

const LAUNCH_BUTTON_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  background: "rgba(0, 242, 255, 0.1)",
  border: "1px solid rgba(0, 242, 255, 0.4)",
  color: "#00f2ff",
  borderRadius: 8,
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 0.2,
  transition:
    "background 140ms ease, border-color 140ms ease, transform 140ms ease",
};

export function StarCard({ star, onClose }: Props) {
  // `displayed` lags `star` by the exit-animation duration, so the card's
  // CONTENT stays mounted while the card fades out. Without this, unmounting
  // the div would cut the fade short.
  const [displayed, setDisplayed] = useState<PositionedStar | null>(star);
  // Local hover state for button styling (inline styles have no :hover).
  const [launchHover, setLaunchHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  useEffect(() => {
    if (star) {
      setDisplayed(star);
      return;
    }
    const t = window.setTimeout(() => setDisplayed(null), 300);
    return () => window.clearTimeout(t);
  }, [star]);

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  const containerStyle: CSSProperties = {
    ...CARD_STYLE,
    opacity: star ? 1 : 0,
    transform: star ? "translateY(0)" : "translateY(14px)",
    pointerEvents: star ? "auto" : "none",
  };

  const launchStyle: CSSProperties = {
    ...LAUNCH_BUTTON_STYLE,
    ...(launchHover
      ? {
          background: "rgba(0, 242, 255, 0.18)",
          borderColor: "rgba(0, 242, 255, 0.6)",
          transform: "translateY(-1px)",
        }
      : {}),
  };

  const closeStyle: CSSProperties = {
    ...CLOSE_BUTTON_STYLE,
    ...(closeHover
      ? {
          background: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          color: "rgba(255, 255, 255, 0.9)",
        }
      : {}),
  };

  return (
    <div style={containerStyle} role="dialog" aria-hidden={!star}>
      {displayed && (
        <>
          <button
            type="button"
            aria-label="Close"
            style={closeStyle}
            onClick={handleCloseClick}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
          >
            ×
          </button>

          <div
            style={{
              fontSize: 11,
              color: "rgba(255, 255, 255, 0.45)",
              marginBottom: 6,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            {displayed.section}
          </div>

          <h3
            style={{
              margin: 0,
              marginBottom: 10,
              fontSize: 18,
              fontWeight: 600,
              color: "#00f2ff",
              letterSpacing: 0.2,
              paddingRight: 28,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span aria-hidden="true">{displayed.status}</span>
            <span>
              {displayed.user}/{displayed.repo}
            </span>
          </h3>

          {displayed.description && (
            <p
              style={{
                margin: 0,
                marginBottom: 14,
                fontSize: 13,
                lineHeight: 1.55,
                color: "rgba(255, 255, 255, 0.75)",
              }}
            >
              {displayed.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.7)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span aria-hidden="true">⭐</span>{" "}
              {displayed.stars !== null
                ? displayed.stars.toLocaleString()
                : "—"}
            </span>

            <a
              href={displayed.url}
              target="_blank"
              rel="noopener noreferrer"
              style={launchStyle}
              onMouseEnter={() => setLaunchHover(true)}
              onMouseLeave={() => setLaunchHover(false)}
            >
              Launch to GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
