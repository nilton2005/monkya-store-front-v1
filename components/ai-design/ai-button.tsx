"use client";

import { cn } from "lib/utils";
import { Gochi_Hand } from "next/font/google";
import Link from "next/link";

// configuracion de la fuente
const fontHand = Gochi_Hand({
  subsets: ["latin"],
  weight: ["400"],
});

export function AIDesignButton() {
  return (
    <Link
      href="/ai-designer"
      className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        "bg-[#f2cd4e] text-[#272512] border-2 border-[#f2cd4e]",
        "rounded-2xl px-3 py-1.5 sm:px-6 sm:py-2",
        "hover:scale-105 hover:shadow-[0_0_15px_rgba(242,205,78,0.4)] animate-bounce",
        fontHand.className,
      )}
      aria-label="Diseñar con IA"
    >
      {/* Mobile: icon only */}
      <span className="sm:hidden text-base font-bold flex items-center gap-1">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
          />
        </svg>
        IA
      </span>
      {/* Desktop: full text */}
      <span className="hidden sm:inline text-xl tracking-wide">
        Diseña tu ropa con IA
      </span>

      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#272512] opacity-75">
          {" "}
        </span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#272512]"></span>
      </span>
    </Link>
  );
}
