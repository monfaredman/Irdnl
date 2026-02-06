"use client";

import { useState } from "react";
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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await contentApi.create(formData);
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
              <Button variant="outline" onClick={() => router.push("/admin/content")}>
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
    </div>
  );
}
