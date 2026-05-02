import Anthropic from "@anthropic-ai/sdk";
import { COUNTRIES } from "@/lib/globe";
import { check, clientIp, tooManyResponse } from "@/lib/rate-limit";
import { checkBodyTooLarge, safeHttpUrl } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NewsItem = { headline: string; source?: string; when?: string; url?: string };

const SYSTEM = `You are the Miami Ledger global wire desk. When asked about a country, search the web for the 5 most newsworthy items from the last 7 days. Prioritize:
1. Financial markets (FX, equities, central bank moves)
2. Politics that move markets or affect the diaspora
3. Anything with a Miami / Florida / LATAM-corridor connection
4. Major business or infrastructure announcements

Return ONLY a JSON array, no surrounding text. Each item has these fields:
[
  { "headline": "string — concise wire-style", "source": "string — outlet name", "when": "string — short relative time like '2h ago' or 'today'", "url": "string — direct article URL if available" }
]

If you cannot find 5 strong items, return however many you have. Never fabricate.`;

function extractJsonArray(text: string): NewsItem[] | null {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed as NewsItem[];
  } catch {}
  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed as NewsItem[];
    } catch {}
  }
  return null;
}

// Sanitize and bound items returned from the model. Drops javascript:/data:
// URLs, truncates long fields, and caps the array.
function sanitizeItems(items: unknown): NewsItem[] {
  if (!Array.isArray(items)) return [];
  const out: NewsItem[] = [];
  for (const raw of items.slice(0, 10)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const headline =
      typeof r.headline === "string" ? r.headline.trim().slice(0, 280) : "";
    if (!headline) continue;
    const source =
      typeof r.source === "string" ? r.source.trim().slice(0, 80) : undefined;
    const when =
      typeof r.when === "string" ? r.when.trim().slice(0, 40) : undefined;
    const url = safeHttpUrl(r.url);
    out.push({ headline, source, when, url });
  }
  return out.slice(0, 8);
}

// Best-effort in-memory cache per country. TTL keeps cost bounded; only
// helps while the function instance stays warm.
type CacheEntry = { at: number; payload: unknown };
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min
const cache = new Map<string, CacheEntry>();

export async function POST(req: Request) {
  if (checkBodyTooLarge(req)) {
    return Response.json({ error: "request body too large" }, { status: 413 });
  }

  // Rate limit: 30 requests per IP per 5 minutes for this endpoint
  const ip = clientIp(req);
  const rl = check("country-news", ip, 30, 300);
  if (!rl.allowed) return tooManyResponse(rl.retryAfterSeconds);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "ANTHROPIC_API_KEY is not configured. The country wire uses Claude's web_search tool. Set ANTHROPIC_API_KEY in Vercel.",
      },
      { status: 500 },
    );
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Server-side allowlist: derive the country from our own COUNTRIES list
  // so a malicious client can't use this endpoint as a generic web-search
  // proxy by passing arbitrary names.
  const code = (body.code ?? "").toString().toUpperCase().trim();
  if (!/^[A-Z]{2}$/.test(code)) {
    return Response.json({ error: "valid 2-letter country code required" }, { status: 400 });
  }
  const country = COUNTRIES.find((c) => c.code === code);
  if (!country) {
    return Response.json({ error: "country not on the Ledger globe" }, { status: 404 });
  }
  const name = country.name; // trusted, comes from our list

  // Cache hit
  const cached = cache.get(code);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return Response.json(cached.payload);
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      system: SYSTEM,
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages: [
        {
          role: "user",
          content: `Latest news from ${name} (${code}). Return JSON only.`,
        },
      ],
    });

    let lastText = "";
    for (const block of response.content) {
      if (block.type === "text") lastText = block.text;
    }

    const items = sanitizeItems(extractJsonArray(lastText));

    const payload = {
      country: { code, name },
      items,
      updated: new Date().toISOString(),
      mode: "web_search",
    };
    cache.set(code, { at: Date.now(), payload });
    return Response.json(payload);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
