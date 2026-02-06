"use client";

import { useTranslation } from "@/i18n";
import type { ContentFormData } from "../types";

interface ReviewStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">بررسی اطلاعات</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">عنوان</p>
            <p className="font-medium">{formData.title || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">نوع</p>
            <p className="font-medium">{formData.type === "movie" ? "فیلم" : "سریال"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">سال</p>
            <p className="font-medium">{formData.year || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">وضعیت</p>
            <p className="font-medium">
              {formData.status === "published" ? "منتشر شده" : "پیش‌نویس"}
            </p>
          </div>

          {formData.posterUrl && (
            <div>
              <p className="text-sm text-gray-600 mb-2">پوستر</p>
              <img src={formData.posterUrl} alt="Poster" className="h-48 w-32 object-cover rounded" />
            </div>
          )}

          {formData.genres && formData.genres.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">ژانرها</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.genres.map((genre, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              با کلیک بر روی دکمه "اتمام"، این محتوا ذخیره خواهد شد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
