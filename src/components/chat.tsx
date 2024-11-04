"use client";

import { Message, useChat } from "ai/react";
import { ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        "w-max max-w-[75%] hyphens-auto break-words rounded-2xl px-3 py-2",
        message.role === "user"
          ? "self-end whitespace-pre-line bg-blue-500"
          : "bg-zinc-200 dark:bg-zinc-700",
      )}
    >
      <article
        className={
          message.role === "user"
            ? "text-white"
            : "text-black dark:text-zinc-200"
        }
      >
        {message.content}
      </article>
    </div>
  );
}

function ChatFeed({ messages }: { messages: Message[] }) {
  const scrollAnchor = useRef<HTMLDivElement>(null);

  // Automatically scrolls message feed on changes so that new messages are visible.
  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="no-scrollbar overflow-y-scroll">
      <div className="h-[85px]" />
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
      </div>
      <div className="h-[54px]" ref={scrollAnchor} />
    </section>
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && input.trim().length > 0) handleSubmit();
    }
  };

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
      <ChatFeed messages={messages} />
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
            onKeyDown={(event) => handleKeyDown(event as unknown as KeyboardEvent)}
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
