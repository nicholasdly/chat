"use server";

import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CoreMessage, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { headers } from "next/headers";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "30s"),
  analytics: true,
});

export async function continueConversation(messages: CoreMessage[]) {
  const ip = headers().get("x-forwarded-for") ?? "ip";
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new Error("TOO_MANY_REQUESTS");

  const system = `
    You are a helpful assistant working for Nicholas Ly.
  `;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system,
    messages,
    maxTokens: 1000,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
