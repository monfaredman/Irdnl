"use client";

import { useTranslation } from "@/i18n";
import { Label } from "@/components/admin/ui/label";
import { Input } from "@/components/admin/ui/input";
import {
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Select as MuiSelect,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
} from "@mui/material";
import { Plus, Trash2, Upload } from "lucide-react";
import type { ContentFormData } from "../types";

interface LocalizationStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

export function LocalizationStep({ formData, updateFormData }: LocalizationStepProps) {
  const { t } = useTranslation();

  // Handle isDubbed toggle
  const handleDubbedChange = (checked: boolean) => {
    updateFormData({ isDubbed: checked });
  };

  // Handle subtitle addition
  const handleAddSubtitle = () => {
    const newSubtitle = {
      language: "fa",
      url: "",
      format: "srt",
      label: "",
    };
    updateFormData({
      subtitles: [...(formData.subtitles || []), newSubtitle],
    });
  };

  // Handle subtitle removal
  const handleRemoveSubtitle = (index: number) => {
    const updatedSubtitles = [...(formData.subtitles || [])];
    updatedSubtitles.splice(index, 1);
    updateFormData({ subtitles: updatedSubtitles });
  };

  // Handle subtitle field update
  const handleSubtitleChange = (index: number, field: string, value: string) => {
    const updatedSubtitles = [...(formData.subtitles || [])];
    updatedSubtitles[index] = { ...updatedSubtitles[index], [field]: value };
    updateFormData({ subtitles: updatedSubtitles });
  };

  // Handle localized content update
  const handleLocalizedContentChange = (locale: string, field: string, value: string) => {
    const localizedContent = formData.localizedContent || {};
    updateFormData({
      localizedContent: {
        ...localizedContent,
        [locale]: {
          ...(localizedContent[locale] || {}),
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Dubbed Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label className="text-base font-medium">محتوای دوبله شده</Label>
          <p className="text-sm text-gray-500 mt-1">
            آیا این محتوا به فارسی دوبله شده است؟
          </p>
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={formData.isDubbed || false}
              onChange={(e) => handleDubbedChange(e.target.checked)}
            />
          }
          label=""
        />
      </div>

      {/* Subtitle Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">زیرنویس‌ها</Label>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus className="h-4 w-4" />}
            onClick={handleAddSubtitle}
          >
            افزودن زیرنویس
          </Button>
        </div>

        {formData.subtitles && formData.subtitles.length > 0 ? (
          <div className="space-y-3">
            {formData.subtitles.map((subtitle, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 p-4 border rounded-lg">
                <div className="col-span-3">
                  <FormControl fullWidth size="small">
                    <InputLabel>زبان</InputLabel>
                    <MuiSelect
                      value={subtitle.language}
                      onChange={(e) => handleSubtitleChange(index, "language", e.target.value)}
                      label="زبان"
                    >
                      <MenuItem value="fa">فارسی</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="ar">العربية</MenuItem>
                      <MenuItem value="tr">Türkçe</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="de">Deutsch</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="col-span-2">
                  <FormControl fullWidth size="small">
                    <InputLabel>فرمت</InputLabel>
                    <MuiSelect
                      value={subtitle.format || "srt"}
                      onChange={(e) => handleSubtitleChange(index, "format", e.target.value)}
                      label="فرمت"
                    >
                      <MenuItem value="srt">SRT</MenuItem>
                      <MenuItem value="vtt">VTT</MenuItem>
                      <MenuItem value="ass">ASS</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="col-span-3">
                  <Input
                    value={subtitle.label || ""}
                    onChange={(e) => handleSubtitleChange(index, "label", e.target.value)}
                    placeholder="برچسب"
                    size="small"
                  />
                </div>

                <div className="col-span-3">
                  <Input
                    value={subtitle.url}
                    onChange={(e) => handleSubtitleChange(index, "url", e.target.value)}
                    placeholder="آدرس فایل"
                    size="small"
                  />
                </div>

                <div className="col-span-1 flex items-center justify-center">
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSubtitle(index)}
                    color="error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
            <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>هنوز زیرنویسی اضافه نشده است</p>
            <p className="text-sm mt-1">برای افزودن زیرنویس، دکمه بالا را بزنید</p>
          </div>
        )}
      </div>

      {/* Localized Content */}
      <div className="space-y-4">
        <Label className="text-base font-medium">محتوای محلی‌سازی شده</Label>
        <p className="text-sm text-gray-500">
          عنوان و توضیحات به زبان‌های مختلف
        </p>

        {/* Persian (Farsi) */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-sm text-gray-700">فارسی (Persian)</h4>
          <div>
            <Label className="text-xs">عنوان</Label>
            <Input
              value={formData.localizedContent?.fa?.title || ""}
              onChange={(e) =>
                handleLocalizedContentChange("fa", "title", e.target.value)
              }
              placeholder="عنوان فارسی"
            />
          </div>
          <div>
            <Label className="text-xs">توضیحات</Label>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.localizedContent?.fa?.description || ""}
              onChange={(e) =>
                handleLocalizedContentChange("fa", "description", e.target.value)
              }
              placeholder="توضیحات فارسی"
              size="small"
            />
          </div>
        </div>

        {/* English */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-sm text-gray-700">English</h4>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={formData.localizedContent?.en?.title || ""}
              onChange={(e) =>
                handleLocalizedContentChange("en", "title", e.target.value)
              }
              placeholder="English title"
            />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.localizedContent?.en?.description || ""}
              onChange={(e) =>
                handleLocalizedContentChange("en", "description", e.target.value)
              }
              placeholder="English description"
              size="small"
            />
          </div>
        </div>

        {/* Arabic */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-sm text-gray-700">العربية (Arabic)</h4>
          <div>
            <Label className="text-xs">العنوان</Label>
            <Input
              value={formData.localizedContent?.ar?.title || ""}
              onChange={(e) =>
                handleLocalizedContentChange("ar", "title", e.target.value)
              }
              placeholder="العنوان العربي"
              dir="rtl"
            />
          </div>
          <div>
            <Label className="text-xs">الوصف</Label>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.localizedContent?.ar?.description || ""}
              onChange={(e) =>
                handleLocalizedContentChange("ar", "description", e.target.value)
              }
              placeholder="الوصف العربي"
              size="small"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
