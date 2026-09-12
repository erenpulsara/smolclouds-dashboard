import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * API tokens are opaque to the CLI but self-verifying to the router: the user
 * id and a rotating key id travel inside the token, signed with a secret both
 * services share. That keeps `api.smolclouds.com` free of a key table while
 * still allowing revocation — rotating a token changes its key id, and the
 * router can reject a stale one by asking /api/token/verify.
 */
const PREFIX = "sc_live_";

export type TokenPayload = {
  /** Clerk user id. */
  u: string;
  /** Key id — changes on every rotation, so old tokens are distinguishable. */
  k: string;
  /** Issued at, seconds. */
  i: number;
};

function secret(): Buffer {
  const value = process.env.SMOLCLOUDS_TOKEN_SECRET;
  if (!value) {
    throw new Error(
      "SMOLCLOUDS_TOKEN_SECRET is not set. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"",
    );
  }
  return Buffer.from(value, "utf8");
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input as never).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function newKeyId(): string {
  return randomBytes(9).toString("base64url");
}

/**
 * `issuedAt` is explicit so a token can be derived deterministically: the same
 * user, key id and timestamp always produce the same string, which is what
 * lets the first token exist without being written anywhere.
 */
export function mintToken(
  userId: string,
  keyId = newKeyId(),
  issuedAt = Math.floor(Date.now() / 1000),
): { token: string; keyId: string } {
  const payload: TokenPayload = { u: userId, k: keyId, i: issuedAt };
  const body = b64url(JSON.stringify(payload));
  return { token: `${PREFIX}${body}.${sign(body)}`, keyId };
}

/** Returns the payload when the signature is valid, otherwise null. */
export function verifyToken(token: string): TokenPayload | null {
  if (!token.startsWith(PREFIX)) return null;
  const [body, signature] = token.slice(PREFIX.length).split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TokenPayload;
    return typeof payload.u === "string" && typeof payload.k === "string" ? payload : null;
  } catch {
    return null;
  }
}

/** What is safe to render next to a token, e.g. in a list of keys. */
export function maskToken(token: string): string {
  return `${token.slice(0, PREFIX.length + 6)}${"…"}${token.slice(-4)}`;
}
