"use client";

import { useEffect, useMemo, useState } from "react";
import type { Episode, Series } from "@/types/media";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { WatchlistButton } from "@/components/interactive/WatchlistButton";
import { RatingBadge } from "@/components/interactive/RatingBadge";
import { RatingControl } from "@/components/interactive/RatingControl";
import { CommentsPanel } from "@/components/sections/CommentsPanel";
import { formatDate } from "@/lib/formatters";

interface SeriesDetailsProps {
  series: Series;
}

export const SeriesDetails = ({ series }: SeriesDetailsProps) => {
  const [activeSeasonId, setActiveSeasonId] = useState(series.seasons[0]?.id ?? "");
  const activeSeason = useMemo(
    () => series.seasons.find((season) => season.id === activeSeasonId) ?? series.seasons[0],
    [activeSeasonId, series.seasons],
  );
  const [activeEpisodeId, setActiveEpisodeId] = useState(activeSeason?.episodes[0]?.id);

  const activeEpisode: Episode | undefined = useMemo(
    () => activeSeason?.episodes.find((episode) => episode.id === activeEpisodeId) ?? activeSeason?.episodes[0],
    [activeEpisodeId, activeSeason],
  );

  useEffect(() => {
    if (!activeSeason) return;
    setActiveEpisodeId(activeSeason.episodes[0]?.id);
  }, [activeSeasonId, activeSeason]);

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {activeEpisode && (
            <VideoPlayer
              mediaId={series.id}
              episodeId={activeEpisode.id}
              poster={series.backdrop}
              sources={activeEpisode.sources}
              subtitles={activeEpisode.subtitles}
              duration={activeEpisode.duration * 60}
            />
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/60">
            <RatingBadge rating={series.rating} />
            <span>{series.year}</span>
            <span>{series.genres.join(" · ")}</span>
            <span>{series.ongoing ? "Ongoing" : "Completed"}</span>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">{series.title}</h2>
          <p className="mt-4 text-sm text-white/70">{series.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <WatchlistButton
              mediaId={series.id}
              payload={{
                id: series.id,
                slug: series.slug,
                poster: series.poster,
                title: series.title,
                type: "series",
              }}
            />
            <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white/60">
              {series.seasons.length} seasons
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
        <div className="flex flex-wrap gap-3">
          {series.seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setActiveSeasonId(season.id)}
              className={`rounded-full px-4 py-2 text-sm ${season.id === activeSeason?.id ? "bg-emerald-400 text-black" : "bg-black/40 text-white/70"}`}
            >
              {season.title}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {activeSeason?.episodes.map((episode) => {
            const isActive = episode.id === activeEpisode?.id;
            return (
              <button
                key={episode.id}
                onClick={() => setActiveEpisodeId(episode.id)}
                className={`flex w-full flex-col rounded-2xl border px-4 py-3 text-left ${isActive ? "border-emerald-400 bg-emerald-500/10" : "border-white/10 bg-black/20"}`}
              >
                <div className="flex items-center justify-between text-sm text-white">
                  <span>{episode.title}</span>
                  <span>{episode.duration} min</span>
                </div>
                <p className="mt-1 text-xs text-white/70 line-clamp-2">{episode.synopsis}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                  <span>{formatDate(episode.releaseDate)}</span>
                  <span>{episode.sources.map((source) => source.quality).join(" / ")}</span>
                </div>
              </button>
            );
          })}
        </div>
        <RatingControl mediaId={series.id} />
        <CommentsPanel mediaId={series.id} />
      </div>
    </section>
  );
};
