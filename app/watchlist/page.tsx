"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Film, Tv, Trash2, Play } from "lucide-react";
import { Header } from "@/components/header";
import { setTransitionDirection } from "@/components/page-transition";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/watchlist-context";
import { getImageUrl } from "@/lib/tmdb";

export default function WatchlistPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const movies = watchlist.filter(item => item.type === "movie");
  const series = watchlist.filter(item => item.type === "series");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => {
            setTransitionDirection("back");
            router.back();
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Watchlist</h1>
          <span className="text-muted-foreground">
            {watchlist.length} {watchlist.length === 1 ? "item" : "items"}
          </span>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4">
              <Film className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start adding movies and series to your watchlist to keep track of what you want to watch.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Movies Section */}
            {movies.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Film className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Movies</h2>
                  <span className="text-sm text-muted-foreground">({movies.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {movies.map(item => (
                    <WatchlistCard
                      key={item.tmdbId}
                      item={item}
                      onRemove={() => removeFromWatchlist(item.tmdbId)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Series Section */}
            {series.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Tv className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Series</h2>
                  <span className="text-sm text-muted-foreground">({series.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {series.map(item => (
                    <WatchlistCard
                      key={item.tmdbId}
                      item={item}
                      onRemove={() => removeFromWatchlist(item.tmdbId)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

interface WatchlistCardProps {
  item: {
    tmdbId: number;
    type: "movie" | "series";
    title: string;
    posterPath: string | null;
    addedAt: string;
  };
  onRemove: () => void;
}

function WatchlistCard({ item, onRemove }: WatchlistCardProps) {
  const linkPath = item.type === "movie" ? `/movie/${item.tmdbId}` : `/series/${item.tmdbId}`;

  return (
    <div className="group relative">
      <Link href={linkPath}>
        <div className="relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ aspectRatio: "2/3" }}>
          {item.posterPath ? (
            <Image
              src={getImageUrl(item.posterPath, "w500") || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {item.type === "movie" ? (
                <Film className="w-12 h-12 text-muted-foreground" />
              ) : (
                <Tv className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        aria-label="Remove from watchlist"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Title */}
      <div className="mt-2">
        <h3 className="font-medium text-foreground text-sm truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
      </div>
    </div>
  );
}
