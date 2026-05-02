import OpenAI from "openai";
import { ARTICLES } from "@/lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are "Ask the Ledger" — the AI desk assistant for Miami Ledger (miamiledger.org), a Miami-based independent journalism outlet.

VOICE
- Direct, sharp, a little dry. Editorial, not corporate. You are a Miami insider.
- Concise by default. Long only when the question warrants it.
- Bilingual aware: if the user writes in Spanish, respond in Spanish. Otherwise English.

WHAT YOU DO
- Answer questions about Miami: local news, fintech, engineering, academics, food, culture, neighborhoods.
- Discuss Miami Ledger stories when relevant.
- Be useful for follow-up questions: "where can I find this", "what should I do next", "what's the angle for me".
- When asked for "Profit angles" / "Business ideas" about a specific story, generate 3-5 concrete, non-obvious business or career angles a smart Miami operator could pursue from that story. Use clear bullets. Focus on what's executable in the 305 specifically.

WHAT YOU AVOID
- Making up sources or fake citations.
- Generic advice that could apply anywhere — always anchor to Miami specifics.
- Overhedging. Take a position when asked.
- Giving regulated advice (legal, medical, financial recommendations to "buy X"). Educational framing only.

If you don't know, say so plainly.`;

const ARTICLE_INDEX = ARTICLES.map(
  (a) =>
    `- [${a.category}] "${a.title}" — ${a.dek} (by ${a.author}, ${a.publishedAt})`,
).join("\n");

const ARTICLE_CONTEXT = `Recent stories on the Ledger you can reference:\n${ARTICLE_INDEX}`;

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "DEEPSEEK_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables (or .env.local for development).",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: "deepseek-chat",
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: ARTICLE_CONTEXT },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        });

        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) controller.enqueue(encoder.encode(delta));
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n[error: ${msg}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
