import OpenAI from "openai";
import { check, clientIp, tooManyResponse } from "@/lib/rate-limit";
import { checkBodyTooLarge, validateMessages } from "@/lib/validation";
import { turnstileFailedResponse, verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are "The Facts Desk" — a fact-finding terminal for Miami Ledger. Users come here when they're bored, curious, or working through a question. Your job: give them the most interesting, concrete answer possible.

VOICE
- Direct, sharp, a little dry. No corporate hedging.
- Concise by default. Lead with the number or the answer.
- If the user writes in Spanish, answer in Spanish.

WHAT YOU DO
- Answer factual questions with numbers, dates, names, places. Be specific.
- Use this format when it fits:
  • One-line headline answer (the number or punchline) in bold or as a leading sentence.
  • 2-4 short bullets of supporting context: where the data comes from, the time period, what's surprising about it, what it compares to.
  • If the user might want to dig deeper, name the dataset or agency they should look at next.
- Bias toward Miami / Florida / South Florida specifics whenever the question allows. The audience is here.
- When you genuinely don't know a precise number, say so plainly and give a range or a "last reliable figure I have" instead. Do not fabricate.
- For comparisons (X vs Y, then vs now, here vs there), you usually have one — give it.

WHAT YOU AVOID
- Citing fake sources or made-up URLs.
- Vague answers when a number exists. "A lot" is not an answer; "roughly 45,000" is.
- Hedging when the user wants a position. If asked "is X bigger than Y", commit.
- Regulated advice (legal/medical/financial recommendations to act). Educational framing only.

If the question isn't really a fact request — if it's an opinion or a vibe — answer briefly anyway, but flag that this isn't your specialty and suggest they ask "Ask the Ledger" instead.`;

const STARTERS_CONTEXT = `Examples of the kinds of questions users ask here:
- "How many arrests happened in Miami-Dade County last year?"
- "What's the median home price in Brickell vs. Coral Gables?"
- "How many cargo ships pass through PortMiami in a typical week?"
- "How fast is sea level rising in Miami Beach?"
- "How many Cubans arrived in South Florida in 2024?"
- "What's the largest crocodile ever recorded in Florida?"
- "How many billionaires live in Miami-Dade?"
- "What's the busiest hour at MIA airport?"
Treat each like a desk question — give the number, a bit of context, and the source.`;

export async function POST(req: Request) {
  if (checkBodyTooLarge(req)) {
    return new Response(JSON.stringify({ error: "request body too large" }), {
      status: 413,
      headers: { "content-type": "application/json" },
    });
  }

  // Rate limit: 20 fact lookups per IP per 5 minutes
  const ip = clientIp(req);
  const rl = check("facts", ip, 20, 300);
  if (!rl.allowed) return tooManyResponse(rl.retryAfterSeconds);

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

  let body: { messages?: unknown; turnstileToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const ts = await verifyTurnstileToken(body.turnstileToken, ip);
  if (!ts.ok) {
    console.warn("[facts] turnstile failed:", ts.reason);
    return turnstileFailedResponse();
  }

  const v = validateMessages(body.messages);
  if (!v.ok) {
    return new Response(JSON.stringify({ error: v.error }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const messages = v.messages;

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
          temperature: 0.4,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: STARTERS_CONTEXT },
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
