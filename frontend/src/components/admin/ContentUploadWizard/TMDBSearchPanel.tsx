"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { Search, Download, Film, Tv, Loader2 } from "lucide-react";
import { tmdbApi, type TMDBSearchResult, type TMDBContentDetails } from "@/lib/api/admin";
import type { ContentFormData } from "./types";

interface TMDBSearchPanelProps {
  onAutoFill: (data: Partial<ContentFormData>) => void;
}

export function TMDBSearchPanel({ onAutoFill }: TMDBSearchPanelProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await tmdbApi.search(query.trim());
      setResults(response.items || []);
    } catch (err) {
      setError("خطا در جستجوی TMDB");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleImport = useCallback(
    async (item: TMDBSearchResult) => {
      setImporting(item.tmdbId);
      setError(null);
      try {
        let details: TMDBContentDetails;
        if (item.mediaType === "movie") {
          details = await tmdbApi.getMovieDetails(item.tmdbId);
        } else {
          details = await tmdbApi.getTVDetails(item.tmdbId);
        }

        // Map TMDB details to ContentFormData
        const formData: Partial<ContentFormData> = {
          title: details.title || "",
          originalTitle: details.originalTitle || "",
          tagline: details.tagline || "",
          type: details.type === "series" ? "series" : "movie",
          year: details.year || undefined,
          description: details.description || "",
          duration: details.duration || undefined,
          posterUrl: details.posterUrl || "",
          bannerUrl: details.bannerUrl || "",
          backdropUrl: details.backdropUrl || "",
          rating: details.rating || undefined,
          genres: details.genres || [],
          originalLanguage: details.originalLanguage || "",
          languages: details.languages || [],
          cast: details.cast || [],
          crew: details.crew || [],
          director: details.director || "",
          writer: details.writer || "",
          producer: details.producer || "",
          productionCompany: details.productionCompany || "",
          country: details.country || "",
          tmdbId: details.tmdbId || "",
          imdbId: details.imdbId || "",
        };

        onAutoFill(formData);

        // Clear search after successful import
        setQuery("");
        setResults([]);
        setSearched(false);
      } catch (err) {
        setError("خطا در دریافت اطلاعات از TMDB");
      } finally {
        setImporting(null);
      }
    },
    [onAutoFill],
  );

  return (
    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">
          جستجو و وارد کردن از TMDB
        </h3>
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
          اختیاری
        </span>
      </div>
      <p className="text-sm text-blue-700 mb-3">
        نام فیلم یا سریال را جستجو کنید تا اطلاعات به‌صورت خودکار پر شود
      </p>

      {/* Search Input */}
      <div className="flex gap-2 mb-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="نام فیلم یا سریال را وارد کنید..."
          className="flex-1 bg-white"
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="mr-1">جستجو</span>
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {results.map((item) => (
            <div
              key={`${item.mediaType}-${item.tmdbId}`}
              className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              {/* Poster */}
              {item.posterUrl ? (
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-10 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center">
                  {item.mediaType === "movie" ? (
                    <Film className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Tv className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {item.title}
                  </span>
                  {item.originalTitle && item.originalTitle !== item.title && (
                    <span className="text-xs text-gray-500 truncate">
                      ({item.originalTitle})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    item.mediaType === "movie"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {item.mediaType === "movie" ? "فیلم" : "سریال"}
                  </span>
                  {item.year && <span>{item.year}</span>}
                  {item.rating > 0 && <span>⭐ {item.rating}</span>}
                </div>
              </div>

              {/* Import Button */}
              <Button
                type="button"
                size="sm"
                onClick={() => handleImport(item)}
                disabled={importing === item.tmdbId}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {importing === item.tmdbId ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                <span className="mr-1">وارد کردن</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {searched && !loading && results.length === 0 && !error && (
        <div className="text-sm text-gray-500 text-center py-3">
          نتیجه‌ای یافت نشد
        </div>
      )}
    </div>
  );
}
