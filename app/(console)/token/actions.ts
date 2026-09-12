"use server";

import { revalidatePath } from "next/cache";
import { requirePilot } from "@/lib/gate";
import { rotateKey, type StoredKey } from "@/lib/keys";

export async function rotate(): Promise<StoredKey> {
  const user = await requirePilot();
  const key = await rotateKey(user.userId);
  revalidatePath("/token");
  return key;
}
