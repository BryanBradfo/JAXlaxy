import { useEffect, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { PositionedStar } from "./StarField";
import type { Status } from "../types/galaxy";

interface Props {
  star: PositionedStar | null;
  onClose: () => void;
}

const ACCENT = "#7dd3fc";
const MONO = '"JetBrains Mono", ui-monospace, "SF Mono", monospace';
const SANS = '"Inter", system-ui, sans-serif';

// Map status emoji → precision-instrument status dot colors. Same palette
// as the 3D scene so the card is unambiguously "this IS that star."
const STATUS_COLOR: Record<Status, string> = {
  "🟢": "#39ff88",
  "🟡": "#ffd93d",
  "🔴": "#ff4d4d",
};

const STATUS_LABEL: Record<Status, string> = {
  "🟢": "Active",
  "🟡": "Stable",
  "🔴": "Legacy",
};

const CARD_STYLE: CSSProperties = {
  position: "fixed",
  bottom: 20,
  right: 20,
  width: 380,
  maxWidth: "calc(100vw - 40px)",
  background: "rgba(5, 8, 15, 0.92)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  borderRadius: 4,
  boxShadow:
    "0 20px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.02) inset",
  transition: "opacity 240ms ease, transform 240ms ease",
  zIndex: 50,
  color: "white",
  fontFamily: SANS,
};

const CLOSE_BUTTON_STYLE: CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: 3,
  color: "rgba(255, 255, 255, 0.5)",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
  fontFamily: SANS,
  transition: "background 120ms ease, color 120ms ease, border-color 120ms ease",
};

const LAUNCH_BUTTON_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "7px 12px",
  background: "transparent",
  border: "1px solid rgba(125, 211, 252, 0.35)",
  color: ACCENT,
  borderRadius: 3,
  textDecoration: "none",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  fontFamily: SANS,
  transition:
    "background 140ms ease, border-color 140ms ease, color 140ms ease",
};

export function StarCard({ star, onClose }: Props) {
  const [displayed, setDisplayed] = useState<PositionedStar | null>(star);
  const [launchHover, setLaunchHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  useEffect(() => {
    if (star) {
      setDisplayed(star);
      return;
    }
    const t = window.setTimeout(() => setDisplayed(null), 280);
    return () => window.clearTimeout(t);
  }, [star]);

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  const containerStyle: CSSProperties = {
    ...CARD_STYLE,
    opacity: star ? 1 : 0,
    transform: star ? "translateY(0)" : "translateY(8px)",
    pointerEvents: star ? "auto" : "none",
  };

  const launchStyle: CSSProperties = {
    ...LAUNCH_BUTTON_STYLE,
    ...(launchHover
      ? {
          background: "rgba(125, 211, 252, 0.08)",
          borderColor: "rgba(125, 211, 252, 0.6)",
          color: "#bae6fd",
        }
      : {}),
  };

  const closeStyle: CSSProperties = {
    ...CLOSE_BUTTON_STYLE,
    ...(closeHover
      ? {
          background: "rgba(255, 255, 255, 0.04)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          color: "rgba(255, 255, 255, 0.9)",
        }
      : {}),
  };

  return (
    <div style={containerStyle} role="dialog" aria-hidden={!star}>
      {displayed && (
        <div style={{ padding: "16px 18px" }}>
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

          {/* Eyebrow: section label, uppercase, tracked, tiny */}
          <div
            style={{
              fontSize: 9,
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: SANS,
              paddingRight: 32,
            }}
          >
            {displayed.section}
          </div>

          {/* Title row: status dot + repo slug in monospace */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              paddingRight: 32,
            }}
          >
            <span
              aria-label={STATUS_LABEL[displayed.status]}
              title={STATUS_LABEL[displayed.status]}
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: STATUS_COLOR[displayed.status],
                boxShadow: `0 0 4px ${STATUS_COLOR[displayed.status]}`,
                flexShrink: 0,
              }}
            />
            <h3
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                color: "white",
                fontFamily: MONO,
                letterSpacing: "-0.01em",
                wordBreak: "break-word",
              }}
            >
              {displayed.user}/{displayed.repo}
            </h3>
          </div>

          {/* Description — Inter, 12px, tracked, muted */}
          {displayed.description && (
            <p
              style={{
                margin: 0,
                marginBottom: 14,
                fontSize: 12,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: SANS,
                letterSpacing: "0.01em",
              }}
            >
              {displayed.description}
            </p>
          )}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255, 255, 255, 0.06)",
              margin: "14px 0",
            }}
          />

          {/* Properties grid — two-column key/value rows */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "76px 1fr",
              gap: "6px 16px",
              marginBottom: 16,
              fontSize: 11,
            }}
          >
            <PropKey>Stars</PropKey>
            <PropVal>
              {displayed.stars !== null ? displayed.stars.toLocaleString() : "—"}
            </PropVal>
            <PropKey>Status</PropKey>
            <PropVal>{STATUS_LABEL[displayed.status]}</PropVal>
            {displayed.last_push_months_ago !== null && (
              <>
                <PropKey>Last Push</PropKey>
                <PropVal>
                  {displayed.last_push_months_ago < 1
                    ? "< 1 mo ago"
                    : `${displayed.last_push_months_ago.toFixed(1)} mo ago`}
                </PropVal>
              </>
            )}
          </div>

          <a
            href={displayed.url}
            target="_blank"
            rel="noopener noreferrer"
            style={launchStyle}
            onMouseEnter={() => setLaunchHover(true)}
            onMouseLeave={() => setLaunchHover(false)}
          >
            Launch Repository <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}

function PropKey({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "rgba(255, 255, 255, 0.35)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: SANS,
        fontSize: 9,
        paddingTop: 2,
      }}
    >
      {children}
    </div>
  );
}

function PropVal({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "rgba(255, 255, 255, 0.9)",
        fontFamily: MONO,
        fontSize: 12,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {children}
    </div>
  );
}
