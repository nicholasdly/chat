"use client";

import { continueConversation } from "@/lib/ai";
import { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MessageHeader from "./message-header";
import MessageFeed from "./message-feed";
import MessageForm from "./message-editor";

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAnchor = useRef<HTMLDivElement>(null);

  /**
   * Updates the message editor `textarea` element height to fit the content of the element.
   * If the `reset` option is set to `true`, the `textarea` content and user input state will be reset.
   */
  const resizeInput = ({ reset }: { reset: boolean }) => {
    const editor = document.getElementById("editor") as HTMLTextAreaElement;

    if (reset) {
      setInput("");
      editor.value = "";
    }

    editor.style.height = "auto";
    editor.style.height = editor.scrollHeight + "px";
  };

  /**
   * Updates the user input state and resizes the message editor.
   * @param event A React `textarea` change event.
   */
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    resizeInput({ reset: false });
  };

  /**
   * Form submission handler that resets the user input state and appends a user message to the conversation.
   * @param event A React `form` event.
   */
  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];

    setLoading(true);
    setMessages(newMessages);
    resizeInput({ reset: true });

    try {
      const result = await continueConversation(newMessages);

      for await (const content of readStreamableValue(result)) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: content as string,
          },
        ]);
      }
    } catch (error) {
      handleMessageError(error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically scrolls message feed on changes so that new messages are visible.
  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="relative mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-3xl border p-5">
      <MessageHeader />
      <MessageFeed messages={messages} scrollAnchor={scrollAnchor} />
      <MessageForm
        input={input}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </section>
  );
}

/**
 * Displays a specific toast message for an expected error.
 * @param error The error object caught by a `try-catch`.
 */
function handleMessageError(error: unknown) {
  const isError = error instanceof Error;
  if (!isError) throw error;

  let message: string;
  let description: string;

  switch (error.message) {
    case "TOO_MANY_REQUESTS":
      message = "Rate limit exceeded!";
      description = "Please wait a few moments then try again.";
      break;
    default:
      message = "Uh oh!";
      description = "Something went wrong!";
      break;
  }

  toast.error(message, { description });
}
