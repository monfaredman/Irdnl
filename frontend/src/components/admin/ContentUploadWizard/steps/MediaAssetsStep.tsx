"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Button } from "@/components/admin/ui/button";
import { Upload } from "lucide-react";
import { imagesApi } from "@/lib/api/admin";
import { TMDBFieldButton } from "../TMDBFieldButton";
import type { ContentFormData } from "../types";

interface MediaAssetsStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function MediaAssetsStep({ formData, updateFormData }: MediaAssetsStepProps) {
  const { t } = useTranslation();
  const tmdbId = formData.tmdbId || "";
  const mediaType = formData.type === "series" ? "series" : "movie";

  const handleImageUpload = async (file: File, type: keyof Pick<ContentFormData, "posterUrl" | "bannerUrl" | "thumbnailUrl" | "backdropUrl" | "logoUrl">) => {
    try {
      const response = await imagesApi.upload(file, type.replace("Url", "") as any);
      updateFormData({ [type]: response.url });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert(t("admin.messages.uploadError"));
    }
  };

  return (
    <div className="space-y-6">
      {/* TMDB ID indicator for image fetch */}
      {tmdbId && (
        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-1.5 flex items-center gap-2">
          <span>🔗 TMDB ID: {tmdbId}</span>
          <span className="text-gray-400">|</span>
          <span>از دکمه‌های TMDB برای دریافت لینک تصاویر از TMDB استفاده کنید</span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">{t("admin.upload.mediaAssets.visualAssets")}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Poster */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>{t("admin.upload.visualAssets.poster")}</Label>
              <TMDBFieldButton
                tmdbId={tmdbId}
                mediaType={mediaType}
                fieldKey="posterUrl"
                onFetch={(val) => updateFormData({ posterUrl: val })}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "posterUrl");
                }}
                className="hidden"
                id="poster-upload"
              />
              <label htmlFor="poster-upload" className="cursor-pointer flex flex-col items-center">
                {formData.posterUrl ? (
                  <img src={formData.posterUrl} alt="Poster" className="h-48 w-32 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">{t("admin.form.upload")}</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>{t("admin.upload.visualAssets.banner")}</Label>
              <TMDBFieldButton
                tmdbId={tmdbId}
                mediaType={mediaType}
                fieldKey="bannerUrl"
                onFetch={(val) => updateFormData({ bannerUrl: val })}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "bannerUrl");
                }}
                className="hidden"
                id="banner-upload"
              />
              <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center">
                {formData.bannerUrl ? (
                  <img src={formData.bannerUrl} alt="Banner" className="h-32 w-full object-cover rounded" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">{t("admin.form.upload")}</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>{t("admin.upload.visualAssets.thumbnail")}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "thumbnailUrl");
                }}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center">
                {formData.thumbnailUrl ? (
                  <img src={formData.thumbnailUrl} alt="Thumbnail" className="h-24 w-40 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">{t("admin.form.upload")}</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>{t("admin.upload.visualAssets.logo")}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "logoUrl");
                }}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="h-24 w-24 object-contain rounded" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">{t("admin.form.upload")}</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">{t("admin.upload.mediaAssets.videoQualities")}</h3>
        <div className="space-y-4">
          {["sd", "hd", "fullHd", "uhd4k"].map((quality) => (
            <div key={quality} className="flex items-center gap-4">
              <Label className="w-32">{t(`admin.upload.mediaAssets.quality.${quality}`)}</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.videoQualities?.[quality as keyof typeof formData.videoQualities]?.url || ""}
                onChange={(e) => updateFormData({
                  videoQualities: {
                    ...formData.videoQualities,
                    [quality]: { url: e.target.value },
                  },
                })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
