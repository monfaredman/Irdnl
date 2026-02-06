"use client";

import { useTranslation } from "@/i18n";
import { Label } from "@/components/admin/ui/label";
import type { ContentFormData } from "../types";

interface LocalizationStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function LocalizationStep({ formData, updateFormData }: LocalizationStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center py-12 text-gray-500">
        <p>{t("admin.upload.localization.language")}</p>
        <p className="text-sm mt-2">این بخش در آینده توسعه خواهد یافت</p>
      </div>
    </div>
  );
}
