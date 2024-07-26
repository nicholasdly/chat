import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nicholas Ly",
  description:
    "Get to know Nicholas Ly and his work by chatting with his AI assistant!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster richColors theme="system" />
      <body
        className={cn("dark:bg-zinc-900 dark:text-zinc-200", inter.variable)}
      >
        {children}
      </body>
    </html>
  );
}
