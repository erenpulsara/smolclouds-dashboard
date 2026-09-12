"use server";

import { revalidatePath } from "next/cache";
import { requirePilot } from "@/lib/gate";
import { rotateKey } from "@/lib/keys";

export async function rotate(): Promise<{ token: string }> {
  const user = await requirePilot();
  const key = await rotateKey(user.userId);
  revalidatePath("/token");
  return { token: key.token };
}
