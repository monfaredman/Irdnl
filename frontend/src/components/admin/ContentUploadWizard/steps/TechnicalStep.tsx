"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import type { ContentFormData } from "../types";

interface TechnicalStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function TechnicalStep({ formData, updateFormData }: TechnicalStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("admin.upload.technical.codec")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="codec">{t("admin.upload.technical.codec")}</Label>
            <Input
              id="codec"
              placeholder="H.264, H.265, VP9"
              value={formData.technicalSpecs?.codec || ""}
              onChange={(e) => updateFormData({
                technicalSpecs: { ...formData.technicalSpecs, codec: e.target.value },
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution">{t("admin.upload.technical.resolution")}</Label>
            <Input
              id="resolution"
              placeholder="1920x1080"
              value={formData.technicalSpecs?.resolution || ""}
              onChange={(e) => updateFormData({
                technicalSpecs: { ...formData.technicalSpecs, resolution: e.target.value },
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frameRate">{t("admin.upload.technical.frameRate")}</Label>
            <Input
              id="frameRate"
              placeholder="24, 30, 60"
              value={formData.technicalSpecs?.frameRate || ""}
              onChange={(e) => updateFormData({
                technicalSpecs: { ...formData.technicalSpecs, frameRate: e.target.value },
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aspectRatio">{t("admin.upload.technical.aspectRatio")}</Label>
            <Input
              id="aspectRatio"
              placeholder="16:9, 21:9"
              value={formData.technicalSpecs?.aspectRatio || ""}
              onChange={(e) => updateFormData({
                technicalSpecs: { ...formData.technicalSpecs, aspectRatio: e.target.value },
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
