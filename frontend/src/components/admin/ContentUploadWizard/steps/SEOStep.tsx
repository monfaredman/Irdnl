"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import type { ContentFormData } from "../types";

interface SEOStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function SEOStep({ formData, updateFormData }: SEOStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="metaTitle">{t("admin.upload.seo.metaTitle")}</Label>
        <Input
          id="metaTitle"
          value={formData.seo?.title || ""}
          onChange={(e) => updateFormData({
            seo: { ...formData.seo, title: e.target.value },
          })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">{t("admin.upload.seo.metaDescription")}</Label>
        <textarea
          id="metaDescription"
          value={formData.seo?.description || ""}
          onChange={(e) => updateFormData({
            seo: { ...formData.seo, description: e.target.value },
          })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">{t("admin.upload.seo.keywords")}</Label>
        <Input
          id="keywords"
          placeholder="کلمات کلیدی را با کاما جدا کنید"
          value={formData.seo?.keywords?.join(", ") || ""}
          onChange={(e) => updateFormData({
            seo: { ...formData.seo, keywords: e.target.value.split(",").map(k => k.trim()) },
          })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="featured">{t("admin.upload.seo.featured")}</Label>
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured || false}
            onChange={(e) => updateFormData({ featured: e.target.checked })}
            className="h-5 w-5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">{t("admin.upload.seo.priority")}</Label>
          <Input
            id="priority"
            type="number"
            value={formData.priority || 0}
            onChange={(e) => updateFormData({ priority: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
