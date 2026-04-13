"use client";

import React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Plus, Check, Star } from "lucide-react";
import { getImageUrl, getMovieDetails, getTVDetails, type TMDBMovieDetails, type TMDBTVDetails } from "@/lib/tmdb";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/watchlist-context";
import type { MarvelItem } from "@/lib/marvel-data";

interface MovieCardProps {
  item: MarvelItem;
  onNavigate?: () => void;
}

export function MovieCard({ item, onNavigate }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [details, setDetails] = useState<TMDBMovieDetails | TMDBTVDetails | null>(null);
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const inWatchlist = isInWatchlist(item.tmdbId);
  const linkPath = item.type === "movie" ? `/movie/${item.tmdbId}` : `/series/${item.tmdbId}`;

  useEffect(() => {
    async function fetchDetails() {
      if (item.type === "movie") {
        const data = await getMovieDetails(item.tmdbId);
        setDetails(data);
      } else {
        const data = await getTVDetails(item.tmdbId);
        setDetails(data);
      }
    }
    fetchDetails();
  }, [item.tmdbId, item.type]);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(item.tmdbId);
    } else {
      addToWatchlist({
        tmdbId: item.tmdbId,
        type: item.type,
        title: item.title,
        posterPath: details?.poster_path || null,
      });
    }
  };

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const rating = details?.vote_average?.toFixed(1) || "N/A";
  const posterPath = details?.poster_path;

  return (
    <Link href={linkPath} onClick={handleClick}>
      <div
        className="group relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Container with popup animation */}
        <div
          className={`relative overflow-hidden rounded-2xl bg-card transition-all duration-300 ease-out ${
            isHovered 
              ? "scale-110 z-10 shadow-2xl shadow-primary/20" 
              : "scale-100 z-0"
          }`}
          style={{ aspectRatio: "2/3" }}
        >
          {/* Poster Image */}
          {posterPath ? (
            <Image
              src={getImageUrl(posterPath, "w500") || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm text-center px-2">{item.title}</span>
            </div>
          )}

          {/* Watchlist Button - Small circle in top left */}
          <button
            onClick={handleWatchlistClick}
            className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
              inWatchlist
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
            } ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            {inWatchlist ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
          </div>

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Play Button */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isHovered 
                    ? "bg-primary scale-100" 
                    : "bg-primary/50 scale-75"
                }`}
              >
                <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
              </div>
            </div>

            {/* Title at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-semibold text-foreground text-sm line-clamp-2 text-center">
                {item.title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
