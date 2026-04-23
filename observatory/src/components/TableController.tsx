import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Galaxy, Star, Status } from "../types/galaxy";

type SortKey = "stars" | "name";
type SortDir = "asc" | "desc";

const ACCENT = "#7dd3fc";
const MONO = '"JetBrains Mono", ui-monospace, "SF Mono", monospace';
const SANS = '"Inter", system-ui, sans-serif';

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

function matchesQuery(star: Star, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  const slug = `${star.user}/${star.repo}`.toLowerCase();
  const desc = (star.description ?? "").toLowerCase();
  return slug.includes(needle) || desc.includes(needle);
}

function compareStars(a: Star, b: Star, key: SortKey, dir: SortDir): number {
  const mul = dir === "asc" ? 1 : -1;
  if (key === "stars") {
    return mul * ((a.stars ?? 0) - (b.stars ?? 0));
  }
  return mul * `${a.user}/${a.repo}`.localeCompare(`${b.user}/${b.repo}`);
}

export default function TableController() {
  const [galaxy, setGalaxy] = useState<Galaxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("stars");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [queryFocused, setQueryFocused] = useState(false);

  useEffect(() => {
    fetch("/galaxy.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Galaxy>;
      })
      .then(setGalaxy)
      .catch((e) => setError(String(e)));
  }, []);

  const sections = useMemo(() => {
    if (!galaxy) return [];
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const s of galaxy.stars) {
      if (s.section && !seen.has(s.section)) {
        seen.add(s.section);
        ordered.push(s.section);
      }
    }
    return ordered;
  }, [galaxy]);

  const rows = useMemo(() => {
    if (!galaxy) return [];
    const q = query.trim();
    return galaxy.stars
      .filter((s) => !selectedSection || s.section === selectedSection)
      .filter((s) => matchesQuery(s, q))
      .slice()
      .sort((a, b) => compareStars(a, b, sortKey, sortDir));
  }, [galaxy, query, selectedSection, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "stars" ? "desc" : "asc");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedSection(null);
  };

  if (error) {
    return (
      <div
        className="py-20 text-center"
        style={{
          color: "rgba(255, 255, 255, 0.55)",
          fontSize: 12,
          fontFamily: SANS,
          letterSpacing: "0.01em",
        }}
      >
        Failed to load <code style={{ fontFamily: MONO }}>galaxy.json</code>:{" "}
        {error}
        <br />
        <span style={{ marginTop: 8, display: "inline-block" }}>
          Generate with{" "}
          <code style={{ fontFamily: MONO, color: "rgba(255, 255, 255, 0.85)" }}>
            python scripts/health_check.py --json observatory/public/galaxy.json
          </code>
        </span>
      </div>
    );
  }

  if (!galaxy) {
    return (
      <div
        className="py-20 text-center"
        style={{
          color: "rgba(255, 255, 255, 0.35)",
          fontSize: 11,
          fontFamily: SANS,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Loading…
      </div>
    );
  }

  const inputStyle: CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${
      queryFocused ? ACCENT : "rgba(255, 255, 255, 0.1)"
    }`,
    color: "white",
    padding: "8px 0",
    fontSize: 13,
    fontFamily: SANS,
    letterSpacing: "0.01em",
    width: "100%",
    outline: "none",
    transition: "border-color 120ms ease",
  };

  // Pills — small, sharp-cornered (2px), high-density.
  const pill = (active: boolean): CSSProperties => ({
    padding: "3px 7px",
    borderRadius: 2,
    fontSize: 10,
    border: active
      ? `1px solid ${ACCENT}`
      : "1px solid rgba(255, 255, 255, 0.1)",
    background: active ? "rgba(125, 211, 252, 0.08)" : "transparent",
    color: active ? ACCENT : "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: SANS,
    fontWeight: 500,
    transition: "all 100ms ease",
  });

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "";

  return (
    <div style={{ fontFamily: SANS }}>
      {/* Header band — Swiss-grid layout */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255, 255, 255, 0.35)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: SANS,
              }}
            >
              JAXlaxy · Dataset
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.01em",
                color: "white",
                margin: 0,
              }}
            >
              Repository Index
            </h1>
          </div>

          {/* Stats block — monochrome. Data readout feel, no accent. */}
          <div
            style={{
              display: "flex",
              gap: 28,
              fontFamily: MONO,
              fontSize: 11,
            }}
          >
            <Stat label="Total" value={galaxy.stars.length.toString()} />
            <Stat label="Showing" value={rows.length.toString()} />
            <Stat
              label="Generated"
              value={new Date(galaxy.generated_at)
                .toISOString()
                .slice(0, 10)}
            />
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div
              style={{
                fontSize: 9,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
                fontFamily: SANS,
              }}
            >
              Search
            </div>
            <input
              type="search"
              placeholder="Filter by name or description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setQueryFocused(true)}
              onBlur={() => setQueryFocused(false)}
              style={inputStyle}
              aria-label="Search repositories"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div
              style={{
                fontSize: 9,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
                fontFamily: SANS,
              }}
            >
              Section
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                style={pill(selectedSection === null)}
              >
                All
              </button>
              {sections.map((section) => (
                <button
                  type="button"
                  key={section}
                  onClick={() =>
                    setSelectedSection(
                      selectedSection === section ? null : section,
                    )
                  }
                  style={pill(selectedSection === section)}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Airy scientific-paper table */}
      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <th style={thStyle({ width: 36 })} aria-label="Status"></th>
              <th
                style={thStyle({ sortable: true })}
                onClick={() => toggleSort("name")}
                aria-sort={
                  sortKey === "name"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Repository{" "}
                <span style={{ color: ACCENT, marginLeft: 4 }}>
                  {sortIndicator("name")}
                </span>
              </th>
              <th style={thStyle()}>Section</th>
              <th
                style={thStyle({ align: "right", sortable: true })}
                onClick={() => toggleSort("stars")}
                aria-sort={
                  sortKey === "stars"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span style={{ color: ACCENT, marginRight: 4 }}>
                  {sortIndicator("stars")}
                </span>
                Stars
              </th>
              <th style={thStyle()}>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "56px 0",
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: 12,
                    fontFamily: SANS,
                  }}
                >
                  No repositories match your filters.{" "}
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      textDecoration: "underline",
                      fontFamily: SANS,
                      fontSize: 12,
                    }}
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((s) => <Row key={`${s.user}/${s.repo}`} star={s} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Footer hint — monochrome, subtle */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 18,
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          textAlign: "center",
          fontSize: 10,
          color: "rgba(255, 255, 255, 0.3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: SANS,
        }}
      >
        Prefer the spatial view?{" "}
        <a
          href="/"
          style={{
            color: "rgba(255, 255, 255, 0.55)",
            textDecoration: "none",
            transition: "color 120ms ease",
            marginLeft: 8,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(255, 255, 255, 0.9)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(255, 255, 255, 0.55)")
          }
        >
          → Galaxy Map
        </a>
      </div>
    </div>
  );
}

// —— helpers ————————————————————————————————

function thStyle(opts: {
  width?: number;
  align?: "left" | "right";
  sortable?: boolean;
} = {}): CSSProperties {
  return {
    padding: "10px 12px",
    textAlign: opts.align ?? "left",
    width: opts.width,
    fontSize: 9,
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: SANS,
    cursor: opts.sortable ? "pointer" : "default",
    userSelect: opts.sortable ? "none" : "auto",
    whiteSpace: "nowrap",
  };
}

// Airy row padding — 14px vertical matches scientific-paper \arraystretch=1.2
const TD_BASE: CSSProperties = {
  padding: "14px 12px",
  fontFamily: SANS,
  fontSize: 12,
  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
};

function Row({ star }: { star: Star }) {
  const [hovered, setHovered] = useState(false);
  const rowStyle: CSSProperties = {
    transition: "background 120ms ease",
    background: hovered ? "rgba(255, 255, 255, 0.02)" : "transparent",
  };

  return (
    <tr
      style={rowStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={TD_BASE}>
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: STATUS_COLOR[star.status],
            boxShadow: `0 0 4px ${STATUS_COLOR[star.status]}`,
          }}
          title={STATUS_LABEL[star.status]}
          aria-label={STATUS_LABEL[star.status]}
        />
      </td>
      <td
        style={{
          ...TD_BASE,
          fontFamily: MONO,
          whiteSpace: "nowrap",
        }}
      >
        <a
          href={star.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            textDecoration: "none",
            transition: "color 120ms ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "white")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(255, 255, 255, 0.9)")
          }
        >
          {star.user}/{star.repo}
          <span
            style={{
              color: "rgba(255, 255, 255, 0.2)",
              marginLeft: 4,
              fontSize: 10,
            }}
          >
            ↗
          </span>
        </a>
      </td>
      <td
        style={{
          ...TD_BASE,
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: 11,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {star.section}
      </td>
      <td
        style={{
          ...TD_BASE,
          fontFamily: MONO,
          textAlign: "right",
          color: "rgba(255, 255, 255, 0.9)",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {star.stars !== null ? star.stars.toLocaleString() : "—"}
      </td>
      <td
        style={{
          ...TD_BASE,
          color: "rgba(255, 255, 255, 0.68)",
          maxWidth: 520,
          lineHeight: 1.55,
        }}
      >
        {star.description}
      </td>
    </tr>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: "rgba(255, 255, 255, 0.4)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: SANS,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "rgba(255, 255, 255, 0.9)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}
