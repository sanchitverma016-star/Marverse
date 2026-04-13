const TMDB_API_KEY = "359cf0be126839f3b58567fdf01eaa13";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  adult: boolean;
  media_type?: "movie" | "tv";
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: TMDBMovie[];
  };
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  status: string;
  tagline: string;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: TMDBMovie[];
  };
  seasons: Season[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export function getImageUrl(path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "/placeholder-poster.jpg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function getTVDetails(tvId: number): Promise<TMDBTVDetails | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching TV details:", error);
    return null;
  }
}

export async function searchMarvel(query: string): Promise<TMDBMovie[]> {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`),
      fetch(`${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
    ]);
    
    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();
    
    const movies = (movieData.results || []).map((m: TMDBMovie) => ({ ...m, media_type: "movie" as const }));
    const tvShows = (tvData.results || []).map((t: TMDBMovie) => ({ ...t, media_type: "tv" as const }));
    
    return [...movies, ...tvShows];
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
}
