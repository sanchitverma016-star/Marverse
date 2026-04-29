"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, Star, Clock, Calendar, Play, Plus, Check, 
  Users, Tv, Award, Layers, Youtube
} from "lucide-react";
import { useRef } from "react";
import { Header } from "@/components/header";
import { setTransitionDirection } from "@/components/page-transition";
import { 
  getTVDetails, getImageUrl, 
  type TMDBTVDetails, type CastMember 
} from "@/lib/tmdb";
import { marvelSeries, marvelMovies } from "@/lib/marvel-data";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/watchlist-context";

export default function SeriesDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const [series, setSeries] = useState<TMDBTVDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const trailerRef = useRef<HTMLDivElement>(null);
  
  const seriesId = parseInt(id);
  const inWatchlist = isInWatchlist(seriesId);
  
  // Find the Marvel item to get prerequisites
  const marvelItem = marvelSeries.find(s => s.tmdbId === seriesId);
  const prerequisiteIds = marvelItem?.prerequisite || [];

  useEffect(() => {
    async function fetchSeries() {
      setIsLoading(true);
      const data = await getTVDetails(seriesId);
      setSeries(data);
      setIsLoading(false);
    }
    fetchSeries();
  }, [seriesId]);

  const handleWatchlistClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(seriesId);
    } else if (series) {
      addToWatchlist({
        tmdbId: seriesId,
        type: "series",
        title: series.name || "",
        posterPath: series.poster_path,
      });
    }
  };

  // Get prerequisite content (can be movies or series)
  const prerequisiteMovies = marvelMovies.filter(m => 
    prerequisiteIds.includes(m.tmdbId)
  );
  const prerequisiteSeries = marvelSeries.filter(s => 
    prerequisiteIds.includes(s.tmdbId) && s.tmdbId !== seriesId
  );

  // Get trailer from videos
  const trailer = series?.videos?.results?.find(
    v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground">Series not found</p>
          <p className="text-sm text-muted-foreground">This series doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const episodeRuntime = series.episode_run_time?.[0] 
    ? `${series.episode_run_time[0]} min/ep` 
    : "N/A";
  const releaseYear = series.first_air_date?.split("-")[0] || "N/A";
  const rating = series.vote_average?.toFixed(1) || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Backdrop */}
      <div className="relative h-[50vh] sm:h-[60vh]">
        {series.backdrop_path ? (
          <Image
            src={getImageUrl(series.backdrop_path, "original") || "/placeholder.svg"}
            alt={series.name || ""}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 pb-16">
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0">
            <div className="relative w-48 sm:w-64 h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl mx-auto lg:mx-0">
              {series.poster_path ? (
                <Image
                  src={getImageUrl(series.poster_path, "w500") || "/placeholder.svg"}
                  alt={series.name || ""}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Tv className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {series.name}
            </h1>
            
            {series.tagline && (
              <p className="text-lg text-muted-foreground italic mb-4">
                "{series.tagline}"
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-foreground">{rating}</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{series.number_of_seasons} Season{series.number_of_seasons !== 1 ? "s" : ""}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg">
                <Tv className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{series.number_of_episodes} Episodes</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{episodeRuntime}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{releaseYear}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {series.genres?.map(genre => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </button>
              
              {trailer && (
                <button
                  onClick={scrollToTrailer}
                  className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  Play Trailer
                </button>
              )}
              
              <button
                onClick={handleWatchlistClick}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                  inWatchlist
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {series.overview || "No overview available."}
              </p>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {series.seasons && series.seasons.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Seasons
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {series.seasons
                .filter(s => s.season_number > 0)
                .map(season => (
                  <div key={season.id} className="bg-card rounded-xl overflow-hidden">
                    <div className="relative aspect-[2/3]">
                      {season.poster_path ? (
                        <Image
                          src={getImageUrl(season.poster_path, "w300") || "/placeholder.svg"}
                          alt={season.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Tv className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-foreground text-sm truncate">{season.name}</p>
                      <p className="text-xs text-muted-foreground">{season.episode_count} Episodes</p>
                    </div>
                  </div>
              ))}
            </div>
          </section>
        )}

        {/* Watch Before Section */}
        {(prerequisiteMovies.length > 0 || prerequisiteSeries.length > 0) && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Tv className="w-5 h-5 text-primary" />
              Watch These First
            </h2>
            <p className="text-muted-foreground mb-4">
              To fully enjoy this series, we recommend watching these first:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {prerequisiteMovies.map(prereq => (
                <Link
                  key={prereq.id}
                  href={`/movie/${prereq.tmdbId}`}
                  className="group"
                >
                  <PrerequisiteCard tmdbId={prereq.tmdbId} title={prereq.title} type="movie" />
                </Link>
              ))}
              {prerequisiteSeries.map(prereq => (
                <Link
                  key={prereq.id}
                  href={`/series/${prereq.tmdbId}`}
                  className="group"
                >
                  <PrerequisiteCard tmdbId={prereq.tmdbId} title={prereq.title} type="series" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cast Section */}
        {series.credits?.cast && series.credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {series.credits.cast.slice(0, 12).map(actor => (
                <CastCard key={actor.id} actor={actor} />
              ))}
            </div>
          </section>
        )}

        {/* Trailer Section */}
        {trailer && (
          <section ref={trailerRef} className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Youtube className="w-5 h-5 text-primary" />
              Trailer
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CastCard({ actor }: { actor: CastMember }) {
  return (
    <div className="text-center">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-card mb-2">
        {actor.profile_path ? (
          <Image
            src={getImageUrl(actor.profile_path, "w200") || "/placeholder.svg"}
            alt={actor.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="font-medium text-foreground text-sm truncate">{actor.name}</p>
      <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
    </div>
  );
}

function PrerequisiteCard({ tmdbId, title, type }: { tmdbId: number; title: string; type: "movie" | "series" }) {
  const [posterPath, setPosterPath] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPoster() {
      if (type === "movie") {
        const { getMovieDetails } = await import("@/lib/tmdb");
        const data = await getMovieDetails(tmdbId);
        if (data) setPosterPath(data.poster_path);
      } else {
        const data = await getTVDetails(tmdbId);
        if (data) setPosterPath(data.poster_path);
      }
    }
    fetchPoster();
  }, [tmdbId, type]);

  return (
    <div>
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card group-hover:scale-105 transition-transform duration-300">
        {posterPath ? (
          <Image
            src={getImageUrl(posterPath, "w300") || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Tv className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-foreground truncate">{title}</p>
      <p className="text-xs text-muted-foreground">{type === "movie" ? "Movie" : "Series"}</p>
    </div>
  );
}
