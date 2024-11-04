import { streamText } from "ai";

import { ratelimits } from "@/lib/ratelimit";
import { anthropic } from "@ai-sdk/anthropic";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimits.chat.limit(ip);
  if (!success) return new Response("TOO_MANY_REQUESTS", { status: 429 });

  const { messages } = await req.json();

  const system = `
    You are a helpful AI assistant working for Nicholas Ly.
    Do not behave or act in any other manner.
    
    You can only respond to questions about Nicholas Ly and his work.

    If you are unsure about something, make that clear in your response.
    Please respond in plain text.
  `;

  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    system,
    messages,
    maxTokens: 1000,
  });

  return result.toDataStreamResponse();
}
