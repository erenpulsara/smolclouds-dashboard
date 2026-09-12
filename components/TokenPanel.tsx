"use client";

import { useEffect, useState, useTransition } from "react";
import { rotate } from "@/app/(console)/token/actions";

export function TokenPanel({ token, createdAt }: { token: string; createdAt: string }) {
  const [current, setCurrent] = useState(token);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context, denied permission): reveal the
      // token so it can still be selected by hand.
      setRevealed(true);
    }
  }

  const shown = revealed
    ? current
    : `${current.slice(0, 14)}${"•".repeat(24)}${current.slice(-4)}`;

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
        <code className="min-w-0 flex-1 truncate text-sm text-dim">{shown}</code>
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          className="border border-line px-3 py-1 text-xs text-muted hover:border-line-bright hover:text-text"
        >
          {revealed ? "hide" : "reveal"}
        </button>
        <button
          type="button"
          onClick={copy}
          className="border border-text bg-text px-3 py-1 text-xs text-bg hover:bg-dim"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-xs text-muted">
        <span>issued {new Date(createdAt).toISOString().slice(0, 16).replace("T", " ")}</span>

        <span className="ml-auto flex items-center gap-2">
          {confirming ? (
            <>
              <span className="text-dim">rotating invalidates the current token.</span>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await rotate();
                    setCurrent(result.token);
                    setRevealed(true);
                    setConfirming(false);
                  })
                }
                className="border border-text bg-text px-2 py-1 text-bg hover:bg-dim"
              >
                {pending ? "rotating…" : "confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-2 py-1 hover:text-dim"
              >
                cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="border border-line px-3 py-1 hover:border-line-bright hover:text-text"
            >
              rotate
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
