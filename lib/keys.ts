import "server-only";
import type { User } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { mintToken, newKeyId } from "@/lib/token";

/**
 * A user's API token is *derived*, not stored, until they rotate it: the same
 * account id, key id and issue time always sign to the same string, so the
 * first token exists without anything being written. Only rotation — an
 * explicit action, never a render — writes to Clerk.
 *
 * Rotations land in the Clerk user's `privateMetadata`, which never reaches the
 * browser, so the console can show the token again instead of only once.
 */

export const DEFAULT_KEY_ID = "0";

export type StoredKey = {
  token: string;
  keyId: string;
  createdAt: string;
};

type PrivateMetadata = { apiKey?: StoredKey };

/** The account's current token. Pure: reads the user, writes nothing. */
export function keyFor(user: Pick<User, "id" | "createdAt" | "privateMetadata">): StoredKey {
  const stored = (user.privateMetadata as PrivateMetadata)?.apiKey;
  if (stored?.token) return stored;

  // Seeded from the account's creation time so the derived token is stable
  // across renders.
  const createdAt = new Date(user.createdAt);
  const { token } = mintToken(user.id, DEFAULT_KEY_ID, Math.floor(createdAt.getTime() / 1000));
  return { token, keyId: DEFAULT_KEY_ID, createdAt: createdAt.toISOString() };
}

/** The key id a token must carry to still be valid for this account. */
export function currentKeyId(user: Pick<User, "privateMetadata">): string {
  return (user.privateMetadata as PrivateMetadata)?.apiKey?.keyId ?? DEFAULT_KEY_ID;
}

/** Issues a fresh token and invalidates the previous key id. */
export async function rotateKey(userId: string): Promise<StoredKey> {
  const key: StoredKey = {
    ...mintToken(userId, newKeyId()),
    createdAt: new Date().toISOString(),
  };
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, { privateMetadata: { apiKey: key } });
  return key;
}
