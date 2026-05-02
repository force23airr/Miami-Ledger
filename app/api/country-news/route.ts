import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NewsItem = { headline: string; source?: string; when?: string; url?: string };

const SYSTEM = `You are the Miami Ledger global wire desk. When asked about a country, return 5 plausible newsworthy items based on what you know about that country's recent landscape. Cover:
1. Financial markets (FX, equities, central bank stance)
2. Politics that move markets or affect the diaspora
3. Anything with a Miami / Florida / LATAM-corridor connection
4. Major business or infrastructure stories

IMPORTANT: You do not have live web access. Frame items as plausible recent themes from your training-data knowledge, NOT as breaking news. Use phrasing like "ongoing", "as of last update", or general framing — never invent specific dates, prices, or names you are not confident about.

Return ONLY a JSON array, no surrounding prose, no markdown fences. Each item:
[
  { "headline": "wire-style summary", "source": "outlet or 'Ledger desk'", "when": "general timeframe like 'this quarter' or 'recent'" }
]

Return between 3 and 5 items. Never fabricate URLs.`;

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
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "DEEPSEEK_API_KEY is not configured." },
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

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 1024,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Country: ${name} (${code}). Return a JSON object with an "items" array of 3-5 news items.`,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    let items: NewsItem[] = [];
    // DeepSeek JSON mode returns an object — try to find an items array, then fall back to array parse
    try {
      const obj = JSON.parse(raw);
      if (Array.isArray(obj?.items)) items = obj.items;
      else if (Array.isArray(obj)) items = obj;
    } catch {
      items = extractJsonArray(raw) ?? [];
    }

    return Response.json({
      country: { code, name },
      items,
      updated: new Date().toISOString(),
      mode: "model_knowledge",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
