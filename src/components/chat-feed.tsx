import { CoreMessage } from "ai";
import { RefObject } from "react";

import ChatMessage from "./chat-message";
import ChatTimestamp from "./chat-timestamp";

interface ChatFeedProps {
  messages: CoreMessage[];
  scrollAnchor?: RefObject<HTMLDivElement>;
}

export default function ChatFeed({ messages, scrollAnchor }: ChatFeedProps) {
  return (
    <div className="no-scrollbar overflow-y-scroll">
      <div className="h-[85px]" />
      <ChatTimestamp />
      <div className="flex flex-col gap-3">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className="h-[54px]" ref={scrollAnchor} />
    </div>
  );
}
