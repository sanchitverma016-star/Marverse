"use client";

import { MovieCard } from "./movie-card";
import type { MarvelItem } from "@/lib/marvel-data";

interface PhaseSectionProps {
  phase: number;
  items: MarvelItem[];
  type: "movie" | "series";
}

export function PhaseSection({ phase, items, type }: PhaseSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm">
          Phase {phase}
        </span>
        <span className="text-muted-foreground text-sm font-normal">
          {items.length} {type === "movie" ? "Movies" : "Series"}
        </span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map(item => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
