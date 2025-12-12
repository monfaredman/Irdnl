import { Movie } from "@/types/media";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { WatchlistButton } from "@/components/interactive/WatchlistButton";
import { RatingBadge } from "@/components/interactive/RatingBadge";
import { formatMinutes } from "@/lib/formatters";
import { RatingControl } from "@/components/interactive/RatingControl";
import { CommentsPanel } from "@/components/sections/CommentsPanel";

interface MovieDetailsProps {
  movie: Movie;
}

export const MovieDetails = ({ movie }: MovieDetailsProps) => (
  <section className="space-y-8">
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <VideoPlayer
          mediaId={movie.id}
          poster={movie.backdrop}
          sources={movie.sources}
          subtitles={movie.subtitles}
          duration={movie.duration * 60}
        />
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/60">
          <RatingBadge rating={movie.rating} />
          <span>{movie.year}</span>
          <span>{movie.genres.join(" · ")}</span>
          <span>{formatMinutes(movie.duration)}</span>
          <span>{movie.languages.map((lng) => lng.toUpperCase()).join(" / ")}</span>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">{movie.title}</h2>
        <p className="mt-4 text-sm text-white/70">{movie.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <WatchlistButton
            mediaId={movie.id}
            payload={{
              id: movie.id,
              slug: movie.slug,
              title: movie.title,
              poster: movie.poster,
              type: "movie",
            }}
          />
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80">
            Share
          </button>
        </div>
        <div className="mt-8 space-y-3 text-sm">
          <div>
            <h3 className="font-semibold uppercase tracking-wide text-white/50">Downloads</h3>
            <div className="mt-3 space-y-2">
              {movie.downloads.map((download) => (
                <a
                  key={download.quality}
                  href={download.url}
                  className="flex items-center justify-between rounded-2xl bg-black/30 p-3 text-white/80"
                >
                  <span>{download.quality}</span>
                  <span>{download.size}</span>
                  {download.premium && <span className="text-emerald-300">Premium</span>}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold uppercase tracking-wide text-white/50">Subtitles</h3>
            <ul className="mt-2 space-y-2 text-white/70">
              {movie.subtitles.map((subtitle) => (
                <li key={subtitle.id} className="flex items-center justify-between rounded-2xl bg-black/30 px-3 py-2">
                  <span>{subtitle.label}</span>
                  <span>{subtitle.language.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Cast & Crew</h3>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/70">
        {movie.cast.map((person) => (
          <span key={person.id} className="rounded-full border border-white/10 px-4 py-2">
            {person.name} · {person.role}
          </span>
        ))}
      </div>
      <RatingControl mediaId={movie.id} />
      <CommentsPanel mediaId={movie.id} />
    </div>
  </section>
);
