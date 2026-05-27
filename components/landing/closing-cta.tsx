"use client";

import { SearchDialog } from "./search-dialog";

export function ClosingCTA() {
  return (
    <section className="relative bg-white text-black py-28 md:py-40 border-t border-black/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
        <span className="inline-flex items-center gap-3 text-[0.7rem] md:text-xs uppercase tracking-[0.22em] text-neutral-500 mb-8">
          <span className="w-8 h-px bg-black/40" />
          Today&apos;s edition
          <span className="w-8 h-px bg-black/40" />
        </span>
        <h2 className="text-5xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-10 text-balance">
          Read what just changed<br />in your town.
        </h2>
        <p className="text-lg md:text-2xl text-neutral-600 leading-snug font-light mb-10 max-w-2xl mx-auto">
          The desk is open. The trace is public. Find your edition.
        </p>
        <div className="flex justify-center">
          <SearchDialog
            trigger={<button className="btn-solid-dark">Find your edition →</button>}
          />
        </div>
      </div>
    </section>
  );
}
