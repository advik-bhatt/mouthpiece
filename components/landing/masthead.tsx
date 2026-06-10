"use client";

import Link from "next/link";

type Props = { variant?: "solid" | "overlay" };

export function Masthead({ variant = "solid" }: Props) {
  const overlay = variant === "overlay";
  const textColor = overlay ? "text-white" : "text-black";
  const hover = overlay ? "hover:text-neutral-400" : "hover:text-neutral-500";

  return (
    <header
      className={
        overlay
          ? "absolute top-0 left-0 right-0 z-20 p-6 md:p-8"
          : "sticky top-0 z-30 bg-white border-b border-black/10 p-5 md:px-8"
      }
    >
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className={`${textColor} text-sm uppercase tracking-[0.04em]`}
        >
          PublicWire
        </Link>
        <nav className="flex gap-6 md:gap-10">
          <Link
            href="/#how"
            className={`${textColor} ${hover} transition-colors duration-300 uppercase text-xs md:text-sm tracking-[0.04em]`}
          >
            How it works
          </Link>
          <Link
            href="/#agents"
            className={`${textColor} ${hover} transition-colors duration-300 uppercase text-xs md:text-sm tracking-[0.04em]`}
          >
            Newsroom
          </Link>
          <Link
            href="/#trust"
            className={`${textColor} ${hover} transition-colors duration-300 uppercase text-xs md:text-sm tracking-[0.04em] hidden md:inline`}
          >
            Trust
          </Link>
        </nav>
      </div>
    </header>
  );
}
