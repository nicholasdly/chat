import { CoreMessage } from "ai";
import { MemoizedReactMarkdown } from "./markdown";
import { cn } from "@/lib/utils";

export default function ChatMessage({ message }: { message: CoreMessage }) {
  return (
    <div
      className={cn(
        "w-max max-w-[75%] hyphens-auto break-words rounded-2xl px-3 py-2",
        message.role === "user"
          ? "self-end whitespace-pre-line bg-blue-500"
          : "bg-zinc-200",
      )}
    >
      <MemoizedReactMarkdown
        className={cn(
          "prose m-0 p-0 leading-normal",
          message.role === "user" ? "text-white" : "text-black",
        )}
      >
        {message.content as string}
      </MemoizedReactMarkdown>
    </div>
  );
}
