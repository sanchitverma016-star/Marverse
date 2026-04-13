"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Plus, Check } from "lucide-react";
import { getImageUrl, getMovieDetails, getTVDetails } from "@/lib/tmdb";
import { marvelMovies, marvelSeries, type MarvelItem } from "@/lib/marvel-data";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/watchlist-context";

interface SlideData {
  item: MarvelItem;
  backdrop: string | null;
  overview: string;
  rating: number;
  year: string;
}

export function HeroSlider() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // Get random items on mount
  useEffect(() => {
    async function fetchSlides() {
      const allItems = [...marvelMovies, ...marvelSeries];
      const shuffled = allItems.sort(() => Math.random() - 0.5).slice(0, 6);
      
      const slideData = await Promise.all(
        shuffled.map(async (item) => {
          try {
            if (item.type === "movie") {
              const details = await getMovieDetails(item.tmdbId);
              return {
                item,
                backdrop: details?.backdrop_path || null,
                overview: details?.overview || "",
                rating: details?.vote_average || 0,
                year: details?.release_date?.split("-")[0] || "",
              };
            } else {
              const details = await getTVDetails(item.tmdbId);
              return {
                item,
                backdrop: details?.backdrop_path || null,
                overview: details?.overview || "",
                rating: details?.vote_average || 0,
                year: details?.first_air_date?.split("-")[0] || "",
              };
            }
          } catch {
            return {
              item,
              backdrop: null,
              overview: "",
              rating: 0,
              year: "",
            };
          }
        })
      );
      
      setSlides(slideData);
    }
    
    fetchSlides();
  }, []);

  const goToSlide = useCallback((index: number, direction: "left" | "right") => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }, 300);
  }, [isAnimating, slides.length]);

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex, "right");
  }, [currentIndex, slides.length, goToSlide]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, "left");
  }, [currentIndex, slides.length, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(goNext, 8000);
    return () => clearInterval(interval);
  }, [slides.length, goNext]);

  const currentSlide = slides[currentIndex];
  
  if (!currentSlide) {
    return (
      <div className="relative w-full h-[70vh] bg-card animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(currentSlide.item.tmdbId);
  const linkPath = currentSlide.item.type === "movie" 
    ? `/movie/${currentSlide.item.tmdbId}` 
    : `/series/${currentSlide.item.tmdbId}`;

  const handleWatchlistClick = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(currentSlide.item.tmdbId);
    } else {
      addToWatchlist({
        tmdbId: currentSlide.item.tmdbId,
        type: currentSlide.item.type,
        title: currentSlide.item.title,
        posterPath: null,
      });
    }
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-out ${
          isAnimating 
            ? slideDirection === "right"
              ? "opacity-0 translate-x-12"
              : "opacity-0 -translate-x-12"
            : "opacity-100 translate-x-0"
        }`}
      >
        {currentSlide.backdrop ? (
          <Image
            src={getImageUrl(currentSlide.backdrop, "original") || "/placeholder.svg"}
            alt={currentSlide.item.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div
          className={`max-w-2xl transition-all duration-500 ease-out ${
            isAnimating 
              ? slideDirection === "right"
                ? "opacity-0 translate-x-8"
                : "opacity-0 -translate-x-8"
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full uppercase tracking-wide">
              {currentSlide.item.type === "movie" ? "Movie" : "Series"}
            </span>
            <span className="text-muted-foreground text-sm">
              Phase {currentSlide.item.phase}
            </span>
            {currentSlide.year && (
              <span className="text-muted-foreground text-sm">
                {currentSlide.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            {currentSlide.item.title}
          </h1>

          {/* Rating */}
          {currentSlide.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded">
                <span className="text-yellow-500 font-bold">{currentSlide.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-sm">TMDB Rating</span>
            </div>
          )}

          {/* Overview */}
          {currentSlide.overview && (
            <p className="text-muted-foreground text-base sm:text-lg mb-8 line-clamp-3">
              {currentSlide.overview}
            </p>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href={linkPath}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              {currentSlide.item.type === "movie" ? "Watch" : "Episode 1"}
            </Link>
            
            <button
              onClick={handleWatchlistClick}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                inWatchlist
                  ? "bg-foreground/20 text-foreground hover:bg-foreground/30"
                  : "bg-foreground/10 text-foreground hover:bg-foreground/20"
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-5 h-5" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Watchlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/70 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/70 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index, index > currentIndex ? "right" : "left")}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
