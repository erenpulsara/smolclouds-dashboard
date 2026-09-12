"use client";

import { useState, useTransition } from "react";
import type { Deployment } from "@/lib/router";
import { removeDeployment } from "@/app/(console)/apps/actions";
import { StatusDot } from "@/components/ui";
import { ago } from "@/lib/time";

export function DeploymentList({ deployments }: { deployments: Deployment[] }) {
  return (
    <ul className="border border-line">
      {deployments.map((deployment, index) => (
        <li
          key={deployment.id}
          className="animate-boot"
          style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
        >
          <Row deployment={deployment} />
        </li>
      ))}
    </ul>
  );
}

function Row({ deployment }: { deployment: Deployment }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function destroy() {
    setError(null);
    startTransition(async () => {
      const result = await removeDeployment(deployment.id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div
      className={`border-b border-line bg-surface px-5 py-4 transition-colors last:border-b-0 hover:bg-surface-2 ${
        pending ? "opacity-40" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm">{deployment.name}</div>
          {deployment.url ? (
            <a
              href={deployment.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-xs text-muted underline decoration-ghost underline-offset-4 hover:decoration-muted"
            >
              {deployment.url.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            <div className="mt-1 text-xs text-ghost">{deployment.id}</div>
          )}
        </div>

        <div className="w-24 shrink-0">
          <StatusDot state={deployment.state} />
        </div>

        <div className="w-28 shrink-0 text-right text-xs text-muted tabular-nums">
          {ago(deployment.lastRequestAt)}
        </div>

        <div className="w-32 shrink-0 text-right">
          {confirming ? (
            <span className="inline-flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={destroy}
                disabled={pending}
                className="border border-text bg-text px-2 py-1 text-bg hover:bg-dim"
              >
                delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-2 py-1 text-muted hover:text-dim"
              >
                cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="border border-line px-3 py-1 text-xs text-muted hover:border-line-bright hover:text-text"
            >
              delete
            </button>
          )}
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-dim">✕ {error}</p> : null}
      {confirming ? (
        <p className="mt-3 text-xs text-muted">
          deleting <span className="text-dim">{deployment.name}</span> removes the app and its
          storage. this cannot be undone.
        </p>
      ) : null}
    </div>
  );
}
