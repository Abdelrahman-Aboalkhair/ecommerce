"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { isDemoMode } from "@/app/lib/demo";

export default function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      className="sticky top-0 z-30 w-full border-b border-amber-300/90 bg-amber-50/95 shadow-sm backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          <Info className="h-3.5 w-3.5" aria-hidden />
          Interactive demo
        </span>

        <div className="min-w-0 flex-1 text-sm leading-snug text-amber-950">
          <p>
            <span className="font-semibold">All data is simulated</span>
            {" — "}
            no live API or database. Sign in, cart, checkout, orders, and admin
            dashboards run entirely in your browser.
          </p>
          <p className="mt-1 text-amber-900/85">
            Chat is disabled in this build. Changes persist in local storage until
            you clear site data.{" "}
            <Link
              href="https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform#local-setup"
              className="font-medium underline underline-offset-2 hover:text-amber-950"
              target="_blank"
              rel="noopener noreferrer"
            >
              Run the full stack locally
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
