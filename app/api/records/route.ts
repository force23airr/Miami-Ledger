import OpenAI from "openai";
import { getSystemPrompt, isKnownDataset } from "./prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientMessage = { role: "user" | "assistant"; content: string };

type Body = {
  datasetId?: string;
  context?: { rows?: unknown[]; query?: Record<string, unknown> };
  messages?: ClientMessage[];
};

function summarizeContext(ctx: Body["context"]): string {
  if (!ctx) return "No current data view.";
  const parts: string[] = [];
  if (ctx.query && Object.keys(ctx.query).length > 0) {
    const queryStr = Object.entries(ctx.query)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(", ");
    if (queryStr) parts.push(`Current query: ${queryStr}`);
  }
  if (Array.isArray(ctx.rows) && ctx.rows.length > 0) {
    // Cap the row context — top 5 only, JSON-truncated, to keep tokens sane.
    const top = ctx.rows.slice(0, 5);
    parts.push(
      `Top ${top.length} of ${ctx.rows.length} rows the user is looking at: ${JSON.stringify(top)}`,
    );
  } else {
    parts.push("The user has not yet loaded any rows.");
  }
  return parts.join("\n");
}

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

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { datasetId, context, messages } = body;

  if (!datasetId || !isKnownDataset(datasetId)) {
    return new Response(
      JSON.stringify({ error: "Unknown or missing datasetId" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const systemPrompt = getSystemPrompt(datasetId);
  if (!systemPrompt) {
    // Should be unreachable given isKnownDataset above, but defensive.
    return new Response(
      JSON.stringify({ error: "No system prompt registered for dataset" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const contextLine = `CURRENT DATA VIEW:\n${summarizeContext(context)}`;

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
            { role: "system", content: systemPrompt },
            { role: "system", content: contextLine },
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
