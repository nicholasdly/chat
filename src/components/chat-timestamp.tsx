"use client";

import { useHydration } from "@/lib/hooks/use-hydration";
import { Suspense } from "react";

export default function ChatTimestamp() {
  const hydrated = useHydration();

  return (
    <div className="mb-3 flex flex-col items-center text-nowrap text-xs text-zinc-500">
      <p>nicholasly.com</p>
      <Suspense key={hydrated ? "local" : "utc"}>
        <time dateTime={new Date().toISOString()}>
          Today{" "}
          {new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          })}
        </time>
      </Suspense>
    </div>
  );
}