import { LenisProvider } from "@/components/landing/lenis-provider";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AgentSwarm } from "@/components/landing/agent-swarm";
import { TrustLayer } from "@/components/landing/trust-layer";
import { Comparison } from "@/components/landing/comparison";
import { ClosingCTA } from "@/components/landing/closing-cta";
import { Colophon } from "@/components/landing/colophon";

export default function HomePage() {
  return (
    <>
      <LenisProvider />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <TrustLayer />
        <Comparison />
        <AgentSwarm />
        <ClosingCTA />
        <Colophon />
      </main>
    </>
  );
}
