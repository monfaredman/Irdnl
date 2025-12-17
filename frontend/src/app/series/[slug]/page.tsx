import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeriesBySlug } from "@/lib/content";
import { SeriesDetails } from "@/components/sections/SeriesDetails";

interface SeriesPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
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
