"use client";

import { useEffect } from "react";

/**
 * Console-wide error boundary. Clerk rate limits (429) and router timeouts both
 * land here; neither should show the default Next.js screen.
 */
export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border border-line bg-surface p-8">
      <p className="text-sm text-dim">✕ the console could not load this page</p>
      <p className="mt-4 max-w-prose text-xs leading-relaxed text-muted">
        Usually this is Clerk or the router answering slowly or rate limiting the request. Trying
        again is safe — nothing was changed.
      </p>
      {error.digest ? <p className="mt-3 text-xs text-ghost">digest {error.digest}</p> : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-text bg-text px-4 py-2 text-xs text-bg hover:bg-dim"
      >
        try again
      </button>
    </div>
  );
}
