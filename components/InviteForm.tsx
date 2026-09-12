"use client";

import { useActionState } from "react";
import { redeemInvite, type RedeemState } from "@/app/welcome/actions";

const initial: RedeemState = { error: null };

export function InviteForm() {
  const [state, action, pending] = useActionState(redeemInvite, initial);

  return (
    <form action={action}>
      <div className="flex gap-2">
        <input
          id="code"
          name="code"
          autoComplete="off"
          autoFocus
          spellCheck={false}
          aria-label="Invite code"
          aria-invalid={state.error ? true : undefined}
          placeholder="smol-pilot-0000"
          className="min-w-0 flex-1 border border-line bg-surface-2 px-3.5 py-2.5 text-[13px] text-text placeholder:text-ghost focus:border-line-bright focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 border border-text bg-text px-5 py-2.5 text-[11px] text-bg transition-colors hover:bg-dim disabled:opacity-50"
        >
          {pending ? "checking…" : "redeem"}
        </button>
      </div>
      {state.error ? <p className="mt-3 text-[11px] text-dim">✕ {state.error}</p> : null}
    </form>
  );
}
