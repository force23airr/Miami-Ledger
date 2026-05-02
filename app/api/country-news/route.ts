import Anthropic from "@anthropic-ai/sdk";

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

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "ANTHROPIC_API_KEY is not configured. The country wire uses Claude's web_search tool (DeepSeek doesn't have an equivalent). Add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables.",
      },
      { status: 500 },
    );
  }

  let body: { code?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = (body.code || "").toUpperCase();
  const name = body.name || "";
  if (!code || !name) {
    return Response.json({ error: "code and name required" }, { status: 400 });
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

    // Find the last text block (after web search results)
    let lastText = "";
    for (const block of response.content) {
      if (block.type === "text") lastText = block.text;
    }

    const items = extractJsonArray(lastText) ?? [];

    return Response.json({
      country: { code, name },
      items,
      updated: new Date().toISOString(),
      mode: "web_search",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
