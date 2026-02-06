"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Button } from "@/components/admin/ui/button";
import { X, Plus } from "lucide-react";
import { TMDBFieldButton } from "../TMDBFieldButton";
import type { ContentFormData } from "../types";

interface MetadataStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function MetadataStep({ formData, updateFormData }: MetadataStepProps) {
  const { t } = useTranslation();
  const tmdbId = formData.tmdbId || "";
  const mediaType = formData.type === "series" ? "series" : "movie";

  const addGenre = () => {
    const genre = prompt(t("admin.upload.metadata.genres"));
    if (genre) {
      updateFormData({ genres: [...(formData.genres || []), genre] });
    }
  };

  const removeGenre = (index: number) => {
    const newGenres = [...(formData.genres || [])];
    newGenres.splice(index, 1);
    updateFormData({ genres: newGenres });
  };

  return (
    <div className="space-y-6">
      {/* TMDB ID indicator */}
      {tmdbId && (
        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-1.5 flex items-center gap-2">
          <span>🔗 TMDB ID: {tmdbId}</span>
          <span className="text-gray-400">|</span>
          <span>از دکمه‌های <span className="inline-block w-4 h-4 align-middle border border-blue-300 rounded text-center text-[10px] leading-4">↓</span> برای دریافت هر فیلد از TMDB استفاده کنید</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">امتیاز (0-10)</Label>
          <div className="flex gap-2">
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.rating || ""}
              onChange={(e) => updateFormData({ rating: parseFloat(e.target.value) || undefined })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="rating"
              onFetch={(val) => updateFormData({ rating: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageRating">{t("admin.upload.metadata.ageRating")}</Label>
          <select
            id="ageRating"
            value={formData.ageRating || ""}
            onChange={(e) => updateFormData({ ageRating: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">انتخاب کنید</option>
            <option value="G">G - عمومی</option>
            <option value="PG">PG - راهنمایی والدین</option>
            <option value="PG-13">PG-13 - 13+</option>
            <option value="R">R - محدود</option>
            <option value="NC-17">NC-17 - بزرگسال</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{t("admin.upload.metadata.genres")}</Label>
          <TMDBFieldButton
            tmdbId={tmdbId}
            mediaType={mediaType}
            fieldKey="genres"
            onFetch={(val) => {
              if (Array.isArray(val)) {
                updateFormData({ genres: val });
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.genres || []).map((genre, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {genre}
              <button onClick={() => removeGenre(index)} className="hover:text-blue-600">
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={addGenre}>
          <Plus className="h-4 w-4 ml-2" />
          افزودن ژانر
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="director">{t("admin.upload.metadata.director")}</Label>
          <div className="flex gap-2">
            <Input
              id="director"
              value={formData.director || ""}
              onChange={(e) => updateFormData({ director: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="director"
              onFetch={(val) => updateFormData({ director: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="writer">{t("admin.upload.metadata.writer")}</Label>
          <div className="flex gap-2">
            <Input
              id="writer"
              value={formData.writer || ""}
              onChange={(e) => updateFormData({ writer: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="writer"
              onFetch={(val) => updateFormData({ writer: val })}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="producer">{t("admin.upload.metadata.producer")}</Label>
          <div className="flex gap-2">
            <Input
              id="producer"
              value={formData.producer || ""}
              onChange={(e) => updateFormData({ producer: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="producer"
              onFetch={(val) => updateFormData({ producer: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productionCompany">{t("admin.upload.metadata.productionCompany")}</Label>
          <div className="flex gap-2">
            <Input
              id="productionCompany"
              value={formData.productionCompany || ""}
              onChange={(e) => updateFormData({ productionCompany: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="productionCompany"
              onFetch={(val) => updateFormData({ productionCompany: val })}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="country">{t("admin.upload.metadata.country")}</Label>
          <div className="flex gap-2">
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => updateFormData({ country: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="country"
              onFetch={(val) => updateFormData({ country: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imdbId">{t("admin.upload.metadata.imdbId")}</Label>
          <div className="flex gap-2">
            <Input
              id="imdbId"
              placeholder="tt1234567"
              value={formData.imdbId || ""}
              onChange={(e) => updateFormData({ imdbId: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="imdbId"
              onFetch={(val) => updateFormData({ imdbId: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tmdbId">{t("admin.upload.metadata.tmdbId")}</Label>
          <Input
            id="tmdbId"
            placeholder="12345"
            value={formData.tmdbId || ""}
            onChange={(e) => updateFormData({ tmdbId: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
