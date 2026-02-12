"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { TMDBFieldButton } from "../TMDBFieldButton";
import type { ContentFormData } from "../types";
import { useState, useEffect } from "react";
import { collectionsApi } from "@/lib/api/admin";
import {
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

interface BasicInfoStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  const { t } = useTranslation();
  const tmdbId = formData.tmdbId || "";
  const mediaType = formData.type === "series" ? "series" : "movie";
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    collectionsApi.list({ page: 1, limit: 100 }).then((res) => {
      setCollections(res.collections || []);
    }).catch(console.error);
  }, []);

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
          <Label htmlFor="title">
            {t("admin.upload.basicInfo.title")} *
          </Label>
          <div className="flex gap-2">
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="title"
              onFetch={(val) => updateFormData({ title: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="originalTitle">
            {t("admin.upload.basicInfo.originalTitle")}
          </Label>
          <div className="flex gap-2">
            <Input
              id="originalTitle"
              value={formData.originalTitle || ""}
              onChange={(e) => updateFormData({ originalTitle: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="originalTitle"
              onFetch={(val) => updateFormData({ originalTitle: val })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">
          {t("admin.upload.basicInfo.tagline")}
        </Label>
        <div className="flex gap-2">
          <Input
            id="tagline"
            value={formData.tagline || ""}
            onChange={(e) => updateFormData({ tagline: e.target.value })}
            className="flex-1"
          />
          <TMDBFieldButton
            tmdbId={tmdbId}
            mediaType={mediaType}
            fieldKey="tagline"
            onFetch={(val) => updateFormData({ tagline: val })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="type">
            {t("admin.upload.basicInfo.type")} *
          </Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => updateFormData({ type: e.target.value as "movie" | "series" })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="movie">{t("admin.content.movie")}</option>
            <option value="series">{t("admin.content.series")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">
            {t("admin.upload.basicInfo.year")}
          </Label>
          <div className="flex gap-2">
            <Input
              id="year"
              type="number"
              value={formData.year || ""}
              onChange={(e) => updateFormData({ year: parseInt(e.target.value) || undefined })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="year"
              onFetch={(val) => updateFormData({ year: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">
            {t("admin.upload.basicInfo.duration")} (ثانیه)
          </Label>
          <div className="flex gap-2">
            <Input
              id="duration"
              type="number"
              value={formData.duration || ""}
              onChange={(e) => updateFormData({ duration: parseInt(e.target.value) || undefined })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="duration"
              onFetch={(val) => updateFormData({ duration: val })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t("admin.upload.basicInfo.description")}
        </Label>
        <div className="flex gap-2">
          <textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => updateFormData({ description: e.target.value })}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
          <TMDBFieldButton
            tmdbId={tmdbId}
            mediaType={mediaType}
            fieldKey="description"
            onFetch={(val) => updateFormData({ description: val })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">
          {t("admin.upload.basicInfo.shortDescription")}
        </Label>
        <textarea
          id="shortDescription"
          value={formData.shortDescription || ""}
          onChange={(e) => updateFormData({ shortDescription: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          rows={2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="externalPlayerUrl">
            {t("admin.upload.basicInfo.externalPlayerUrl")}
          </Label>
          <Input
            id="externalPlayerUrl"
            type="url"
            placeholder="https://player.example.com/watch/..."
            value={formData.externalPlayerUrl || ""}
            onChange={(e) => updateFormData({ externalPlayerUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            {t("admin.upload.basicInfo.status")}
          </Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => updateFormData({ status: e.target.value as any })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="draft">{t("admin.content.status.draft")}</option>
            <option value="scheduled">{t("admin.content.status.scheduled")}</option>
            <option value="published">{t("admin.content.status.published")}</option>
            <option value="unpublished">{t("admin.content.status.unpublished")}</option>
          </select>
        </div>
      </div>

      {/* Scheduling Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-sm text-gray-700">
          {t("admin.upload.basicInfo.scheduling")}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="publishDate">
              {t("admin.upload.basicInfo.publishDate")}
            </Label>
            <Input
              id="publishDate"
              type="datetime-local"
              value={formData.publishDate ? new Date(formData.publishDate).toISOString().slice(0, 16) : ""}
              onChange={(e) => updateFormData({ publishDate: e.target.value ? new Date(e.target.value) : null })}
            />
            <p className="text-xs text-gray-500">
              {formData.status === 'scheduled' ? 'محتوا در این تاریخ منتشر می‌شود' : 'تاریخ انتشار (اختیاری)'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityStart">
              {t("admin.upload.basicInfo.availabilityStart")}
            </Label>
            <Input
              id="availabilityStart"
              type="datetime-local"
              value={formData.availabilityStart ? new Date(formData.availabilityStart).toISOString().slice(0, 16) : ""}
              onChange={(e) => updateFormData({ availabilityStart: e.target.value ? new Date(e.target.value) : null })}
            />
            <p className="text-xs text-gray-500">
              شروع دسترسی (اختیاری)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityEnd">
              {t("admin.upload.basicInfo.availabilityEnd")}
            </Label>
            <Input
              id="availabilityEnd"
              type="datetime-local"
              value={formData.availabilityEnd ? new Date(formData.availabilityEnd).toISOString().slice(0, 16) : ""}
              onChange={(e) => updateFormData({ availabilityEnd: e.target.value ? new Date(e.target.value) : null })}
            />
            <p className="text-xs text-gray-500">
              پایان دسترسی (اختیاری)
            </p>
          </div>
        </div>

        {formData.status === 'scheduled' && !formData.publishDate && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            ⚠️ برای محتوای زمان‌بندی شده، تنظیم تاریخ انتشار الزامی است
          </div>
        )}
      </div>

      {/* Content Flags & Collection */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-sm text-gray-700">دسته‌بندی و ویژگی‌ها</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isKids || false}
                  onChange={(e) => updateFormData({ isKids: e.target.checked })}
                />
              }
              label="محتوای کودکان"
            />
          </div>

          <div className="flex items-center">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isComingSoon || false}
                  onChange={(e) => updateFormData({ isComingSoon: e.target.checked })}
                />
              }
              label="به زودی"
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth size="small">
              <InputLabel>کالکشن</InputLabel>
              <Select
                value={formData.collectionId || ""}
                onChange={(e) => updateFormData({ collectionId: e.target.value || undefined })}
                label="کالکشن"
              >
                <MenuItem value="">
                  <em>بدون کالکشن</em>
                </MenuItem>
                {collections.map((collection) => (
                  <MenuItem key={collection.id} value={collection.id}>
                    {collection.titleFa || collection.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
}
