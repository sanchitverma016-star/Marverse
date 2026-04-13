"use client";

import { Header } from "@/components/header";
import { HeroSlider } from "@/components/hero-slider";
import { PhaseSection } from "@/components/phase-section";
import { marvelMovies, marvelSeries, getMarvelByPhase, getAllPhases } from "@/lib/marvel-data";

export default function HomePage() {
  const phases = getAllPhases();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Slider */}
      <section className="pt-16">
        <HeroSlider />
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Phases Section - Merged Movies and Series */}
        <section id="phases" className="scroll-mt-24">
          {phases.map(phase => {
            const movieItems = getMarvelByPhase(phase, "movie");
            const seriesItems = getMarvelByPhase(phase, "series");
            
            // Skip phases with no content
            if (movieItems.length === 0 && seriesItems.length === 0) {
              return null;
            }

            return (
              <div key={`phase-${phase}`} className="mb-16">
                {/* Phase Title */}
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Phase {phase}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Movies in this phase */}
                {movieItems.length > 0 && (
                  <PhaseSection
                    phase={phase}
                    items={movieItems}
                    type="movie"
                  />
                )}

                {/* Series in this phase */}
                {seriesItems.length > 0 && (
                  <PhaseSection
                    phase={phase}
                    items={seriesItems}
                    type="series"
                  />
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">MAR</span>
              <span className="text-xl font-bold text-foreground">VERSE</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Data provided by TMDB. This is a fan-made project and is not affiliated with Marvel or Disney.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
