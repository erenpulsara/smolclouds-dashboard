"use server";

import { revalidatePath } from "next/cache";
import { requirePilot } from "@/lib/gate";
import { deleteDeployment, RouterError } from "@/lib/router";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function removeDeployment(id: string): Promise<ActionResult> {
  const user = await requirePilot();
  const key = user.key;

  try {
    await deleteDeployment(key.token, id);
  } catch (error) {
    const message =
      error instanceof RouterError
        ? `router refused the delete (${error.status})`
        : "could not reach the router";
    return { ok: false, error: message };
  }

  revalidatePath("/apps");
  revalidatePath("/usage");
  return { ok: true };
}
