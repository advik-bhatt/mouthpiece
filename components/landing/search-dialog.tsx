"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, MapPin, Search } from "lucide-react";

const SUGGESTED_AREAS = [
  { label: "New Brunswick, NJ", slug: "new-brunswick", featured: true },
  { label: "Newark, NJ", slug: "newark" },
  { label: "Jersey City, NJ", slug: "jersey-city" },
  { label: "Middlesex County", slug: "middlesex-county" },
  { label: "Rutgers / College Ave", slug: "rutgers-college-ave" },
];

const INTERESTS = [
  { id: "transportation", label: "Transportation & roads", default: true },
  { id: "city-hall", label: "City hall & meetings", default: true },
  { id: "schools", label: "Schools & campus", default: true },
  { id: "events", label: "Events & community", default: true },
  { id: "permits", label: "Permits & development", default: false },
  { id: "safety", label: "Public safety & weather", default: false },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[,.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SearchDialogProps = {
  trigger?: React.ReactNode;
  large?: boolean;
};

export function SearchDialog({ trigger, large = false }: SearchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    INTERESTS.filter((i) => i.default).map((i) => i.id),
  );

  function toggleInterest(id: string) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function go(slug: string, label?: string) {
    const params = new URLSearchParams();
    if (selectedInterests.length) params.set("focus", selectedInterests.join(","));
    if (label) params.set("areaName", label);
    params.set("live", "1");
    setOpen(false);
    router.push(`/local/${slug}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const matched = SUGGESTED_AREAS.find(
      (a) => a.label.toLowerCase() === trimmed.toLowerCase(),
    );
    go(matched?.slug || slugify(trimmed), matched?.label || trimmed);
  }

  const defaultTrigger = (
    <Button
      size={large ? "lg" : "default"}
      className={
        large
          ? "h-14 px-8 text-base rounded-full bg-foreground hover:bg-foreground/90 text-background group"
          : "rounded-full bg-foreground hover:bg-foreground/90 text-background group"
      }
    >
      <Search className="size-4 mr-1" />
      Find your edition
      <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] bg-white text-black border border-black/15 rounded-none">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tight">
            Find your local edition
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            PublicWire runs a civic desk for your area. Tell us where you live and what you care about.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="area" className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Your area
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="area"
                placeholder="e.g. New Brunswick, NJ"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 bg-background"
                autoFocus
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTED_AREAS.map((a) => (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => setQuery(a.label)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    a.featured
                      ? "border-foreground/60 bg-foreground text-background hover:bg-foreground/90"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {a.label}
                  {a.featured && <span className="ml-1.5 font-mono text-[0.65rem] opacity-70">LIVE</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              What should the desk watch?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((interest) => {
                const active = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`text-left text-sm px-3 py-2.5 rounded-md border transition-colors ${
                      active
                        ? "border-foreground/60 bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:bg-accent/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-3.5 rounded-sm border ${
                          active ? "bg-foreground border-foreground" : "border-border"
                        }`}
                      />
                      {interest.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <p className="text-xs text-muted-foreground sm:mr-auto font-mono">
              Press Enter to open your edition
            </p>
            <Button type="submit" className="rounded-full bg-foreground hover:bg-foreground/90 text-background">
              Open civic briefing
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
