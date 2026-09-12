import type { ReactNode } from "react";

/* --- Type scale ----------------------------------------------------------
   Three sizes carry the whole console: a 10px tracked-out label, 13px body,
   and a light display number. Everything else is a weight or a grey step. */

export const LABEL = "text-[10px] uppercase tracking-[0.22em] text-muted";

/** A labelled hairline. The console's only section divider. */
export function Rule({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="rule mb-5 text-[10px] uppercase tracking-[0.22em] text-muted">
      <span>{label}</span>
      {right ? (
        <span className="ml-3 shrink-0 normal-case tracking-normal text-faint">{right}</span>
      ) : null}
    </div>
  );
}

/** Page title block: the rule, plus a sentence saying what the page is for. */
export function PageHeader({
  label,
  title,
  description,
  right,
}: {
  label: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-8">
      <Rule label={label} right={right} />
      <h1 className="text-xl font-light tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-muted">{description}</p>
      ) : null}
    </header>
  );
}

/** A bordered block. No radius, no shadow — the border is the whole idea. */
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`border border-line bg-surface ${className}`}>{children}</div>;
}

/* --- State ---------------------------------------------------------------
   With no hue in the system, state is carried by three channels at once:
   glyph, word, and brightness. None of them is colour, so none of them fails
   in grayscale, under CVD, or in forced-colors. */

export type RunState = "awake" | "asleep" | "starting" | "error" | "unknown";

const STATE = {
  awake: { glyph: "●", label: "awake", tone: "text-text", live: true },
  starting: { glyph: "◐", label: "waking", tone: "text-dim", live: true },
  asleep: { glyph: "○", label: "asleep", tone: "text-faint", live: false },
  error: { glyph: "✕", label: "error", tone: "text-text", live: false },
  unknown: { glyph: "·", label: "unknown", tone: "text-ghost", live: false },
} as const;

export function StatusBadge({ state }: { state: RunState }) {
  const copy = STATE[state] ?? STATE.unknown;
  return (
    <span
      className={`inline-flex items-center gap-2 border border-line px-2.5 py-1 text-[11px] ${copy.tone}`}
    >
      <span aria-hidden className={copy.live ? "animate-breathe" : undefined}>
        {copy.glyph}
      </span>
      {copy.label}
    </span>
  );
}

/** The 2px rail down the left of a row — state, readable at a glance. */
export function StateRail({ state }: { state: RunState }) {
  const live = STATE[state]?.live;
  return (
    <span
      aria-hidden
      className={`absolute inset-y-0 left-0 w-[2px] ${
        state === "awake"
          ? "bg-text"
          : state === "starting"
            ? "bg-dim animate-breathe"
            : state === "unknown"
              ? "bg-ghost"
              : "bg-line-bright"
      } ${live && state !== "starting" ? "animate-breathe" : ""}`}
    />
  );
}

/* --- Figures -------------------------------------------------------------
   Headline numbers are proportional, not tabular: at display sizes tabular
   figures give every digit the width of a zero and the number reads loose.
   Columns of numbers keep `tabular-nums` so they still align. */

export function Stat({
  value,
  label,
  note,
}: {
  value: ReactNode;
  label: string;
  note?: string;
}) {
  return (
    <div className="bg-surface p-6">
      <div className={LABEL}>{label}</div>
      <div className="mt-5 text-[44px] font-light leading-none [font-variant-numeric:proportional-nums]">
        {value}
      </div>
      {note ? <div className="mt-3 text-[11px] leading-relaxed text-faint">{note}</div> : null}
    </div>
  );
}

/**
 * A single ratio against its whole. The unfilled track is a dimmer step of the
 * same (only) ramp, so the whole bar reads as one measure.
 */
export function Meter({
  value,
  total,
  label,
  caption,
}: {
  value: number;
  total: number;
  label: string;
  caption?: string;
}) {
  const share = total > 0 ? value / total : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className={LABEL}>{label}</span>
        <span className="text-[11px] tabular-nums text-muted">
          {value} / {total}
        </span>
      </div>
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
        className="mt-3 flex h-1.5 w-full bg-line"
      >
        <span
          aria-hidden
          className="bg-text transition-[width] duration-500"
          style={{ width: `${Math.round(share * 100)}%` }}
        />
      </div>
      {caption ? <p className="mt-3 text-[11px] text-faint">{caption}</p> : null}
    </div>
  );
}

/**
 * Magnitude across a handful of named classes. One series, so identity comes
 * from the labels sitting beside each bar rather than from any colour, and
 * every bar is direct-labelled with its count.
 */
export function BarRow({
  rows,
  emptyLabel = "no data",
}: {
  rows: { label: string; value: number }[];
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  if (total === 0) {
    return <p className="text-[11px] text-faint">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center gap-4">
          <span className="w-28 shrink-0 text-[11px] text-muted">{row.label}</span>
          <span className="flex h-2 min-w-0 flex-1 bg-surface-2">
            <span
              aria-hidden
              className={row.value > 0 ? "bg-dim" : ""}
              style={{ width: `${Math.round((row.value / max) * 100)}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-dim">
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* --- States --------------------------------------------------------------- */

export function Step({
  n,
  title,
  state = "todo",
  children,
}: {
  n: number;
  title: string;
  state?: "done" | "current" | "todo";
  children?: ReactNode;
}) {
  const done = state === "done";
  const current = state === "current";

  return (
    <li className="flex gap-5">
      <span
        aria-hidden
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] tabular-nums ${
          done
            ? "border-line bg-text text-bg"
            : current
              ? "border-text text-text"
              : "border-line text-faint"
        }`}
      >
        {done ? "✓" : String(n).padStart(2, "0")}
      </span>
      <div className={`min-w-0 flex-1 pb-8 ${current || done ? "" : "opacity-55"}`}>
        <h3 className={`text-[13px] ${current ? "text-text" : "text-dim"}`}>{title}</h3>
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
    </li>
  );
}

/**
 * The designed failure state. A dropped connection is a normal condition for a
 * console whose backend deploys separately, so it gets a diagram and a next
 * step rather than a stack trace.
 */
export function Diagnostic({
  from,
  to,
  title,
  children,
  action,
}: {
  from: string;
  to: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Panel className="p-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
        <span className="border border-line px-3 py-1.5 text-dim">{from}</span>
        <span aria-hidden className="flex items-center gap-2 text-faint">
          <span className="inline-block h-px w-8 bg-line-bright" />
          <span className="text-text">✕</span>
          <span className="inline-block h-px w-8 bg-line-bright" />
        </span>
        <span className="border border-dashed border-line-bright px-3 py-1.5 text-faint">
          {to}
        </span>
      </div>

      <h2 className="mt-7 text-[13px] text-dim">{title}</h2>
      {children ? (
        <div className="mt-3 max-w-prose text-[11px] leading-relaxed text-muted">{children}</div>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </Panel>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0">
      <span className={LABEL}>{label}</span>
      <span className="text-[13px] text-dim">{value}</span>
    </div>
  );
}
