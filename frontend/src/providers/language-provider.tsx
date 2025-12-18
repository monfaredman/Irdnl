"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { LanguageCode } from "@/types/media";

type Dictionary = Record<string, Record<string, string>>;

const dictionary: Dictionary = {
	en: {
		home: "Home",
		movies: "Movies",
		foreignMovies: "Foreign Movies",
		iranianMovies: "Iranian Movies",
		series: "Series",
		foreignSeries: "Foreign Series",
		iranianSeries: "Iranian Series",
		genres: "Genres",
		search: "Search",
		animation: "Animation",
		dubbed: "Persian Dubbed",
		anime: "Anime",
		category: "Category",
		other: "Other",
		comingSoon: "Coming Soon",
		collections: "Collections",
		kids: "Kids Zone",
		watchlist: "Watchlist",
		continueWatching: "Continue watching",
		latestMovies: "Latest movies",
		latestSeries: "Latest series",
		featured: "Featured Picks",
		filters: "Quick filters",
		account: "Account",
		monetization: "Plans & Billing",
	},
	fa: {
		home: "خانه",
		movies: "فیلم",
		foreignMovies: "فیلم خارجی",
		iranianMovies: "فیلم ایرانی",
		series: "سریال",
		foreignSeries: "سریال خارجی",
		iranianSeries: "سریال ایرانی",
		genres: "ژانرها",
		search: "جستجو",
		animation: "انیمیشن",
		dubbed: "دوبله فارسی",
		anime: "انیمه",
		category: "دسته‌بندی",
		other: "سایر",
		comingSoon: "به‌زودی",
		collections: "مجموعه‌ها",
		kids: "کودکان",
		watchlist: "لیست تماشا",
		continueWatching: "ادامه تماشا",
		latestMovies: "جدیدترین فیلم‌ها",
		latestSeries: "جدیدترین سریال‌ها",
		featured: "ویژه",
		filters: "فیلتر سریع",
		account: "حساب کاربری",
		monetization: "خرید اشتراک",
	},
};

export type TranslationKey = keyof (typeof dictionary)["en"];

interface LanguageContextValue {
	language: LanguageCode;
	setLanguage: (code: LanguageCode) => void;
	t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
	undefined,
);

export const LanguageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [language, setLanguage] = useState<LanguageCode>("fa");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const stored = window.localStorage.getItem(
				"irdnl-language",
			) as LanguageCode | null;
			if (stored) {
				setLanguage(stored);
			}
		}
	}, []);

	// Update document direction and lang attribute when language changes
	useEffect(() => {
		if (typeof document !== "undefined") {
			const htmlElement = document.documentElement;
			htmlElement.setAttribute("lang", language);
			htmlElement.setAttribute("dir", language === "fa" ? "rtl" : "ltr");
		}
	}, [language]);

	const updateLanguage = (code: LanguageCode) => {
		setLanguage(code);
		if (typeof window !== "undefined") {
			window.localStorage.setItem("irdnl-language", code);
		}
	};

	const value = useMemo<LanguageContextValue>(() => {
		const t = (key: TranslationKey) => dictionary[language][key] ?? key;
		return { language, setLanguage: updateLanguage, t };
	}, [language]);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within LanguageProvider");
	}
	return context;
};
