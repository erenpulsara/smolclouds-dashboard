import type { Metadata } from "next";
import { TokenPanel } from "@/components/TokenPanel";
import { Panel, Rule } from "@/components/ui";
import { requirePilot } from "@/lib/gate";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Token" };
export const dynamic = "force-dynamic";

export default async function TokenPage() {
  const user = await requirePilot();
  const key = user.key;

  return (
    <>
      <Rule label="api token" />
      <TokenPanel token={key.token} createdAt={key.createdAt} />

      <div className="mt-12">
        <Rule label="use it" />
        <Panel className="p-5">
          <pre className="overflow-x-auto text-xs leading-relaxed text-dim">
{`# CLI
export SMOLCLOUDS_TOKEN=${key.token.slice(0, 14)}…
smolclouds deploy .

# HTTP
curl ${site.apiBase}/deployments \\
  -H "Authorization: Bearer $SMOLCLOUDS_TOKEN"`}
          </pre>
        </Panel>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          One token per account. It carries your account id, so anything holding it can deploy,
          read and delete your apps — keep it out of repositories and client-side code. Rotate it
          if it leaks; the previous token stops working immediately.
        </p>
      </div>
    </>
  );
}
