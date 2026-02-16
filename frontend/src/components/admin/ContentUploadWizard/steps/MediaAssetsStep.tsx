"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Button } from "@/components/admin/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { imagesApi, videosApi } from "@/lib/api/admin";
import { TMDBFieldButton } from "../TMDBFieldButton";
import type { ContentFormData } from "../types";
import { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, LinearProgress, Typography } from "@mui/material";

interface MediaAssetsStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function MediaAssetsStep({ formData, updateFormData }: MediaAssetsStepProps) {
  const { t } = useTranslation();
  const tmdbId = formData.tmdbId || "";
  const mediaType = formData.type === "series" ? "series" : "movie";
  const [videoUploadState, setVideoUploadState] = useState<{
    file: File | null;
    quality: string;
    uploading: boolean;
    needsSave: boolean;
  }>({ file: null, quality: "1080p", uploading: false, needsSave: false });

  const handleImageUpload = async (file: File, type: keyof Pick<ContentFormData, "posterUrl" | "bannerUrl" | "thumbnailUrl" | "backdropUrl" | "logoUrl">) => {
    try {
      const response = await imagesApi.upload(file, type.replace("Url", "") as any);
      updateFormData({ [type]: response.url });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert(t("admin.messages.uploadError"));
    }
  };

  const handleVideoFileSelect = (file: File | null) => {
    if (file) {
      setVideoUploadState(prev => ({ ...prev, file, needsSave: true }));
    }
  };

  const handleVideoUpload = async () => {
    if (!videoUploadState.file) {
      alert("لطفاً فایل ویدیو را انتخاب کنید");
      return;
    }
    
    // Check if content has ID (must be saved first)
    if (!formData.id) {
      alert("ابتدا باید محتوا را ذخیره کنید تا Content ID ایجاد شود. روی 'ذخیره پیش‌نویس' کلیک کنید.");
      return;
    }

    setVideoUploadState(prev => ({ ...prev, uploading: true }));
    try {
      await videosApi.upload(videoUploadState.file, formData.id, videoUploadState.quality);
      alert(`ویدیو با موفقیت آپلود شد. کیفیت: ${videoUploadState.quality}`);
      setVideoUploadState({ file: null, quality: "1080p", uploading: false, needsSave: false });
    } catch (error) {
      console.error("Failed to upload video:", error);
      alert("خطا در آپلود ویدیو");
    } finally {
      setVideoUploadState(prev => ({ ...prev, uploading: false }));
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
          می‌توانید فایل ویدیو را مستقیماً در همین صفحه آپلود کنید. 
          <strong className="text-red-600"> ابتدا باید روی "ذخیره پیش‌نویس" کلیک کنید</strong> تا Content ID ایجاد شود.
        </p>
        <div className="bg-white border border-purple-200 rounded p-4 space-y-3">
          {formData.id ? (
            <>
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                ✓ Content ID: <span className="font-mono font-semibold">{formData.id}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="video-upload" className="text-sm mb-1 block">انتخاب فایل ویدیو</Label>
                  <input
                    type="file"
                    accept="video/*"
                    id="video-upload-file"
                    onChange={(e) => handleVideoFileSelect(e.target.files?.[0] || null)}
                    disabled={videoUploadState.uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {videoUploadState.file && (
                    <p className="text-xs text-gray-600 mt-1">
                      {videoUploadState.file.name} ({(videoUploadState.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <FormControl fullWidth size="small">
                  <InputLabel>کیفیت ویدیو</InputLabel>
                  <Select
                    value={videoUploadState.quality}
                    label="کیفیت ویدیو"
                    onChange={(e) => setVideoUploadState(prev => ({ ...prev, quality: e.target.value }))}
                    disabled={videoUploadState.uploading}
                  >
                    <MenuItem value="360p">360p</MenuItem>
                    <MenuItem value="480p">480p</MenuItem>
                    <MenuItem value="720p">720p</MenuItem>
                    <MenuItem value="1080p">1080p (Full HD)</MenuItem>
                    <MenuItem value="1440p">1440p (2K)</MenuItem>
                    <MenuItem value="2160p">2160p (4K)</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <Button
                type="button"
                onClick={handleVideoUpload}
                disabled={!videoUploadState.file || videoUploadState.uploading}
                className="w-full"
              >
                {videoUploadState.uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    در حال آپلود...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    آپلود ویدیو
                  </>
                )}
              </Button>

              {videoUploadState.uploading && (
                <div className="space-y-1">
                  <LinearProgress />
                  <Typography variant="caption" className="text-gray-500">
                    لطفاً صبر کنید، ویدیو در حال آپلود است...
                  </Typography>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-purple-700 mb-3">
                💡 برای آپلود ویدیو، ابتدا باید محتوا را ذخیره کنید تا Content ID ایجاد شود.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("/admin/videos", "_blank")}
              >
                🎬 یا رفتن به صفحه مدیریت ویدیوها
              </Button>
            </div>
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
