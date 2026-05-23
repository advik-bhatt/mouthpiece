import { publishedBrief } from "@/lib/local-lens-data";

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id !== publishedBrief.id) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#1d1b18]">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Brief not found</h1>
          <p className="mt-3 text-black/60">
            LocalLens could not find this civic brief.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#1d1b18]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
            {publishedBrief.confidence} confidence
          </span>
          <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm text-blue-800">
            {publishedBrief.status}
          </span>
          <span className="rounded-full border border-black/10 bg-[#f4f1ea] px-3 py-1 text-sm">
            {publishedBrief.category}
          </span>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-black/40">
          {publishedBrief.area}
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          {publishedBrief.headline}
        </h1>

        <p className="mt-6 text-lg text-black/70">{publishedBrief.summary}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-5">
            <h2 className="font-semibold">Why it matters</h2>
            <p className="mt-2 text-sm text-black/65">
              {publishedBrief.whyItMatters}
            </p>
          </section>

          <section className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-5">
            <h2 className="font-semibold">Who may be affected</h2>
            <p className="mt-2 text-sm text-black/65">
              {publishedBrief.whoIsAffected.join(", ")}
            </p>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Sources</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {publishedBrief.sources.map((source) => (
              <a
                key={source.title}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-5 transition hover:border-black/30"
              >
                <div className="font-semibold">{source.title}</div>
                <p className="mt-2 text-sm text-black/60">{source.role}</p>
                <p className="mt-3 truncate text-xs text-black/40">{source.url}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-black/10 bg-[#fbfaf7] p-5">
          <h2 className="text-2xl font-semibold">Agent trace</h2>
          <ol className="mt-4 space-y-3">
            {publishedBrief.agentTrace.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm text-black/65">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  );
}
