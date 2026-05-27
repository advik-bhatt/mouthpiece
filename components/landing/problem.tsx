import Image from "next/image";

export function Problem() {
  return (
    <section className="flex flex-col lg:flex-row lg:justify-between lg:items-stretch min-h-screen bg-white">
      <div className="flex-1 lg:order-1 px-6 md:px-10 py-16 lg:py-0 lg:pr-12 flex flex-col justify-center max-w-3xl">
        <h3 className="uppercase mb-6 text-xs md:text-sm tracking-[0.22em] text-neutral-500">
          § 01 , The problem
        </h3>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight mb-6 text-balance">
          Public information,<br />
          privately ignored.
        </h2>
        <p className="text-lg md:text-2xl lg:text-3xl mb-6 leading-snug font-light text-neutral-800 text-balance">
          Every day, your town hall posts agendas. Your county posts notices. Transit posts service changes.
          Permits get filed. PDFs get uploaded.
        </p>
        <p className="text-base md:text-lg text-neutral-600 mb-8 leading-relaxed max-w-xl">
          All of it is public. None of it is readable. Most of it stays buried until it affects someone , and by
          then it&apos;s too late to do anything about it.
        </p>
        <p className="text-sm md:text-base text-neutral-500 border-l-2 border-black pl-4 uppercase tracking-wide max-w-xl">
          The information isn&apos;t hidden. It&apos;s just shaped like government, not like a newspaper.
        </p>
      </div>
      <div className="flex-1 lg:order-2 relative h-[60vh] lg:h-auto lg:min-h-screen">
        <Image
          src="/images/newspaper2.webp"
          alt="Newspaper pages and civic reporting"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover grayscale"
        />
      </div>
    </section>
  );
}
