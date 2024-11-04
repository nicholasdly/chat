import { CoreMessage } from "ai";

import { cn } from "@/lib/utils";

import { MemoizedReactMarkdown } from "./markdown";

export default function ChatMessage({ message }: { message: CoreMessage }) {
  return (
    <div
      className={cn(
        "w-max max-w-[75%] hyphens-auto break-words rounded-2xl px-3 py-2",
        message.role === "user"
          ? "self-end whitespace-pre-line bg-blue-500"
          : "bg-zinc-200 dark:bg-zinc-700",
      )}
    >
      <MemoizedReactMarkdown
        className={cn(
          "prose m-0 p-0 leading-normal dark:prose-invert",
          message.role === "user"
            ? "text-white"
            : "text-black dark:text-zinc-200",
        )}
      >
        {message.content as string}
      </MemoizedReactMarkdown>
    </div>
  );
}
