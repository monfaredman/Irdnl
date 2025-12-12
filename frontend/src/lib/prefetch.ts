import { useEffect } from "react";
import { Episode } from "@/types/media";

const cache = new Map<string, Episode>();

export const usePrefetchNextEpisodes = (episodes: Episode[], currentId?: string) => {
  useEffect(() => {
    if (!currentId) return;
    const currentIndex = episodes.findIndex((episode) => episode.id === currentId);
    if (currentIndex === -1) return;
    const nextEpisode = episodes[currentIndex + 1];
    if (nextEpisode && !cache.has(nextEpisode.id)) {
      cache.set(nextEpisode.id, nextEpisode);
    }
  }, [episodes, currentId]);
};
