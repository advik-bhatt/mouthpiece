import { Masthead } from "@/components/landing/masthead";
import { Colophon } from "@/components/landing/colophon";
import { LenisProvider } from "@/components/landing/lenis-provider";
import { PublicWireEdition } from "@/components/edition/public-wire-edition";
import { getEditionBySlug } from "@/content/public-wire-content";

type AreaPageProps = {
  params: Promise<{ area: string }>;
  searchParams: Promise<{ focus?: string; areaName?: string; q?: string; query?: string; live?: string }>;
};

function prettifyArea(slug: string) {
  return slug
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: AreaPageProps) {
  const { area } = await params;
  const edition = getEditionBySlug(area);
  const pretty = edition.area || prettifyArea(area);
  return {
    title: `PublicWire ${pretty} , Today's Civic Briefing`,
    description: `Self-running civic newsroom for ${pretty}. Agent-monitored. Source-cited. Reliability Reviewer-reviewed.`,
  };
}

export default async function AreaPage({ params, searchParams }: AreaPageProps) {
  const { area } = await params;
  const { focus, areaName, q, query, live } = await searchParams;
  const focusList = focus ? focus.split(",") : [];
  const pretty = areaName
    ? decodeURIComponent(areaName)
    : getEditionBySlug(area).area || prettifyArea(area);
  const initialQuery = q || query || "";
  const autoRun = live === "1" || live === "true";

  return (
    <>
      <LenisProvider />
      <Masthead variant="solid" />
      <main>
        <PublicWireEdition
          areaSlug={area}
          areaName={pretty}
          focus={focusList}
          initialQuery={initialQuery}
          autoRun={autoRun}
        />
      </main>
      <Colophon />
    </>
  );
}
