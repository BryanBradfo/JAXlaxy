import { Fragment } from "react";
import type { ReactNode } from "react";

/**
 * Inline markdown subset supported in README entry descriptions:
 *   **bold text**         → <strong>
 *   *italic text*         → <em>
 *   [link text](url)      → <a target=_blank>
 *
 * Bold is matched first (longest-first via alternation order) so that
 * `**foo**` isn't mistaken for `*italic(*foo*)italic*`. Italic requires a
 * non-whitespace char immediately after the opening `*` to avoid matching
 * stray asterisks like "5 * 3 = 15". Nesting is supported — a link inside
 * bold recurses correctly.
 *
 * Not a full CommonMark parser. Meant for the ~40-char-average descriptions
 * in galaxy.json; edge cases like escaped asterisks (\*) are out of scope.
 */
const TOKEN_RE =
  /\*\*([\s\S]+?)\*\*|\*(\S[^*]*?)\*|\[([^\]]+?)\]\(([^)]+?)\)/;

export function parseInlineMd(
  text: string | null | undefined,
): ReactNode {
  if (!text) return null;
  return render(text);
}

function render(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (true) {
    const m = rest.match(TOKEN_RE);
    if (!m || m.index === undefined) {
      if (rest) out.push(<Fragment key={key++}>{rest}</Fragment>);
      break;
    }
    if (m.index > 0) {
      out.push(<Fragment key={key++}>{rest.slice(0, m.index)}</Fragment>);
    }
    if (m[1] !== undefined) {
      out.push(
        <strong key={key++} className="md-strong">
          {render(m[1])}
        </strong>,
      );
    } else if (m[2] !== undefined) {
      out.push(
        <em key={key++} className="md-em">
          {render(m[2])}
        </em>,
      );
    } else if (m[3] !== undefined) {
      out.push(
        <a
          key={key++}
          href={m[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="md-link"
          onClick={(e) => e.stopPropagation()}
        >
          {m[3]}
        </a>,
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}
