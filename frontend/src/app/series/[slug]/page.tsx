import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesDetails } from "@/components/sections/SeriesDetails";
import { getSeriesBySlug } from "@/lib/content";

interface SeriesPageProps {
	params: { slug: string };
}

export async function generateMetadata({
	params,
}: SeriesPageProps): Promise<Metadata> {
	const { slug } = params;
	const series = getSeriesBySlug(slug);
	if (!series) return { title: "Series not found | irdnl" };
	return {
		title: `${series.title} | irdnl`,
		description: series.description,
	};
}

export default async function SeriesPage({ params }: SeriesPageProps) {
	const { slug } = params;
	const series = getSeriesBySlug(slug);

	if (!series) {
		notFound();
	}

	return <SeriesDetails series={series} />;
}
