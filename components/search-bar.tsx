"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { searchMarvel, getImageUrl, type TMDBMovie } from "@/lib/tmdb";
import { marvelMovies, marvelSeries } from "@/lib/marvel-data";
import Image from "next/image";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Get all Marvel TMDB IDs for filtering
  const marvelTmdbIds = new Set([
    ...marvelMovies.map(m => m.tmdbId),
    ...marvelSeries.map(s => s.tmdbId),
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        const searchResults = await searchMarvel(query);
        // Filter to only Marvel content from our database
        const filteredResults = searchResults.filter(r => marvelTmdbIds.has(r.id));
        setResults(filteredResults.slice(0, 8));
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (result: TMDBMovie) => {
    const type = result.media_type === "tv" ? "series" : "movie";
    router.push(`/${type}/${result.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`max-w-2xl mx-auto pt-20 px-4 transition-all duration-300 ${
          isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Marvel movies & series..."
            className="w-full pl-12 pr-12 py-4 bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="mt-4 bg-card rounded-xl border border-border overflow-hidden">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full flex items-center gap-4 p-3 hover:bg-secondary transition-colors text-left ${
                  index !== 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {result.poster_path ? (
                    <Image
                      src={getImageUrl(result.poster_path, "w200") || "/placeholder.svg"}
                      alt={result.title || result.name || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {result.title || result.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {result.media_type === "tv" ? "Series" : "Movie"} • {" "}
                    {(result.release_date || result.first_air_date || "").split("-")[0]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query.trim().length > 1 && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No Marvel content found for "{query}"
          </div>
        )}

        {/* Close hint */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Press ESC or click outside to close
        </p>
      </div>
    </div>
  );
}
