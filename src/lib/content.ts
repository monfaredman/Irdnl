import { movies, series } from "@/data/mockContent";
import type { Movie, Series, Genre } from "@/types/media";

export const getFeaturedMovies = () => movies.filter((movie) => movie.featured);
export const getFeaturedSeries = () => series.filter((entry) => entry.featured);

export const getMovieBySlug = (slug: string): Movie | undefined =>
  movies.find((movie) => movie.slug === slug);

export const getSeriesBySlug = (slug: string): Series | undefined =>
  series.find((entry) => entry.slug === slug);

interface SearchOptions {
  keyword?: string;
  genre?: Genre | "all";
  year?: number | "all";
}

const matchesSearch = (text: string, query: string) => text.toLowerCase().includes(query);

const matchesGenre = (genres: Genre[], genre?: Genre | "all") =>
  !genre || genre === "all" || genres.includes(genre);

const matchesYear = (year: number, filter?: number | "all") => !filter || filter === "all" || year === filter;

export const searchContent = ({ keyword = "", genre, year }: SearchOptions) => {
  const normalized = keyword.trim().toLowerCase();

  const searchPool = (collection: Array<Movie | Series>) =>
    collection.filter((item) => {
      const blob = [item.title, item.description, item.tags.join(" "), item.genres.join(" ")].join(" ");
      const keywordMatch = normalized ? matchesSearch(blob, normalized) : true;
      const genreMatch = matchesGenre(item.genres, genre);
      const yearMatch = matchesYear(item.year, year);
      return keywordMatch && genreMatch && yearMatch;
    });

  return {
    movies: searchPool(movies),
    series: searchPool(series),
  };
};
