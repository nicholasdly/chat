interface MessageProps {
  content: string;
}

export function UserMessage({ content }: MessageProps) {
  return (
    <p className="ml-auto w-max max-w-[75%] hyphens-auto whitespace-pre-line break-words rounded-2xl bg-blue-500 px-3 py-2 text-white">
      {content}
    </p>
  );
}

export function AssistantMessage({ content }: MessageProps) {
  return (
    <p className="w-max max-w-[75%] hyphens-auto whitespace-pre-line break-words rounded-2xl bg-zinc-200 px-3 py-2">
      {content}
    </p>
  );
}
