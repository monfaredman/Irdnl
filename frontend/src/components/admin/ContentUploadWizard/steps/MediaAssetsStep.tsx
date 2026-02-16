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

      {/* External Player URL Section */}
      <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">
          روش ۱: آدرس پخش‌کننده خارجی
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          اگر ویدیو شما در سرویس دیگری میزبانی می‌شود (مثل YouTube، Vimeo، یا سرور اختصاصی)، 
          آدرس پخش‌کننده را اینجا وارد کنید. در این حالت نیازی به آپلود فایل ویدیو نیست.
        </p>
        <div className="space-y-2">
          <Label htmlFor="externalPlayerUrl">
            آدرس پخش‌کننده خارجی (External Player URL)
          </Label>
          <Input
            id="externalPlayerUrl"
            type="url"
            placeholder="https://player.example.com/video/12345 یا https://youtube.com/embed/..."
            value={formData.externalPlayerUrl || ""}
            onChange={(e) => updateFormData({ externalPlayerUrl: e.target.value })}
            className="font-mono text-sm"
          />
          {formData.externalPlayerUrl && (
            <p className="text-xs text-green-600">
              ✓ آدرس پخش‌کننده خارجی تنظیم شده است
            </p>
          )}
        </div>
      </div>

      {/* Internal Video Upload Section */}
      <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-purple-900">
          روش ۲: آپلود فایل ویدیو داخلی
        </h3>
        <p className="text-sm text-purple-800 mb-4">
          اگر می‌خواهید فایل ویدیو را مستقیماً در سرور آپلود کنید، ابتدا به بخش{" "}
          <a href="/admin/videos" className="underline font-semibold" target="_blank">
            مدیریت ویدیوها
          </a>{" "}
          بروید و فایل‌های ویدیو را برای این محتوا آپلود کنید. سپس آدرس‌های ویدیو را در قسمت 
          "کیفیت‌های ویدیو" زیر وارد کنید.
        </p>
        <div className="bg-white border border-purple-200 rounded p-3">
          <p className="text-xs text-purple-700 mb-2">
            💡 <strong>نکته:</strong> برای آپلود ویدیو، Content ID این محتوا را یادداشت کنید 
            (پس از ذخیره محتوا دریافت می‌شود) و در بخش مدیریت ویدیوها هنگام آپلود وارد کنید.
          </p>
          {!formData.externalPlayerUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open("/admin/videos", "_blank")}
              className="w-full mt-2"
            >
              🎬 رفتن به صفحه مدیریت ویدیوها
            </Button>
          )}
        </div>
      </div>

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

          {/* Backdrop */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>تصویر پس‌زمینه (Backdrop)</Label>
              <TMDBFieldButton
                tmdbId={tmdbId}
                mediaType={mediaType}
                fieldKey="backdropUrl"
                onFetch={(val) => updateFormData({ backdropUrl: val })}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "backdropUrl");
                }}
                className="hidden"
                id="backdrop-upload"
              />
              <label htmlFor="backdrop-upload" className="cursor-pointer flex flex-col items-center">
                {formData.backdropUrl ? (
                  <img src={formData.backdropUrl} alt="Backdrop" className="h-32 w-full object-cover rounded" />
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
        <h3 className="text-lg font-semibold mb-2">{t("admin.upload.mediaAssets.videoQualities")}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {formData.externalPlayerUrl 
            ? "⚠️ شما از پخش‌کننده خارجی استفاده می‌کنید. این بخش را خالی بگذارید."
            : "آدرس‌های ویدیوی آپلود شده را از بخش مدیریت ویدیوها اینجا وارد کنید (روش ۲)."}
        </p>
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
                disabled={!!formData.externalPlayerUrl}
                className={formData.externalPlayerUrl ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
