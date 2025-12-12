"use client";

import { useEffect, useMemo, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type { StreamSource, SubtitleTrack } from "@/types/media";
import { useContentStore } from "@/hooks/useContentStore";

interface VideoPlayerProps {
  mediaId: string;
  poster: string;
  sources: StreamSource[];
  subtitles: SubtitleTrack[];
  episodeId?: string;
  duration?: number;
}

export const VideoPlayer = ({ mediaId, poster, sources, subtitles, episodeId, duration = 0 }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const updateProgress = useContentStore((state) => state.updateProgress);
  const preferredQuality = useContentStore((state) => state.playbackQuality);

  const orderedSources = useMemo(() => {
    const preferred = sources.find((source) => source.quality === preferredQuality);
    if (preferred) {
      return [preferred, ...sources.filter((source) => source !== preferred)];
    }
    return sources;
  }, [sources, preferredQuality]);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      preload: "auto",
      fluid: true,
      poster,
      playbackRates: [0.75, 1, 1.25, 1.5],
      sources: orderedSources.map((source) => ({
        src: source.url,
        type: source.format === "HLS" ? "application/x-mpegURL" : "application/dash+xml",
      })),
    });

    subtitles.forEach((track) => {
      player.addRemoteTextTrack(
        {
          src: track.url,
          label: track.label,
          kind: "subtitles",
          srclang: track.language,
          default: track.language === "fa",
        },
        false,
      );
    });

    const progressHandler = () => {
      const currentTime = player.currentTime() ?? 0;
      const total = (duration ?? player.duration()) ?? 0;
      if (!total) return;
      updateProgress({ 
        mediaId, 
        episodeId, 
        progress: currentTime, 
        duration: total,
        updatedAt: Date.now()
      });
    };

    player.on("timeupdate", progressHandler);

    return () => {
      player.off("timeupdate", progressHandler);
      player.dispose();
    };
  }, [duration, episodeId, mediaId, orderedSources, subtitles, updateProgress, poster]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-theme-city" playsInline />
    </div>
  );
};
