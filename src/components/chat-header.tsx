import Image from "next/image";

export default function ChatHeader() {
  return (
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
  );
}
