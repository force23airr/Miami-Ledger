// In-memory per-IP sliding-window rate limiter.
//
// LIMITATION: Vercel serverless functions are stateless across invocations
// and may run on different instances. This limiter is best-effort and only
// throttles repeat hits that land on the same warm instance. It still
// meaningfully slows sustained abuse from a single IP — enough to make most
// scripted attacks uneconomic — but for production-grade rate limiting,
// move to Vercel KV or Upstash Redis.
//
// Each named bucket has its own window/limit. Call check() at the top of a
// route. If allowed=false, return 429.

type Hit = { times: number[] };

const buckets = new Map<string, Map<string, Hit>>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function check(
  bucket: string,
  ip: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let map = buckets.get(bucket);
  if (!map) {
    map = new Map();
    buckets.set(bucket, map);
  }

  let hit = map.get(ip);
  if (!hit) {
    hit = { times: [] };
    map.set(ip, hit);
  }

  // Drop timestamps outside the window
  hit.times = hit.times.filter((t) => now - t < windowMs);

  if (hit.times.length >= limit) {
    const oldest = hit.times[0];
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
  }

  hit.times.push(now);
  return {
    allowed: true,
    remaining: limit - hit.times.length,
    retryAfterSeconds: 0,
  };
}

// Best-effort client IP extraction. Vercel sets x-forwarded-for; fall back
// to other common headers and finally a placeholder so we still rate-limit
// (just less precisely) when no header is present.
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function tooManyResponse(retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Slow down and try again shortly.",
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfterSeconds),
      },
    },
  );
}
