import type { Metadata } from "next";
import { DeploymentList } from "@/components/DeploymentList";
import { EmptyState, Panel, Rule } from "@/components/ui";
import { requirePilot } from "@/lib/gate";
import { listDeployments, RouterError, type Deployment } from "@/lib/router";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Apps" };
export const dynamic = "force-dynamic";

export default async function AppsPage() {
  const user = await requirePilot();
  const key = user.key;

  let deployments: Deployment[] = [];
  let failure: string | null = null;

  try {
    deployments = await listDeployments(key.token);
  } catch (error) {
    failure =
      error instanceof RouterError
        ? `${site.apiBase}/deployments answered ${error.status}`
        : `${site.apiBase} did not answer`;
  }

  const awake = deployments.filter((item) => item.state === "awake").length;

  return (
    <>
      <Rule
        label="apps"
        right={
          <span className="text-xs text-faint tabular-nums">
            {deployments.length} total · {awake} awake
          </span>
        }
      />

      {failure ? (
        <Panel className="p-6">
          <p className="text-sm text-dim">✕ router unreachable</p>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {failure}. The console reads deployments server-side, so this is the router itself, not
            a browser or CORS problem. Check that the router accepts the console&apos;s API token —
            see <span className="text-dim">docs/ROUTER_PATCH.md</span>.
          </p>
        </Panel>
      ) : deployments.length === 0 ? (
        <EmptyState title="no apps yet">
          Deploy one with the CLI, then it shows up here.
          <br />
          <span className="mt-3 block text-dim">smolclouds deploy .</span>
        </EmptyState>
      ) : (
        <>
          <div className="flex gap-x-6 border-x border-t border-line bg-surface-2 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-faint">
            <span className="flex-1">app</span>
            <span className="w-24">state</span>
            <span className="w-28 text-right">last request</span>
            <span className="w-32" />
          </div>
          <DeploymentList deployments={deployments} />
        </>
      )}
    </>
  );
}
