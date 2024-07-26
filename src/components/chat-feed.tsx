import { CoreMessage } from "ai";
import { RefObject } from "react";
import ChatMessage from "./chat-message";

interface ChatFeedProps {
  messages: CoreMessage[];
  scrollAnchor?: RefObject<HTMLDivElement>;
}

export default function ChatFeed({ messages, scrollAnchor }: ChatFeedProps) {
  return (
    <div className="no-scrollbar overflow-y-scroll">
      <div className="h-[85px]" />
      <div className="mb-3 flex flex-col items-center text-nowrap text-xs text-zinc-500">
        <p>nicholasly.com</p>
        <p suppressHydrationWarning>
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
    </div>
  );
}
