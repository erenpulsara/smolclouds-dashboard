import type { Metadata } from "next";
import Link from "next/link";
import {
  BarRow,
  Diagnostic,
  Meter,
  PageHeader,
  Panel,
  Rule,
  Stat,
  StatusBadge,
} from "@/components/ui";
import { requirePilot } from "@/lib/gate";
import { listDeployments, type Deployment } from "@/lib/router";
import { site } from "@/lib/site";
import { ago, exact } from "@/lib/time";

export const metadata: Metadata = { title: "Usage" };
export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** Milliseconds since the app last served a request, or null if it never has. */
function idleFor(deployment: Deployment): number | null {
  if (!deployment.lastRequestAt) return null;
  const at = new Date(deployment.lastRequestAt).getTime();
  return Number.isNaN(at) ? null : Date.now() - at;
}

export default async function UsagePage() {
  const user = await requirePilot();

  let deployments: Deployment[] = [];
  let failed = false;

  try {
    deployments = await listDeployments(user.key.token);
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <>
        <PageHeader label="usage" title="Usage" />
        <Diagnostic
          from={site.console}
          to={site.apiBase.replace(/^https?:\/\//, "")}
          title="The console could not reach the router"
          action={
            <Link
              href="/usage"
              className="inline-block border border-text bg-text px-4 py-2 text-[11px] text-bg transition-colors hover:bg-dim"
            >
              try again
            </Link>
          }
        >
          Usage is derived from the deployment list, so every number here comes back as soon as the
          router answers again.
        </Diagnostic>
      </>
    );
  }

  const awake = deployments.filter((item) => item.state === "awake").length;
  const idle = deployments.map(idleFor);

  const activeToday = idle.filter((age) => age !== null && age < DAY).length;
  const buckets = [
    { label: "last hour", value: idle.filter((age) => age !== null && age < HOUR).length },
    {
      label: "1 – 24 hours",
      value: idle.filter((age) => age !== null && age >= HOUR && age < DAY).length,
    },
    {
      label: "1 – 7 days",
      value: idle.filter((age) => age !== null && age >= DAY && age < 7 * DAY).length,
    },
    {
      label: "older / never",
      value: idle.filter((age) => age === null || age >= 7 * DAY).length,
    },
  ];

  const recent = [...deployments]
    .filter((item) => item.lastRequestAt)
    .sort((a, b) => (idleFor(a) ?? Infinity) - (idleFor(b) ?? Infinity))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        label="usage"
        title="Usage"
        description="What this account is running right now. The closed pilot is not billed — these numbers are here so nothing is a surprise later."
        right={<span>closed pilot</span>}
      />

      {deployments.length === 0 ? (
        <Panel className="p-10 text-center">
          <p className="text-[13px] text-dim">Nothing deployed yet</p>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-muted">
            Usage starts counting with your first app.{" "}
            <Link
              href="/apps"
              className="text-dim underline decoration-ghost underline-offset-4 transition-colors hover:decoration-muted"
            >
              Deploy one
            </Link>{" "}
            — it takes three commands.
          </p>
        </Panel>
      ) : (
        <>
          <div className="grid gap-px bg-line sm:grid-cols-3">
            <Stat value={deployments.length} label="apps" note="deployed to this account" />
            <Stat value={awake} label="awake now" note="running, using active compute" />
            <Stat
              value={activeToday}
              label="active today"
              note="served a request in the last 24 hours"
            />
          </div>

          <section className="mt-14 grid gap-12 md:grid-cols-2">
            <div>
              <Rule label="awake right now" />
              <Meter
                value={awake}
                total={deployments.length}
                label="awake"
                caption="A sleeping app uses no active compute. It still holds its storage, snapshot and routing, and wakes on the next request."
              />
            </div>

            <div>
              <Rule label="last request" />
              <BarRow rows={buckets} />
            </div>
          </section>

          {recent.length > 0 ? (
            <section className="mt-14">
              <Rule label="most recently used" />
              <Panel>
                {recent.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line px-5 py-4 last:border-b-0"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-dim">
                      {deployment.name}
                    </span>
                    <StatusBadge state={deployment.state} />
                    <span
                      className="w-28 text-right text-[11px] tabular-nums text-muted"
                      title={exact(deployment.lastRequestAt)}
                    >
                      {ago(deployment.lastRequestAt)}
                    </span>
                  </div>
                ))}
              </Panel>
            </section>
          ) : null}
        </>
      )}

      <p className="mt-14 text-[11px] text-faint">signed in as {user.email ?? user.userId}</p>
    </>
  );
}
