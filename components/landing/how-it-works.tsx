"use client";

import { motion } from "framer-motion";

const STEPS = [
  { n: "01", title: "Scout", body: "Agents discover and validate public sources for your area , city sites, county notices, transit alerts, agendas, schools, permits.", tool: "Nimble" },
  { n: "02", title: "Monitor", body: "The desk passively checks each source, pulls live content, parses messy PDFs and calendars, watches for change.", tool: "Nimble" },
  { n: "03", title: "Remember", body: "Every snapshot, hash, and decision is written to a civic memory. The desk knows what changed since last time.", tool: "ClickHouse" },
  { n: "04", title: "Decide", body: "An editor agent filters administrative noise. A Editorial Agent checks claims against source text. A reliability reviewer checks the chain before publication.", tool: "Editorial" },
  { n: "05", title: "Publish", body: "Approved briefs are published as grounded, citeable civic micro-briefs , readable for residents, machine-readable for agents.", tool: "Senso · cited.md" },
  { n: "06", title: "Explain", body: "Every brief ships with what was checked, what was rejected, what was approved, and why. Every span is traced.", tool: "Datadog" },
];

const SPONSORS = ["Nimble", "ClickHouse", "Senso / cited.md", "Datadog"];

const NETWORK_LINES = [
  { top: "10%", left: "-12%", width: "58rem", rotate: "9deg", delay: 0.1, duration: 7.5 },
  { top: "18%", left: "34%", width: "48rem", rotate: "-13deg", delay: 1.4, duration: 8.2 },
  { top: "29%", left: "-8%", width: "44rem", rotate: "-8deg", delay: 2.2, duration: 6.8 },
  { top: "38%", left: "52%", width: "36rem", rotate: "22deg", delay: 3.6, duration: 7.9 },
  { top: "51%", left: "7%", width: "72rem", rotate: "15deg", delay: 0.8, duration: 9.4 },
  { top: "64%", left: "-14%", width: "42rem", rotate: "31deg", delay: 2.8, duration: 8.9 },
  { top: "73%", left: "40%", width: "48rem", rotate: "-28deg", delay: 3.1, duration: 7.2 },
  { top: "86%", left: "10%", width: "68rem", rotate: "-6deg", delay: 1.9, duration: 10.2 },
];

const NETWORK_NODES = [
  { x: 9, y: 20, delay: 0 },
  { x: 24, y: 13, delay: 0.7 },
  { x: 43, y: 24, delay: 1.4 },
  { x: 66, y: 16, delay: 2.1 },
  { x: 86, y: 29, delay: 1.1 },
  { x: 16, y: 48, delay: 2.8 },
  { x: 34, y: 42, delay: 1.9 },
  { x: 55, y: 51, delay: 0.4 },
  { x: 75, y: 45, delay: 2.5 },
  { x: 92, y: 62, delay: 3.2 },
  { x: 23, y: 74, delay: 1.2 },
  { x: 47, y: 82, delay: 2.2 },
  { x: 69, y: 73, delay: 3.4 },
  { x: 83, y: 88, delay: 0.9 },
];

const NETWORK_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [1, 6],
  [2, 6],
  [2, 7],
  [3, 7],
  [4, 8],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [5, 10],
  [6, 10],
  [7, 11],
  [8, 12],
  [9, 13],
  [10, 11],
  [11, 12],
  [12, 13],
  [3, 8],
  [7, 12],
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-black text-white py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {NETWORK_LINES.map((line) => (
          <div
            key={`${line.top}-${line.left}`}
            className="absolute h-px overflow-hidden bg-white/15"
            style={{
              top: line.top,
              left: line.left,
              width: line.width,
              transform: `rotate(${line.rotate})`,
            }}
          >
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
              animate={{ x: ["-130%", "360%"] }}
              transition={{
                duration: line.duration,
                delay: line.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        ))}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {NETWORK_CONNECTIONS.map(([from, to], index) => {
            const start = NETWORK_NODES[from];
            const end = NETWORK_NODES[to];

            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.16"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.circle
                  r="0.35"
                  fill="rgba(255,255,255,0.9)"
                  filter="url(#networkGlow)"
                  animate={{
                    cx: [start.x, end.x],
                    cy: [start.y, end.y],
                    opacity: [0, 0.95, 0],
                  }}
                  transition={{
                    duration: 4.8 + (index % 5) * 0.55,
                    delay: (index % 8) * 0.45,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </g>
            );
          })}
          <defs>
            <filter id="networkGlow" x="-500%" y="-500%" width="1000%" height="1000%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        {NETWORK_NODES.map((node) => (
          <motion.span
            key={`${node.x}-${node.y}`}
            className="absolute size-1.5 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.85)]"
            style={{ top: `${node.y}%`, left: `${node.x}%` }}
            animate={{ opacity: [0.32, 1, 0.32], scale: [1, 1.85, 1] }}
            transition={{
              duration: 3.2,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent,rgba(0,0,0,0.78)_72%)]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16 md:mb-24">
          <h3 className="uppercase mb-6 text-xs md:text-sm tracking-[0.22em] text-neutral-400">
            § 02 , How it works
          </h3>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6 max-w-4xl text-balance">
            The agents have already been running.
          </h2>
          <p className="text-lg md:text-2xl text-neutral-300 max-w-3xl font-light leading-snug text-balance">
            You aren&apos;t triggering a query. You&apos;re arriving at a desk that has been
            covering your town since before you searched.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/15 border border-white/15">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="bg-black p-8 md:p-10 min-h-[260px] group hover:bg-white hover:text-black transition-colors duration-500"
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-xs uppercase tracking-[0.22em] text-neutral-500 group-hover:text-neutral-600 transition-colors">
                  Step {step.n}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] px-2 py-1 border border-white/30 group-hover:border-black/30 transition-colors">
                  {step.tool}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">{step.title}</h3>
              <p className="text-sm md:text-base text-neutral-300 group-hover:text-neutral-700 transition-colors leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 mt-16 border-y border-white bg-black/80 overflow-hidden shadow-[0_12px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-stretch">
            <div className="hidden md:flex shrink-0 items-center border-r border-white px-8 bg-white text-black">
              <span className="text-[0.65rem] uppercase tracking-[0.22em] whitespace-nowrap">
                Powered with
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="sponsor-belt flex w-max items-center py-5">
                <SponsorRow />
                <SponsorRow ariaHidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SponsorRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-5 px-5"
    >
      {Array.from({ length: 4 }).flatMap((_, setIndex) =>
        SPONSORS.map((sponsor) => (
          <div key={`${sponsor}-${setIndex}`} className="flex items-center gap-5">
            <span className="text-2xl md:text-4xl font-bold tracking-tight whitespace-nowrap text-white">
              {sponsor}
            </span>
            <span className="h-px w-10 md:w-16 bg-white/35" />
          </div>
        )),
      )}
    </div>
  );
}
