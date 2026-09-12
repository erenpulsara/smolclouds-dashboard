import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { AuthFrame } from "@/components/AuthFrame";
import { InviteForm } from "@/components/InviteForm";
import { requireUser } from "@/lib/gate";
import { allowedDomains } from "@/lib/pilot";

export const metadata: Metadata = { title: "Invite" };
export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const user = await requireUser();
  if (user.status.approved) redirect("/apps");

  const domains = allowedDomains();

  return (
    <AuthFrame
      title="closed pilot"
      caption={`Signed in as ${user.email ?? user.userId}. This account is not on the pilot yet.`}
      footer={
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <SignOutButton>
            <button type="button" className="underline decoration-ghost underline-offset-4 hover:decoration-muted">
              sign out
            </button>
          </SignOutButton>
          <a
            href="mailto:support@smolclouds.com?subject=Pilot%20access"
            className="underline decoration-ghost underline-offset-4 hover:decoration-muted"
          >
            ask for an invite
          </a>
        </span>
      }
    >
      <InviteForm />
      {domains.length > 0 ? (
        <p className="mt-5 text-xs leading-relaxed text-faint">
          Accounts on {domains.map((domain) => `@${domain}`).join(", ")} are admitted without a
          code — sign in with that address instead.
        </p>
      ) : null}
    </AuthFrame>
  );
}
