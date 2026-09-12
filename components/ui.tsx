import type { ReactNode } from "react";

/** A labelled hairline, the console's only section divider. */
export function Rule({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="rule mb-4 text-[11px] uppercase tracking-[0.2em] text-muted">
      <span>{label}</span>
      {right ? <span className="ml-3 shrink-0 normal-case tracking-normal">{right}</span> : null}
    </div>
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
  return (
    <div className={`border border-line bg-surface ${className}`}>{children}</div>
  );
}

const STATE_COPY = {
  awake: { glyph: "●", label: "awake", tone: "text-text", live: true },
  starting: { glyph: "◐", label: "waking", tone: "text-dim", live: true },
  asleep: { glyph: "○", label: "asleep", tone: "text-faint", live: false },
  error: { glyph: "✕", label: "error", tone: "text-text", live: false },
  unknown: { glyph: "·", label: "unknown", tone: "text-ghost", live: false },
} as const;

export function StatusDot({ state }: { state: keyof typeof STATE_COPY }) {
  const copy = STATE_COPY[state] ?? STATE_COPY.unknown;
  return (
    <span className={`inline-flex items-center gap-2 text-xs ${copy.tone}`}>
      <span aria-hidden className={copy.live ? "animate-breathe" : undefined}>
        {copy.glyph}
      </span>
      {copy.label}
    </span>
  );
}

/** Key/value line used across /apps and /usage. */
export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</span>
      <span className="text-sm text-dim">{value}</span>
    </div>
  );
}

export function Stat({ value, label, note }: { value: ReactNode; label: string; note?: string }) {
  return (
    <Panel className="p-6">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</div>
      <div className="mt-4 text-5xl font-light leading-none tabular-nums">{value}</div>
      {note ? <div className="mt-3 text-xs text-faint">{note}</div> : null}
    </Panel>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Panel className="p-10 text-center">
      <div className="text-sm text-dim">{title}</div>
      {children ? <div className="mt-3 text-xs leading-relaxed text-muted">{children}</div> : null}
    </Panel>
  );
}
