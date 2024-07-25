import { CoreMessage } from "ai";
import { AssistantMessage, UserMessage } from "./messages";
import { RefObject } from "react";

interface MessageFeedProps {
  messages: CoreMessage[];
  scrollAnchor?: RefObject<HTMLDivElement>;
}

export default function MessageFeed({
  messages,
  scrollAnchor,
}: MessageFeedProps) {
  return (
    <div className="no-scrollbar overflow-y-scroll">
      <div className="h-[85px]" />
      <div className="mb-3 flex flex-col items-center text-nowrap text-xs text-zinc-500">
        <p>nicholasly.com</p>
        <p>
          Today{" "}
          {new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      </div>
      <div className="space-y-3">
        {messages.map((message, index) => {
          switch (message.role) {
            case "assistant":
              return (
                <AssistantMessage
                  key={index}
                  content={message.content as string}
                />
              );
            case "user":
              return (
                <UserMessage key={index} content={message.content as string} />
              );
            default:
              return;
          }
        })}
      </div>
      <div className="h-[54px]" ref={scrollAnchor} />
    </div>
  );
}
