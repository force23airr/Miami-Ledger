// Shared input validators used by API routes to keep request shapes safe
// before they hit external LLM/Stripe APIs.

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export const MAX_BODY_BYTES = 16 * 1024; // 16KB
export const MAX_MESSAGES = 30;
export const MAX_CONTENT_LENGTH = 4000;

export function checkBodyTooLarge(req: Request): boolean {
  const len = req.headers.get("content-length");
  if (!len) return false;
  const n = Number(len);
  if (!Number.isFinite(n)) return false;
  return n > MAX_BODY_BYTES;
}

export function validateMessages(value: unknown): {
  ok: true;
  messages: ChatMessage[];
} | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: "messages must be an array" };
  }
  if (value.length === 0) {
    return { ok: false, error: "messages required" };
  }
  if (value.length > MAX_MESSAGES) {
    return { ok: false, error: `too many messages (max ${MAX_MESSAGES})` };
  }
  const out: ChatMessage[] = [];
  for (const m of value) {
    if (!m || typeof m !== "object") {
      return { ok: false, error: "each message must be an object" };
    }
    const role = (m as Record<string, unknown>).role;
    const content = (m as Record<string, unknown>).content;
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "invalid message role" };
    }
    if (typeof content !== "string") {
      return { ok: false, error: "message content must be a string" };
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return {
        ok: false,
        error: `message too long (max ${MAX_CONTENT_LENGTH} chars)`,
      };
    }
    out.push({ role, content });
  }
  return { ok: true, messages: out };
}

// Only http(s) URLs survive. Returns undefined for everything else
// (javascript:, data:, file:, vbscript:, mailto:, etc.).
export function safeHttpUrl(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  try {
    const u = new URL(trimmed);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    return undefined;
  }
  return undefined;
}
