"use client";

import { useState, useCallback } from "react";
import { Download, Loader2 } from "lucide-react";
import { tmdbApi } from "@/lib/api/admin";

interface TMDBFieldButtonProps {
  /** The TMDB ID to fetch data from. If empty, the button is disabled. */
  tmdbId: string;
  /** Whether this is a movie or series */
  mediaType: "movie" | "series";
  /** The field key to extract from the TMDB response */
  fieldKey: string;
  /** Callback with the fetched value */
  onFetch: (value: any) => void;
  /** Optional tooltip text */
  tooltip?: string;
}

/**
 * Small icon button that fetches a single field from TMDB and fills the input.
 * Sits beside each input in the admin content wizard.
 */
export function TMDBFieldButton({
  tmdbId,
  mediaType,
  fieldKey,
  onFetch,
  tooltip = "دریافت از TMDB",
}: TMDBFieldButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleFetch = useCallback(async () => {
    if (!tmdbId) return;
    setLoading(true);
    try {
      const details =
        mediaType === "series"
          ? await tmdbApi.getTVDetails(tmdbId)
          : await tmdbApi.getMovieDetails(tmdbId);

      const value = (details as any)[fieldKey];
      if (value !== undefined && value !== null) {
        onFetch(value);
      }
    } catch (err) {
      console.error("TMDB field fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [tmdbId, mediaType, fieldKey, onFetch]);

  return (
    <button
      type="button"
      onClick={handleFetch}
      disabled={!tmdbId || loading}
      title={tooltip}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-colors ${
        tmdbId
          ? "border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
          : "border-gray-200 text-gray-300 cursor-not-allowed"
      }`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
