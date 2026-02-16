"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Check } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { MediaAssetsStep } from "./steps/MediaAssetsStep";
import { MetadataStep } from "./steps/MetadataStep";
import { LocalizationStep } from "./steps/LocalizationStep";
import { TechnicalStep } from "./steps/TechnicalStep";
import { SEOStep } from "./steps/SEOStep";
import { ReviewStep } from "./steps/ReviewStep";
import { TMDBSearchPanel } from "./TMDBSearchPanel";
import { contentApi } from "@/lib/api/admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import type { ContentFormData } from "./types";

const STEPS = [
  { key: "basicInfo", component: BasicInfoStep },
  { key: "mediaAssets", component: MediaAssetsStep },
  { key: "metadata", component: MetadataStep },
  { key: "localization", component: LocalizationStep },
  { key: "technical", component: TechnicalStep },
  { key: "seo", component: SEOStep },
  { key: "review", component: ReviewStep },
];

export function ContentUploadWizard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "error" });
  const [formData, setFormData] = useState<ContentFormData>({
    // Basic Info
    title: "",
    originalTitle: "",
    tagline: "",
    type: "movie",
    year: new Date().getFullYear(),
    description: "",
    shortDescription: "",
    duration: 0,
    status: "draft",

    // Visual Assets
    posterUrl: "",
    bannerUrl: "",
    thumbnailUrl: "",
    backdropUrl: "",
    logoUrl: "",
    externalPlayerUrl: "",

    // Metadata
    rating: 0,
    genres: [],
    tags: [],
    languages: [],
    originalLanguage: "",
    ageRating: "",
    contentWarnings: [],
    cast: [],
    crew: [],
    director: "",
    writer: "",
    producer: "",
    productionCompany: "",
    country: "",
    imdbId: "",
    tmdbId: "",

    // Media Assets
    videoQualities: {},
    audioTracks: [],
    subtitles: [],
    trailers: [],

    // Technical
    technicalSpecs: {},
    drmSettings: {},

    // Scheduling
    publishDate: null,
    availabilityStart: null,
    availabilityEnd: null,
    geoRestrictions: [],
    deviceRestrictions: [],

    // Monetization
    monetization: {},

    // Rights
    rightsInfo: {},

    // SEO
    featured: false,
    priority: 0,
    localizedContent: {},
    seo: {},
  });

  // Warn before closing/navigating away if form has been touched
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleNext = () => {
    // Block navigation if status is scheduled but publishDate is missing
    if (currentStep === 0 && formData.status === "scheduled" && !formData.publishDate) {
      setSnackbar({ open: true, message: "وقتی وضعیت «زمانبندی شده» است، باید تاریخ انتشار را مشخص کنید.", severity: "warning" });
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAsDraft = async () => {
    setLoading(true);
    try {
      const cleanedData = { ...formData, status: "draft" as const };
      if (!cleanedData.externalPlayerUrl) cleanedData.externalPlayerUrl = undefined as any;
      if (!cleanedData.posterUrl) cleanedData.posterUrl = undefined as any;
      if (!cleanedData.bannerUrl) cleanedData.bannerUrl = undefined as any;
      if (!cleanedData.thumbnailUrl) cleanedData.thumbnailUrl = undefined as any;
      if (!cleanedData.backdropUrl) cleanedData.backdropUrl = undefined as any;
      if (!cleanedData.logoUrl) cleanedData.logoUrl = undefined as any;
      await contentApi.create(cleanedData);
      setIsDirty(false);
      router.push("/admin/content");
    } catch (error) {
      console.error("Failed to save draft:", error);
      setSnackbar({ open: true, message: "خطا در ذخیره پیش‌نویس", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleExitRequest = () => {
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      router.push("/admin/content");
    }
  };

  const handleDiscardAndExit = () => {
    setIsDirty(false);
    setShowExitDialog(false);
    router.push("/admin/content");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Clean empty strings to null for optional URL fields
      const cleanedData = { ...formData };
      if (!cleanedData.externalPlayerUrl) cleanedData.externalPlayerUrl = undefined as any;
      if (!cleanedData.posterUrl) cleanedData.posterUrl = undefined as any;
      if (!cleanedData.bannerUrl) cleanedData.bannerUrl = undefined as any;
      if (!cleanedData.thumbnailUrl) cleanedData.thumbnailUrl = undefined as any;
      if (!cleanedData.backdropUrl) cleanedData.backdropUrl = undefined as any;
      if (!cleanedData.logoUrl) cleanedData.logoUrl = undefined as any;
      await contentApi.create(cleanedData);
      setIsDirty(false);
      router.push("/admin/content");
    } catch (error) {
      console.error("Failed to create content:", error);
      alert(t("admin.messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (data: Partial<ContentFormData>) => {
    setFormData({ ...formData, ...data });
    setIsDirty(true);
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("admin.upload.title")}</h1>
        <p className="text-gray-600 mt-2">
          {t(`admin.upload.steps.${STEPS[currentStep].key}`)}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? "border-green-600 bg-green-600 text-white"
                    : index === currentStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  index <= currentStep ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {t(`admin.upload.steps.${step.key}`)}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-4 ${
                  index < currentStep ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* TMDB Auto-fill Search (shown on first step only) */}
      {currentStep === 0 && (
        <TMDBSearchPanel onAutoFill={updateFormData} />
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{t(`admin.upload.steps.${STEPS[currentStep].key}`)}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent formData={formData} updateFormData={updateFormData} />

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              {t("admin.form.previous")}
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSaveAsDraft} disabled={loading}>
                {loading ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
              </Button>
              <Button variant="outline" onClick={handleExitRequest}>
                {t("admin.form.cancel")}
              </Button>
              {currentStep === STEPS.length - 1 ? (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? t("admin.messages.loading") : t("admin.form.finish")}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {t("admin.form.next")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>خروج از فرم</DialogTitle>
        <DialogContent>
          <DialogContentText>
            تغییرات ذخیره نشده دارید. آیا می‌خواهید قبل از خروج به‌عنوان پیش‌نویس ذخیره کنید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
          <MuiButton onClick={() => setShowExitDialog(false)} color="inherit">
            انصراف
          </MuiButton>
          <MuiButton onClick={handleDiscardAndExit} color="error" variant="outlined">
            خروج بدون ذخیره
          </MuiButton>
          <MuiButton
            onClick={() => { setShowExitDialog(false); handleSaveAsDraft(); }}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "ذخیره پیش‌نویس و خروج"}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
