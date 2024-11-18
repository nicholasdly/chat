"use client";

import { Message, useChat } from "ai/react";
import { ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

function ChatMessage({ message }: Readonly<{ message: Message }>) {
  return (
    <article
      className={cn(
        "w-max max-w-[75%] hyphens-auto whitespace-pre-line rounded-2xl px-3 py-2",
        message.role === "user"
          ? "self-end bg-blue-500"
          : "bg-zinc-200 dark:bg-zinc-700",
      )}
    >
      <p
        className={
          message.role === "user"
            ? "text-white"
            : "text-black dark:text-zinc-200"
        }
      >
        {message.content}
      </p>
    </article>
  );
}

function ChatFeed({
  messages,
  isLoading,
}: Readonly<{ messages: Message[]; isLoading: boolean }>) {
  const scrollAnchor = useRef<HTMLDivElement>(null);

  // Automatically scrolls message feed on changes so that new messages are visible.
  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="no-scrollbar overflow-y-scroll">
      <div className="h-[85px]" />
      <div className="mb-3 flex flex-col items-center text-nowrap text-xs text-zinc-500">
        <p>Responses are powered by artificial intelligence.</p>
        <p>Artificial intellgence can make mistakes.</p>
      </div>
      <div className="mb-3 flex flex-col items-center text-nowrap text-xs text-zinc-500">
        <p>chat.nicholasly.com</p>
        <p>
          Today{" "}
          {new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && messages[messages.length - 1].role != "assistant" && (
          <div className="flex h-10 w-max max-w-[75%] items-center gap-1 rounded-2xl bg-zinc-200 px-3 py-2 dark:bg-zinc-700">
            <div className="size-2.5 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="size-2.5 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="size-2.5 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        )}
      </div>
      <div className="h-[54px]" ref={scrollAnchor} />
    </div>
  );
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      keepLastMessageOnError: true,
      experimental_throttle: 50,
      onError: (error) => {
        switch (error.message) {
          case "TOO_MANY_REQUESTS":
            return toast.error("Rate limit exceeded!");
          default:
            return toast.error("Something went wrong!");
        }
      },
    });

  // Allows the user to submit a message by pressing `Enter` without holding `Shift`.
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && input.trim().length > 0) handleSubmit();
    }
  };

  // Adjusts the height of the `textarea` to fit its content.
  useEffect(() => {
    const editor = document.getElementById("editor") as HTMLTextAreaElement;
    editor.style.height = "auto";
    editor.style.height = editor.scrollHeight + "px";
  }, [input]);

  return (
    <div className="relative mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-3xl border p-5 dark:border-zinc-600">
      <header className="absolute inset-x-0 top-0 flex flex-col items-center gap-1 border-b bg-zinc-100/70 pb-2 pt-3 backdrop-blur-md dark:border-zinc-600 dark:bg-zinc-800/70">
        <div className="relative size-12 overflow-hidden rounded-full bg-gradient-to-br from-red-200 to-red-300">
          <Image
            className="object-scale-down p-1.5"
            src="/memoji.png"
            alt="Nicholas Ly's memoji"
            width={48}
            height={48}
            priority
          />
        </div>
        <h1 className="text-nowrap text-sm">nick&apos;s assistant 🤖</h1>
      </header>
      <ChatFeed messages={messages} isLoading={isLoading} />
      <form
        className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-white/70 px-5 pb-5 pt-3 backdrop-blur-md dark:bg-zinc-900/70"
        onSubmit={handleSubmit}
      >
        <div className="flex rounded-2xl border dark:border-zinc-600">
          <textarea
            id="editor"
            className="mr-8 w-full resize-none bg-transparent px-3 py-2 outline-none dark:placeholder:text-zinc-500"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(event) =>
              handleKeyDown(event as unknown as KeyboardEvent)
            }
            rows={1}
            maxLength={200}
            placeholder="Send a message..."
            spellCheck
            autoFocus
          />
          <div className="absolute bottom-[25px] right-[28px] size-fit">
            <button
              type="submit"
              aria-label="Send"
              disabled={isLoading || input.trim().length <= 0}
              className="inline-flex aspect-square size-7 items-center justify-center rounded-full bg-blue-500 text-white transition-colors duration-300 disabled:bg-zinc-500"
            >
              <ArrowUpIcon className="size-5 stroke-[3px]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
