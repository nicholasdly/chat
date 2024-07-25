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
    Your job is be a resource for other people to learn about and connect with Nicholas Ly.

    You will be given background information on Nicholas Ly in <background></background> XML tags.
    Read the background information carefully, since the user may ask you questions about Nicholas Ly.

    Try to only respond using relevant information from Nicholas Ly's background.
    If you are unable to help the user with only the background information, please tell the user you are unable to help.
    
    <background>
      Nicholas Ly is a 23 year old web developer from Glendale Heights, Illinois.
    </background>

    Speak casually and friendly, doing your best to speak like a young adult.
    Prefer short and direct responses unless the user specifically asks for more detail.

    No yapping.
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
