"use client";

import { HeroBox } from "./hero-box";
import { heroCharacters, getMoviesByHeroId } from "@/lib/hero-data";

export function CategorySection() {
  return (
    <section id="categories" className="scroll-mt-24 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-12 px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Categories</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Stacked full-width hero boxes */}
      <div className="flex flex-col gap-8">
        {heroCharacters.map((hero) => {
          const movies = getMoviesByHeroId(hero.id);
          return <HeroBox key={hero.id} hero={hero} movies={movies} />;
        })}
      </div>
    </section>
  );
}
