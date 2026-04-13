"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TypingText } from "./typing-text";
import { MovieCard } from "./movie-card";
import type { HeroCharacter } from "@/lib/hero-data";
import type { MarvelItem } from "@/lib/marvel-data";

interface HeroBoxProps {
  hero: HeroCharacter;
  movies: MarvelItem[];
}

export function HeroBox({ hero, movies }: HeroBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleBoxClick = () => {
    setIsExpanded((prev) => !prev);
  };

  // Scroll into view when expanded
  useEffect(() => {
    if (isExpanded && boxRef.current) {
      setTimeout(() => {
        boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [isExpanded]);

  return (
    <div ref={boxRef} className="w-full px-4 sm:px-8">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleBoxClick}
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border-2"
        style={{
          minHeight: isExpanded ? "auto" : "33.33vh",
          borderColor: isHovered || isExpanded ? hero.borderColor : "transparent",
          boxShadow:
            isHovered && !isExpanded
              ? `0 0 25px ${hero.borderColor}50, 0 0 50px ${hero.borderColor}25, inset 0 0 25px ${hero.borderColor}15`
              : isExpanded
                ? `0 0 35px ${hero.borderColor}60, 0 0 70px ${hero.borderColor}30, inset 0 0 30px ${hero.borderColor}20`
                : "none",
          transform: isHovered && !isExpanded ? "scale(1.01)" : "scale(1)",
        }}
      >
        {/* Dark background base */}
        <div className="absolute inset-0 bg-card" />

        {/* Subtle gradient overlay matching hero color */}
        <div
          className="absolute inset-0 opacity-10 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at ${hero.imagePosition === "right" ? "80%" : "20%"} 50%, ${hero.borderColor}, transparent 70%)`,
            opacity: isHovered || isExpanded ? 0.15 : 0.05,
          }}
        />

        {/* Non-expanded: Hero name centered, quote + character on hover */}
        {!isExpanded ? (
          <div className="relative w-full flex items-center" style={{ minHeight: "33.33vh" }}>
            {/* Center content: Hero name (fades out on hover) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="text-center">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
                  {hero.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{"Click to explore"}</p>
              </div>
            </div>

            {/* Hover content: Quote text */}
            <div
              className={`relative w-full flex items-center transition-all duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                minHeight: "33.33vh",
                paddingLeft: hero.imagePosition === "left" ? "40%" : "2rem",
                paddingRight: hero.imagePosition === "right" ? "40%" : "2rem",
              }}
            >
              <div className="py-8 max-w-lg">
                <h3
                  className="text-2xl sm:text-3xl font-bold mb-4"
                  style={{ color: hero.borderColor }}
                >
                  {hero.name}
                </h3>
                <div className="text-base sm:text-lg text-muted-foreground leading-relaxed italic">
                  {isHovered && (
                    <TypingText
                      text={hero.quote}
                      speed={30}
                      delay={200}
                      className="text-foreground/80"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Character cutout image - appears on hover */}
            <div
              className={`absolute top-0 bottom-0 w-[35%] sm:w-[30%] transition-all duration-500 ${
                isHovered
                  ? "opacity-100 translate-x-0 scale-105"
                  : hero.imagePosition === "right"
                    ? "opacity-0 translate-x-8 scale-95"
                    : "opacity-0 -translate-x-8 scale-95"
              }`}
              style={{
                [hero.imagePosition]: 0,
                filter: `drop-shadow(0 0 30px ${hero.borderColor}60)`,
              }}
            >
              <Image
                src={hero.imagePath}
                alt={hero.name}
                fill
                className="object-contain object-bottom"
                sizes="30vw"
              />
            </div>
          </div>
        ) : (
          /* Expanded: Show movie thumbnails inside the box */
          <div className="relative w-full p-6 sm:p-8">
            {/* Header row */}
            <div className="flex items-center gap-3 mb-6">
              <h3
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: hero.borderColor }}
              >
                {hero.name}
              </h3>
              <span className="text-sm text-muted-foreground">
                {movies.length} {movies.length === 1 ? "Movie" : "Movies"}
              </span>
              <div className="flex-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg bg-secondary"
              >
                Close
              </button>
            </div>

            {/* Movie grid displayed side by side */}
            {movies.length > 0 ? (
              <div
                className="flex gap-4 overflow-x-auto pb-4"
                onClick={(e) => e.stopPropagation()}
              >
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="shrink-0 w-32 sm:w-40"
                  >
                    <MovieCard item={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No movies found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
