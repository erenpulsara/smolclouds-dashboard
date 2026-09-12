/**
 * Closed pilot gate. A signed-in user reaches the console only after they are
 * approved — automatically when their email domain is on the allowlist, or by
 * redeeming an invite code. Approval is recorded on the Clerk user so the
 * check costs nothing on later requests.
 */

function list(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function allowedDomains(): string[] {
  return list(process.env.PILOT_ALLOWED_DOMAINS);
}

export function inviteCodes(): string[] {
  return list(process.env.PILOT_INVITE_CODES);
}

export function domainAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const domain = email.split("@").pop()?.toLowerCase();
  return Boolean(domain) && allowedDomains().includes(domain!);
}

export function inviteCodeValid(code: string): boolean {
  return inviteCodes().includes(code.trim().toLowerCase());
}

export type PilotStatus = {
  approved: boolean;
  via?: "domain" | "invite";
  at?: string;
};

/** Reads the pilot status off a Clerk user's public metadata. */
export function pilotStatus(metadata: unknown): PilotStatus {
  const pilot = (metadata as { pilot?: PilotStatus } | null | undefined)?.pilot;
  return pilot?.approved ? pilot : { approved: false };
}
