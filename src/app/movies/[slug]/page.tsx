import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieBySlug } from "@/lib/content";
import { MovieDetails } from "@/components/sections/MovieDetails";

interface MoviePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = params;
  const movie = getMovieBySlug(slug);
  if (!movie) return { title: "Movie not found | PersiaPlay" };
  return {
    title: `${movie.title} | PersiaPlay`,
    description: movie.description,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = params;
  const movie = getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  return <MovieDetails movie={movie} />;
}
