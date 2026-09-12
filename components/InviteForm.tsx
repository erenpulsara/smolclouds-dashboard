"use client";

import { useActionState } from "react";
import { redeemInvite, type RedeemState } from "@/app/welcome/actions";

const initial: RedeemState = { error: null };

export function InviteForm() {
  const [state, action, pending] = useActionState(redeemInvite, initial);

  return (
    <form action={action} className="border border-line bg-surface p-5">
      <label htmlFor="code" className="block text-[11px] uppercase tracking-[0.2em] text-muted">
        invite code
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="code"
          name="code"
          autoComplete="off"
          autoFocus
          spellCheck={false}
          placeholder="smol-xxxx-xxxx"
          className="min-w-0 flex-1 border border-line bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-ghost focus:border-line-bright focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="border border-text bg-text px-4 py-2 text-xs text-bg hover:bg-dim disabled:opacity-50"
        >
          {pending ? "checking…" : "redeem"}
        </button>
      </div>
      {state.error ? <p className="mt-3 text-xs text-dim">✕ {state.error}</p> : null}
    </form>
  );
}
