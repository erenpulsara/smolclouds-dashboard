import { clerkClient } from "@clerk/nextjs/server";
import { currentKeyId } from "@/lib/keys";
import { verifyToken } from "@/lib/token";

/**
 * Called by api.smolclouds.com to check that a token is still the current one
 * for its account. The signature alone proves the token was issued here; this
 * endpoint is what makes rotation stick, since a rotated key id no longer
 * matches what Clerk holds.
 */
export async function GET(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";

  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return Response.json({ valid: false, reason: "invalid" }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(payload.u);

    if (currentKeyId(user) !== payload.k) {
      return Response.json({ valid: false, reason: "revoked" }, { status: 401 });
    }

    return Response.json({ valid: true, userId: payload.u, keyId: payload.k });
  } catch {
    return Response.json({ valid: false, reason: "unknown_user" }, { status: 401 });
  }
}
