import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieDetails } from "@/components/sections/MovieDetails";
import { getMovieBySlug } from "@/lib/content";

interface MoviePageProps {
	params: { slug: string };
}

export async function generateMetadata({
	params,
}: MoviePageProps): Promise<Metadata> {
	const { slug } = params;
	const movie = getMovieBySlug(slug);
	if (!movie) return { title: "Movie not found | irdnl" };
	return {
		title: `${movie.title} | irdnl`,
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
