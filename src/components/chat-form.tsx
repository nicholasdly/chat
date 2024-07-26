import { ArrowUpIcon } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";

interface ChatFormProps {
  input: string;
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}

export default function ChatForm({
  input,
  handleChange,
  handleSubmit,
  loading,
}: ChatFormProps) {
  return (
    <form
      className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-white/70 px-5 pb-5 pt-3 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <div className="flex rounded-2xl border">
        <textarea
          id="editor"
          className="mr-8 w-full resize-none bg-transparent px-3 py-2 outline-none"
          placeholder="Send a message..."
          rows={1}
          maxLength={200}
          spellCheck
          tabIndex={0}
          dir="auto"
          autoFocus
          value={input}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (!loading && input.trim().length > 0) handleSubmit();
            }
          }}
        />
        <div className="absolute bottom-[25px] right-[28px] size-fit">
          <button
            type="submit"
            aria-label="Send"
            disabled={loading || input.trim().length <= 0}
            className="inline-flex aspect-square size-7 items-center justify-center rounded-full bg-blue-500 text-white transition-colors duration-300 disabled:bg-zinc-500"
          >
            <ArrowUpIcon className="size-5 stroke-[3px]" />
          </button>
        </div>
      </div>
    </form>
  );
}
