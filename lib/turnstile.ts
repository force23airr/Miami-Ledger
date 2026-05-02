// Cloudflare Turnstile server-side verification.
//
// If TURNSTILE_SECRET_KEY is not set, verification is BYPASSED so local dev
// keeps working without the env var. In production (Vercel), set both:
//
//   NEXT_PUBLIC_TURNSTILE_SITE_KEY  — public, rendered in the browser
//   TURNSTILE_SECRET_KEY            — server only, used here
//
// Get them from https://dash.cloudflare.com/?to=/:account/turnstile

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type VerifyResult = {
  ok: boolean;
  // The reason string is intended for server logs, not user-facing UI.
  reason?: string;
};

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string,
): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Not configured → fail open in dev. In production, set the env var.
  if (!secret) return { ok: true, reason: "turnstile-disabled" };

  if (!token || typeof token !== "string") {
    return { ok: false, reason: "missing-token" };
  }

  try {
    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);
    if (remoteIp) params.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      // siteverify should be quick; cap to 5s
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return { ok: false, reason: `siteverify-${res.status}` };
    }
    const data = (await res.json()) as { success?: boolean; ["error-codes"]?: string[] };
    if (data?.success) return { ok: true };
    return {
      ok: false,
      reason: `siteverify-failed:${(data?.["error-codes"] ?? []).join(",")}`,
    };
  } catch (e) {
    return { ok: false, reason: `siteverify-exception:${(e as Error).message}` };
  }
}

export function turnstileFailedResponse() {
  return new Response(
    JSON.stringify({
      error:
        "Bot check failed. Refresh the page and try again — if it keeps happening, your network may be flagged.",
    }),
    { status: 403, headers: { "content-type": "application/json" } },
  );
}
