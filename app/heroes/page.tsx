"use client";

import { Header } from "@/components/header";
import { CategorySection } from "@/components/category-section";
import { PageTransition } from "@/components/page-transition";

export default function HeroesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <CategorySection />
        </main>

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
    </PageTransition>
  );
}
