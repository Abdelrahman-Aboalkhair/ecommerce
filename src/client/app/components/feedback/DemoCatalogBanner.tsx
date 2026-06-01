"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { isDemoCatalogForced } from "@/app/lib/catalog/demoMode";

export default function DemoCatalogBanner() {
  const forced = isDemoCatalogForced();

  return (
    <div
      className="sticky top-0 z-30 w-full border-b border-amber-300/90 bg-amber-50/95 shadow-sm backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          <Info className="h-3.5 w-3.5" aria-hidden />
          Demo
        </span>

        <div className="min-w-0 flex-1 text-sm leading-snug text-amber-950">
          <p>
            <span className="font-semibold">Static sample catalog</span>
            {" — "}
            product listings are placeholder records, not live inventory.
            {forced ? (
              <>
                {" "}
                Demo mode is turned on in this build; the API may still be
                running locally.
              </>
            ) : (
              <>
                {" "}
                The backend API is unavailable because hosting is{" "}
                <span className="font-medium">down or not set up</span> for this
                deployment.
              </>
            )}
          </p>
          <p className="mt-1 text-amber-900/85">
            Browse-only preview. Sign-in, cart, and checkout require a running
            backend.{" "}
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
