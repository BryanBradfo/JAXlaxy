import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Galaxy, Star, Status } from "../types/galaxy";

type SortKey = "stars" | "name";
type SortDir = "asc" | "desc";

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

const CYAN = "#00f2ff";

// Search matches either the full "user/repo" slug or the description. Case-
// insensitive, trimmed — the cheapest UX win. No fuzzy matching: with ~75
// entries and quick descriptions, substring is plenty.
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
    // Preserve README order (section's first appearance in galaxy.stars).
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
      // Sensible default direction per key: stars desc (biggest first),
      // name asc (A–Z).
      setSortDir(key === "stars" ? "desc" : "asc");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedSection(null);
  };

  if (error) {
    return (
      <div className="py-20 text-center text-white/60 text-sm">
        Failed to load <code>galaxy.json</code>: {error}
        <br />
        Generate it with:{" "}
        <code style={{ color: CYAN }}>
          python scripts/health_check.py --json observatory/public/galaxy.json
        </code>
      </div>
    );
  }

  if (!galaxy) {
    return (
      <div className="py-20 text-center text-white/40 text-sm">
        Loading constellations…
      </div>
    );
  }

  const inputStyle: CSSProperties = {
    background: "rgba(0, 0, 0, 0.4)",
    border: `1px solid ${
      queryFocused ? "rgba(0, 242, 255, 0.6)" : "rgba(255, 255, 255, 0.1)"
    }`,
    borderRadius: 8,
    color: "white",
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "border-color 120ms ease",
  };

  const pill = (active: boolean): CSSProperties => ({
    padding: "6px 12px",
    borderRadius: 9999,
    fontSize: 11,
    border: active
      ? `1px solid ${CYAN}80`
      : "1px solid rgba(255, 255, 255, 0.1)",
    background: active ? "rgba(0, 242, 255, 0.12)" : "transparent",
    color: active ? CYAN : "rgba(255, 255, 255, 0.6)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: 0.2,
    transition: "all 120ms ease",
  });

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "";

  return (
    <div>
      {/* Header row: title + stats + search */}
      <div className="flex flex-col md:flex-row gap-5 items-start md:items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span style={{ color: CYAN }}>Data</span>
            <span className="text-white/70"> Table</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {rows.length}{" "}
            {rows.length === 1 ? "repository" : "repositories"}{" "}
            {rows.length !== galaxy.stars.length && (
              <span className="text-white/35">
                of {galaxy.stars.length}
              </span>
            )}{" "}
            ·{" "}
            <span className="text-white/40">
              generated {new Date(galaxy.generated_at).toLocaleDateString()}
            </span>
          </p>
        </div>
        <div className="w-full md:w-96">
          <input
            type="search"
            placeholder="Search repos or descriptions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setQueryFocused(true)}
            onBlur={() => setQueryFocused(false)}
            style={inputStyle}
            aria-label="Search repositories"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-5">
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

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.015)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <tr className="text-left text-white/45 text-[10px] uppercase tracking-[0.12em]">
                <th className="px-4 py-3 w-12" aria-label="Status"></th>
                <th
                  className="px-4 py-3 cursor-pointer select-none hover:text-white/80 transition"
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
                  <span style={{ color: CYAN }}>{sortIndicator("name")}</span>
                </th>
                <th className="px-4 py-3">Section</th>
                <th
                  className="px-4 py-3 text-right cursor-pointer select-none hover:text-white/80 transition"
                  onClick={() => toggleSort("stars")}
                  aria-sort={
                    sortKey === "stars"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <span style={{ color: CYAN }}>{sortIndicator("stars")}</span>{" "}
                  Stars
                </th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-white/40 text-sm"
                  >
                    No repositories match your filters.{" "}
                    <button
                      type="button"
                      onClick={resetFilters}
                      style={{ color: CYAN, textDecoration: "underline" }}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ) : (
                rows.map((s) => (
                  <tr
                    key={`${s.user}/${s.repo}`}
                    className="transition"
                    style={{
                      borderTop: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255, 255, 255, 0.025)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{
                          background: STATUS_COLOR[s.status],
                          boxShadow: `0 0 8px ${STATUS_COLOR[s.status]}`,
                        }}
                        title={STATUS_LABEL[s.status]}
                        aria-label={STATUS_LABEL[s.status]}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white transition"
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color = CYAN)
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "white")
                        }
                      >
                        {s.user}/{s.repo}{" "}
                        <span className="text-white/25 text-xs">↗</span>
                      </a>
                    </td>
                    <td className="px-4 py-3 text-white/50 whitespace-nowrap text-xs">
                      {s.section}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-white/85"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {s.stars !== null ? s.stars.toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-white/65 max-w-xl">
                      {s.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-xs text-white/30 text-center">
        Prefer the spatial view?{" "}
        <a
          href="/"
          className="transition"
          style={{ color: "rgba(255, 255, 255, 0.55)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = CYAN)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(255, 255, 255, 0.55)")
          }
        >
          Return to the Galaxy Map →
        </a>
      </p>
    </div>
  );
}
