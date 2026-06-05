import { Movie } from "./types";

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}): Promise<Movie[]> {
  const queryParams = new URLSearchParams(params);
  const res = await fetch(`/api/tmdb/${endpoint}?${queryParams.toString()}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch ${endpoint}`);
  }
  const data = await res.json();
  return data.results || [];
}

export const fetchPopularMovies = () => fetchFromTMDB("movie/popular");
export const fetchTrendingMovies = () => fetchFromTMDB("trending/movie/week");
export const fetchTopRatedMovies = () => fetchFromTMDB("movie/top_rated");
export const fetchMoviesByGenre = (genreId: number) => fetchFromTMDB("discover/movie", { with_genres: genreId.toString() });
export const searchMovies = (query: string) => fetchFromTMDB("search/movie", { query });

export async function fetchMovieDetailsFull(id: number): Promise<any> {
  try {
    const res = await fetch(`/api/tmdb/movie/${id}?append_to_response=credits,videos,watch/providers,reviews,keywords`);
    if (!res.ok) throw new Error("Failed to fetch movie details");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const fetchSimilarMovies = (id: number) => fetchFromTMDB(`movie/${id}/similar`);
export const fetchRecommendedMovies = (id: number) => fetchFromTMDB(`movie/${id}/recommendations`);

export async function fetchPersonDetails(id: number): Promise<any> {
  try {
    const res = await fetch(`/api/tmdb/person/${id}?append_to_response=combined_credits`);
    if (!res.ok) throw new Error("Failed to fetch person details");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getImageUrl(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
