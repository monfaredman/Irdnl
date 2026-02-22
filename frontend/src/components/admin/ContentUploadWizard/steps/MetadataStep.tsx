"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Button } from "@/components/admin/ui/button";
import { X, Plus } from "lucide-react";
import { TMDBFieldButton } from "../TMDBFieldButton";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Chip, Box, TextField as MuiTextField } from "@mui/material";
import { genresApi } from "@/lib/api/admin";
import type { ContentFormData, CastMember, DubbingCastMember, ProductionTeamMember } from "../types";

interface MetadataStepProps {
  formData: ContentFormData;
  updateFormData: (data: Partial<ContentFormData>) => void;
}

interface GenreOption {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
}

export function MetadataStep({ formData, updateFormData }: MetadataStepProps) {
  const { t } = useTranslation();
  const tmdbId = formData.tmdbId || "";
  const mediaType = formData.type === "series" ? "series" : "movie";
  const [availableGenres, setAvailableGenres] = useState<GenreOption[]>([]);
  const [newTagValue, setNewTagValue] = useState("");

  useEffect(() => {
    genresApi.list().then((res: any) => {
      const genres = res.data || res || [];
      setAvailableGenres(genres);
    }).catch(console.error);
  }, []);

  const handleGenreChange = (selected: string[]) => {
    updateFormData({ genres: selected });
  };

  const removeGenre = (genreToRemove: string) => {
    updateFormData({ genres: (formData.genres || []).filter(g => g !== genreToRemove) });
  };

  const addTag = () => {
    const tag = newTagValue.trim();
    if (tag) {
      updateFormData({ tags: [...(formData.tags || []), tag] });
      setNewTagValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    updateFormData({ tags: newTags });
  };

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
          <Label htmlFor="rating">امتیاز (0-10)</Label>
          <div className="flex gap-2">
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.rating || ""}
              onChange={(e) => updateFormData({ rating: parseFloat(e.target.value) || undefined })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="rating"
              onFetch={(val) => updateFormData({ rating: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageRating">{t("admin.upload.metadata.ageRating")}</Label>
          <select
            id="ageRating"
            value={formData.ageRating || ""}
            onChange={(e) => updateFormData({ ageRating: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">انتخاب کنید</option>
            <option value="G">G - عمومی</option>
            <option value="PG">PG - راهنمایی والدین</option>
            <option value="PG-13">PG-13 - 13+</option>
            <option value="R">R - محدود</option>
            <option value="NC-17">NC-17 - بزرگسال</option>
          </select>
        </div>
      </div>

      {/* Multi-source Ratings */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">🎬 امتیازات چندگانه</Label>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-1">
            <Label className="text-sm">🎬 IMDb Score (0-10)</Label>
            <Input
              type="number" step="0.1" min="0" max="10"
              value={formData.ratings?.imdb?.score || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, imdb: { ...formData.ratings?.imdb, score: e.target.value ? parseFloat(e.target.value) : undefined } } })}
              placeholder="8.5"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">🎬 IMDb Votes</Label>
            <Input
              type="number" min="0"
              value={formData.ratings?.imdb?.votes || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, imdb: { ...formData.ratings?.imdb, votes: e.target.value ? parseInt(e.target.value) : undefined } } })}
              placeholder="120000"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">🍅 Tomatometer (0-100)</Label>
            <Input
              type="number" step="1" min="0" max="100"
              value={formData.ratings?.rottenTomatoes?.tomatometer || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, rottenTomatoes: { ...formData.ratings?.rottenTomatoes, tomatometer: e.target.value ? parseInt(e.target.value) : undefined } } })}
              placeholder="92"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">🍅 RT Audience (0-100)</Label>
            <Input
              type="number" step="1" min="0" max="100"
              value={formData.ratings?.rottenTomatoes?.audience || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, rottenTomatoes: { ...formData.ratings?.rottenTomatoes, audience: e.target.value ? parseInt(e.target.value) : undefined } } })}
              placeholder="88"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Ⓜ️ Metacritic (0-100)</Label>
            <Input
              type="number" step="1" min="0" max="100"
              value={formData.ratings?.metacritic?.score || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, metacritic: { score: e.target.value ? parseInt(e.target.value) : undefined } } })}
              placeholder="78"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">⭐ Fandango (0-5)</Label>
            <Input
              type="number" step="0.1" min="0" max="5"
              value={formData.ratings?.fandango?.score || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, fandango: { score: e.target.value ? parseFloat(e.target.value) : undefined } } })}
              placeholder="4.2"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">📝 Letterboxd (0-5)</Label>
            <Input
              type="number" step="0.1" min="0" max="5"
              value={formData.ratings?.letterboxd?.score || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, letterboxd: { score: e.target.value ? parseFloat(e.target.value) : undefined } } })}
              placeholder="3.8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">📺 MyAnimeList (0-10)</Label>
            <Input
              type="number" step="0.1" min="0" max="10"
              value={formData.ratings?.myAnimeList?.score || ""}
              onChange={(e) => updateFormData({ ratings: { ...formData.ratings, myAnimeList: { score: e.target.value ? parseFloat(e.target.value) : undefined } } })}
              placeholder="8.1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{t("admin.upload.metadata.genres")}</Label>
          <TMDBFieldButton
            tmdbId={tmdbId}
            mediaType={mediaType}
            fieldKey="genres"
            onFetch={(val) => {
              if (Array.isArray(val)) {
                updateFormData({ genres: val });
              }
            }}
          />
        </div>
        {/* Genre Multi-Select Dropdown */}
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel id="genre-select-label">انتخاب ژانر</InputLabel>
          <Select
            labelId="genre-select-label"
            multiple
            value={formData.genres || []}
            onChange={(e) => handleGenreChange(e.target.value as string[])}
            input={<OutlinedInput label="انتخاب ژانر" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => {
                  const genreInfo = availableGenres.find(g => g.nameFa === value || g.nameEn === value || g.slug === value);
                  return (
                    <Chip
                      key={value}
                      label={genreInfo?.nameFa || value}
                      size="small"
                      onDelete={() => removeGenre(value)}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  );
                })}
              </Box>
            )}
          >
            {availableGenres.map((genre) => (
              <MenuItem key={genre.id || genre.slug} value={genre.nameFa || genre.nameEn}>
                <Checkbox checked={(formData.genres || []).indexOf(genre.nameFa || genre.nameEn) > -1} />
                <ListItemText primary={`${genre.nameFa || genre.nameEn}`} secondary={genre.nameEn !== genre.nameFa ? genre.nameEn : undefined} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>تگ‌ها (Tags)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.tags || []).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button onClick={() => removeTag(index)} className="hover:text-green-600">
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <MuiTextField
            size="small"
            placeholder="تگ جدید وارد کنید"
            value={newTagValue}
            onChange={(e) => setNewTagValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            sx={{ flex: 1 }}
          />
          <Button type="button" variant="outline" onClick={addTag} disabled={!newTagValue.trim()}>
            <Plus className="h-4 w-4 ml-2" />
            افزودن تگ
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="director">{t("admin.upload.metadata.director")}</Label>
          <div className="flex gap-2">
            <Input
              id="director"
              value={formData.director || ""}
              onChange={(e) => updateFormData({ director: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="director"
              onFetch={(val) => updateFormData({ director: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="writer">{t("admin.upload.metadata.writer")}</Label>
          <div className="flex gap-2">
            <Input
              id="writer"
              value={formData.writer || ""}
              onChange={(e) => updateFormData({ writer: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="writer"
              onFetch={(val) => updateFormData({ writer: val })}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="producer">{t("admin.upload.metadata.producer")}</Label>
          <div className="flex gap-2">
            <Input
              id="producer"
              value={formData.producer || ""}
              onChange={(e) => updateFormData({ producer: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="producer"
              onFetch={(val) => updateFormData({ producer: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productionCompany">{t("admin.upload.metadata.productionCompany")}</Label>
          <div className="flex gap-2">
            <Input
              id="productionCompany"
              value={formData.productionCompany || ""}
              onChange={(e) => updateFormData({ productionCompany: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="productionCompany"
              onFetch={(val) => updateFormData({ productionCompany: val })}
            />
          </div>
        </div>
      </div>

      {/* ── Cast Members (بازیگران) ── */}
      <div className="space-y-3 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">🎭 بازیگران</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const current = formData.cast || [];
              updateFormData({ cast: [...current, { name: "", character: "", imageUrl: "" }] });
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> افزودن بازیگر
          </Button>
        </div>
        {(formData.cast || []).map((member, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <Input
              placeholder="نام بازیگر"
              value={member.name}
              onChange={(e) => {
                const cast = [...(formData.cast || [])];
                cast[idx] = { ...cast[idx], name: e.target.value };
                updateFormData({ cast });
              }}
              className="flex-1"
            />
            <Input
              placeholder="نقش"
              value={member.character || ""}
              onChange={(e) => {
                const cast = [...(formData.cast || [])];
                cast[idx] = { ...cast[idx], character: e.target.value };
                updateFormData({ cast });
              }}
              className="flex-1"
            />
            <Input
              placeholder="لینک تصویر"
              value={member.imageUrl || ""}
              onChange={(e) => {
                const cast = [...(formData.cast || [])];
                cast[idx] = { ...cast[idx], imageUrl: e.target.value };
                updateFormData({ cast });
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const cast = (formData.cast || []).filter((_, i) => i !== idx);
                updateFormData({ cast });
              }}
            >
              <X className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ))}
      </div>

      {/* ── Dubbing Cast (گویندگان دوبله) ── */}
      <div className="space-y-3 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">🎙️ گویندگان دوبله</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const current = formData.dubbingCast || [];
              updateFormData({ dubbingCast: [...current, { name: "", character: "", language: "", imageUrl: "" }] });
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> افزودن گوینده
          </Button>
        </div>
        {(formData.dubbingCast || []).map((member, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <Input
              placeholder="نام گوینده"
              value={member.name}
              onChange={(e) => {
                const dubbingCast = [...(formData.dubbingCast || [])];
                dubbingCast[idx] = { ...dubbingCast[idx], name: e.target.value };
                updateFormData({ dubbingCast });
              }}
              className="flex-1"
            />
            <Input
              placeholder="شخصیت"
              value={member.character || ""}
              onChange={(e) => {
                const dubbingCast = [...(formData.dubbingCast || [])];
                dubbingCast[idx] = { ...dubbingCast[idx], character: e.target.value };
                updateFormData({ dubbingCast });
              }}
              className="flex-1"
            />
            <Input
              placeholder="زبان"
              value={member.language || ""}
              onChange={(e) => {
                const dubbingCast = [...(formData.dubbingCast || [])];
                dubbingCast[idx] = { ...dubbingCast[idx], language: e.target.value };
                updateFormData({ dubbingCast });
              }}
              className="w-24"
            />
            <Input
              placeholder="لینک تصویر"
              value={member.imageUrl || ""}
              onChange={(e) => {
                const dubbingCast = [...(formData.dubbingCast || [])];
                dubbingCast[idx] = { ...dubbingCast[idx], imageUrl: e.target.value };
                updateFormData({ dubbingCast });
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const dubbingCast = (formData.dubbingCast || []).filter((_, i) => i !== idx);
                updateFormData({ dubbingCast });
              }}
            >
              <X className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ))}
      </div>

      {/* ── Production Team (عوامل سازنده) ── */}
      <div className="space-y-3 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">🎬 عوامل سازنده</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const current = formData.productionTeam || [];
              updateFormData({ productionTeam: [...current, { name: "", role: "", department: "", imageUrl: "" }] });
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> افزودن عضو
          </Button>
        </div>
        {(formData.productionTeam || []).map((member, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <Input
              placeholder="نام"
              value={member.name}
              onChange={(e) => {
                const productionTeam = [...(formData.productionTeam || [])];
                productionTeam[idx] = { ...productionTeam[idx], name: e.target.value };
                updateFormData({ productionTeam });
              }}
              className="flex-1"
            />
            <Input
              placeholder="نقش (مثلاً تهیه‌کننده)"
              value={member.role}
              onChange={(e) => {
                const productionTeam = [...(formData.productionTeam || [])];
                productionTeam[idx] = { ...productionTeam[idx], role: e.target.value };
                updateFormData({ productionTeam });
              }}
              className="flex-1"
            />
            <Input
              placeholder="بخش"
              value={member.department || ""}
              onChange={(e) => {
                const productionTeam = [...(formData.productionTeam || [])];
                productionTeam[idx] = { ...productionTeam[idx], department: e.target.value };
                updateFormData({ productionTeam });
              }}
              className="w-28"
            />
            <Input
              placeholder="لینک تصویر"
              value={member.imageUrl || ""}
              onChange={(e) => {
                const productionTeam = [...(formData.productionTeam || [])];
                productionTeam[idx] = { ...productionTeam[idx], imageUrl: e.target.value };
                updateFormData({ productionTeam });
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const productionTeam = (formData.productionTeam || []).filter((_, i) => i !== idx);
                updateFormData({ productionTeam });
              }}
            >
              <X className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="country">{t("admin.upload.metadata.country")}</Label>
          <div className="flex gap-2">
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => updateFormData({ country: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="country"
              onFetch={(val) => updateFormData({ country: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imdbId">{t("admin.upload.metadata.imdbId")}</Label>
          <div className="flex gap-2">
            <Input
              id="imdbId"
              placeholder="tt1234567"
              value={formData.imdbId || ""}
              onChange={(e) => updateFormData({ imdbId: e.target.value })}
              className="flex-1"
            />
            <TMDBFieldButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              fieldKey="imdbId"
              onFetch={(val) => updateFormData({ imdbId: val })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tmdbId">{t("admin.upload.metadata.tmdbId")}</Label>
          <Input
            id="tmdbId"
            placeholder="12345"
            value={formData.tmdbId || ""}
            onChange={(e) => updateFormData({ tmdbId: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
