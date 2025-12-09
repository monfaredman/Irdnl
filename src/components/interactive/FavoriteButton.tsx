"use client";

import { Heart } from "lucide-react";
import { useContentStore } from "@/hooks/useContentStore";

interface FavoriteButtonProps {
  mediaId: string;
}

export const FavoriteButton = ({ mediaId }: FavoriteButtonProps) => {
  const favorites = useContentStore((state) => state.favorites);
  const toggleFavorite = useContentStore((state) => state.toggleFavorite);
  const isFavorite = favorites.includes(mediaId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(mediaId)}
      className={`rounded-full border px-3 py-1 text-xs ${isFavorite ? "border-rose-400 text-rose-200" : "border-white/40 text-white"}`}
      aria-pressed={isFavorite}
    >
      <Heart size={14} fill={isFavorite ? "currentColor" : "none"} className="inline" />
      <span className="ml-1">Favorite</span>
    </button>
  );
};
