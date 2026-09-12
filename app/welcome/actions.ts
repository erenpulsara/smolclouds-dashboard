"use server";

import { redirect } from "next/navigation";
import { approve, requireUser } from "@/lib/gate";
import { inviteCodeValid } from "@/lib/pilot";

export type RedeemState = { error: string | null };

export async function redeemInvite(
  _previous: RedeemState,
  formData: FormData,
): Promise<RedeemState> {
  const user = await requireUser();
  if (user.status.approved) redirect("/apps");

  const code = String(formData.get("code") ?? "");
  if (!code.trim()) return { error: "enter your invite code" };
  if (!inviteCodeValid(code)) return { error: "that code is not valid for this pilot" };

  await approve(user.userId, "invite");
  redirect("/apps");
}
