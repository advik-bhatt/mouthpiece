"use client";

import { motion } from "framer-motion";

const FIELDS = [
  { label: "Headline", value: "George Street construction may affect downtown traffic this weekend" },
  { label: "Verification", value: "Verified from official source context" },
  { label: "What changed", value: "New construction notice posted, affecting traffic Sat AM – Sun PM" },
  { label: "Who is affected", value: "Downtown residents, Rutgers students, bus riders, local businesses" },
  { label: "Source surfaces checked", value: "28 across 7 civic layers" },
  { label: "Sources used", value: "City construction notice · NJ Transit advisory" },
];

const AUDIT_LINES = [
  "Checked 28 public source surfaces around New Brunswick.",
  "Detected 3 meaningful changes since the previous snapshot.",
  "Rejected 5 routine administrative updates.",
  "Verified street, dates, and affected groups against official source.",
  "Classified resident-relevant , affects downtown transportation.",
  "Reliability review passed. No unsupported claims. No speculation.",
  "Published a cited micro-brief and added trace.",
];

const PRINCIPLES = [
  {
    title: "Source-first reporting",
    body: "The paper starts from public records, official notices, agendas, alerts, and event listings. If the source does not support a claim, the claim does not ship.",
  },
  {
    title: "Resident relevance",
    body: "Agents ask whether an update affects access, time, safety, services, costs, meetings, transportation, schools, or deadlines before it reaches the paper.",
  },
  {
    title: "Visible rejection",
    body: "Routine filings, duplicated pages, stale posts, and unsupported items are not hidden. Readers can see what was filtered out and why.",
  },
  {
    title: "Reliability review",
    body: "A separate reviewer agent judges the reporting chain before publication, checking source quality, uncertainty, unsupported claims, and wording.",
  },
];

export function TrustLayer() {
  return (
    <section id="trust" className="bg-black text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h3 className="uppercase mb-6 text-xs md:text-sm tracking-[0.22em] text-neutral-400">
            § 04 , Trust layer
          </h3>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.92] tracking-tight mb-6 text-balance">
            Every brief shows<br />its receipts.
          </h2>
          <p className="text-lg md:text-2xl text-neutral-300 leading-snug font-light italic text-balance max-w-3xl">
            Each entry ships with the sources it used, what was rejected, what the
            reliability reviewer said, and a plain-English trace of how the story was made,
            with the option to look deeper.
          </p>
          <p className="mt-6 max-w-2xl border-l border-white/30 pl-4 text-sm md:text-base uppercase tracking-[0.08em] text-neutral-400">
            We are committed to a usable, bias-resistant civic news platform for the
            betterment of our towns.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-px bg-white/15 border border-white/15">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white text-black p-8 md:p-12"
          >
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-[0.65rem] uppercase tracking-[0.15em] px-2 py-1 bg-black text-white">Verified from official source</span>
              <span className="text-[0.65rem] uppercase tracking-[0.15em] px-2 py-1 border border-black/30">Transportation</span>
              <span className="text-[0.65rem] uppercase tracking-[0.15em] px-2 py-1 border border-black/30">Active</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.02] tracking-tight mb-6">
              George Street construction may affect downtown traffic this weekend.
            </h3>
            <dl className="space-y-3">
              {FIELDS.map((f) => (
                <div key={f.label} className="grid grid-cols-[140px_1fr] gap-4 items-baseline border-t border-black/10 pt-3">
                  <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-neutral-500">{f.label}</dt>
                  <dd className="text-sm md:text-base text-neutral-800 leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-black p-8 md:p-10"
          >
            <div className="text-[0.7rem] uppercase tracking-[0.22em] text-neutral-400 mb-4">
              Public audit log
            </div>
            <ol className="space-y-3">
              {AUDIT_LINES.map((line, i) => (
                <li key={i} className="flex gap-3 text-sm text-neutral-200 leading-relaxed">
                  <span className="text-xs text-neutral-500 shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-white/15">
              <div className="text-[0.7rem] uppercase tracking-[0.22em] text-neutral-400 mb-2">
                Reliability review
              </div>
              <p className="text-sm md:text-base text-neutral-200 italic leading-relaxed">
                &ldquo;Approved. The entry uses an official city source, does not
                speculate beyond the notice, labels affected groups clearly, and
                avoids unsupported claims about delays.&rdquo;
              </p>
            </div>
          </motion.aside>
        </div>

        <div className="mt-16 md:mt-20 grid lg:grid-cols-[0.9fr_1.5fr] gap-px bg-white/15 border border-white/15">
          <div className="bg-white text-black p-8 md:p-10">
            <div className="text-[0.7rem] uppercase tracking-[0.22em] text-neutral-500 mb-4">
              Investigation invited
            </div>
            <h3 className="text-3xl md:text-5xl font-bold leading-[1] tracking-tight mb-5">
              Don&apos;t just trust the paper. Inspect how the paper thinks.
            </h3>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
              PublicWire is designed so readers can examine the editorial philosophy
              behind each live edition: what the agents watch, what they reject,
              what they verify, and where uncertainty remains.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-white/15">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="bg-black p-6 md:p-7">
                <h4 className="text-2xl font-bold mb-3">{principle.title}</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
