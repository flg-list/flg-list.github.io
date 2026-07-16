import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "FLG — Your 0→1 accountability partner",
  description:
    "Founder Led Growth: one next action at a time, from localhost to launched. No list dumps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <StoreProvider>
          <header className="border-b border-[var(--border)]">
            <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[#1a1200] grid place-items-center font-black text-sm">
                  0→1
                </span>
                <span className="font-bold tracking-tight">
                  FLG
                  <span className="text-slate-500 font-normal text-sm ml-2 hidden sm:inline">
                    founder led growth
                  </span>
                </span>
              </Link>
              <a
                href="https://buymeacoffee.com/flg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#ffdd00] text-[#1a1200] hover:brightness-105 !py-1.5 !px-3 text-xs"
              >
                ☕ Buy me a coffee
              </a>
            </div>
          </header>
          <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-8">{children}</main>
          <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-slate-500">
            FLG is free & runs entirely in your browser. If it moved one of your projects forward,{" "}
            <a
              href="https://buymeacoffee.com/flg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              a coffee ☕
            </a>{" "}
            fuels the next feature.
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
