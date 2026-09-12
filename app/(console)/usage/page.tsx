import type { Metadata } from "next";
import { EmptyState, Panel, Rule, Stat, StatusDot } from "@/components/ui";
import { requirePilot } from "@/lib/gate";
import { listDeployments, type Deployment } from "@/lib/router";
import { ago } from "@/lib/time";

export const metadata: Metadata = { title: "Usage" };
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

function since(deployment: Deployment): number | null {
  if (!deployment.lastRequestAt) return null;
  const at = new Date(deployment.lastRequestAt).getTime();
  return Number.isNaN(at) ? null : Date.now() - at;
}

export default async function UsagePage() {
  const user = await requirePilot();
  const key = user.key;

  let deployments: Deployment[] = [];
  let failure = false;

  try {
    deployments = await listDeployments(key.token);
  } catch {
    failure = true;
  }

  const awake = deployments.filter((item) => item.state === "awake").length;
  const activeToday = deployments.filter((item) => {
    const age = since(item);
    return age !== null && age < DAY;
  }).length;
  const quiet = deployments.filter((item) => {
    const age = since(item);
    return age === null || age > 7 * DAY;
  }).length;

  const busiest = [...deployments]
    .filter((item) => item.lastRequestAt)
    .sort((a, b) => (since(a) ?? Infinity) - (since(b) ?? Infinity))
    .slice(0, 5);

  if (failure) {
    return (
      <>
        <Rule label="usage" />
        <Panel className="p-6">
          <p className="text-sm text-dim">✕ router unreachable</p>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Usage is derived from the deployment list, so it comes back as soon as the router
            answers again.
          </p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <Rule label="usage" right={<span className="text-xs text-faint">closed pilot · no billing</span>} />

      <div className="grid gap-px bg-line sm:grid-cols-3">
        <Stat value={deployments.length} label="apps" note="deployed to your account" />
        <Stat value={awake} label="awake now" note="running, using compute" />
        <Stat value={activeToday} label="active 24h" note="served at least one request" />
      </div>

      <div className="mt-12">
        <Rule label="recent activity" />
        {busiest.length === 0 ? (
          <EmptyState title="no requests recorded yet">
            Apps appear here once the router has served them at least once.
          </EmptyState>
        ) : (
          <Panel>
            {busiest.map((deployment) => (
              <div
                key={deployment.id}
                className="flex items-center gap-6 border-b border-line px-5 py-3 last:border-b-0"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-dim">{deployment.name}</span>
                <StatusDot state={deployment.state} />
                <span className="w-28 text-right text-xs text-muted tabular-nums">
                  {ago(deployment.lastRequestAt)}
                </span>
              </div>
            ))}
          </Panel>
        )}
      </div>

      {quiet > 0 ? (
        <p className="mt-6 text-xs text-muted">
          {quiet} {quiet === 1 ? "app has" : "apps have"} had no request in the last 7 days. A
          sleeping app uses no active compute, but still holds storage and routing.
        </p>
      ) : null}

      <p className="mt-12 text-xs text-faint">signed in as {user.email ?? user.userId}</p>
    </>
  );
}
