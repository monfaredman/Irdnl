import type { Metadata } from "next";

type RouteMetadata = {
	title: {
		en: string;
		fa: string;
	};
	description: {
		en: string;
		fa: string;
	};
};

export const routeMetadata: Record<string, RouteMetadata> = {
	"/movie/foreign": {
		title: { en: "Foreign Movies", fa: "فیلم خارجی" },
		description: {
			en: "High-quality foreign films with Persian subtitles",
			fa: "فیلم‌های خارجی با کیفیت بالا و زیرنویس فارسی",
		},
	},
	"/movie/iranian": {
		title: { en: "Iranian Movies", fa: "فیلم ایرانی" },
		description: {
			en: "The best of Iranian cinema",
			fa: "بهترین فیلم‌های سینمای ایران",
		},
	},
	"/serie/foreign": {
		title: { en: "Foreign Series", fa: "سریال خارجی" },
		description: {
			en: "High-quality foreign series with Persian subtitles",
			fa: "سریال‌های خارجی با کیفیت بالا و زیرنویس فارسی",
		},
	},
	"/serie/iranian": {
		title: { en: "Iranian Series", fa: "سریال ایرانی" },
		description: {
			en: "The best of Iranian series",
			fa: "بهترین سریال‌های ایرانی",
		},
	},
	"/animation": {
		title: { en: "Animation", fa: "انیمیشن" },
		description: {
			en: "Best animated movies and series",
			fa: "بهترین انیمیشن‌های سینمایی و سریالی",
		},
	},
	"/dubbed": {
		title: { en: "Persian Dubbed", fa: "دوبله فارسی" },
		description: {
			en: "Foreign movies with Persian dubbing",
			fa: "فیلم‌های خارجی با دوبله فارسی",
		},
	},
	"/anime": {
		title: { en: "Anime", fa: "انیمه" },
		description: {
			en: "Best Japanese anime with Persian subtitles",
			fa: "بهترین انیمه‌های ژاپنی با زیرنویس فارسی",
		},
	},
	"/category": {
		title: { en: "Other Categories", fa: "سایر" },
		description: {
			en: "Special categories and curated collections",
			fa: "دسته‌بندی‌های ویژه و مجموعه‌های منتخب",
		},
	},
	"/category/coming-soon": {
		title: { en: "Coming Soon", fa: "به‌زودی" },
		description: {
			en: "Upcoming movies and series",
			fa: "فیلم‌ها و سریال‌های آینده",
		},
	},
	"/category/collections": {
		title: { en: "Collections", fa: "مجموعه‌ها" },
		description: {
			en: "Curated movie collections for every taste",
			fa: "مجموعه‌های انتخابی فیلم برای هر سلیقه",
		},
	},
	"/category/kids": {
		title: { en: "Kids Zone", fa: "کودکان" },
		description: {
			en: "Safe and fun content for children",
			fa: "محتوای امن و سرگرم‌کننده برای کودکان",
		},
	},
};

const genreMetadata: Record<string, { en: string; fa: string }> = {
	action: { en: "Action", fa: "اکشن" },
	comedy: { en: "Comedy", fa: "کمدی" },
	drama: { en: "Drama", fa: "درام" },
	thriller: { en: "Thriller", fa: "هیجان‌انگیز" },
	horror: { en: "Horror", fa: "ترسناک" },
	scifi: { en: "Sci-Fi", fa: "علمی‌تخیلی" },
	romance: { en: "Romance", fa: "عاشقانه" },
	crime: { en: "Crime", fa: "جنایی" },
	fantasy: { en: "Fantasy", fa: "فانتزی" },
	mystery: { en: "Mystery", fa: "معمایی" },
	family: { en: "Family", fa: "خانوادگی" },
};

export function generateMetadata(
	path: string,
	language: "en" | "fa" = "fa"
): Metadata {
	// Handle genre pages
	if (path.includes("/movie/foreign/")) {
		const genre = path.split("/").pop() || "";
		const genreInfo = genreMetadata[genre] || { en: genre, fa: genre };
		return {
			title: `${genreInfo[language]} - ${language === "fa" ? "فیلم خارجی" : "Foreign Movies"} | IrDnl`,
			description:
				language === "fa"
					? `فیلم‌های ${genreInfo.fa} خارجی با کیفیت بالا`
					: `High-quality foreign ${genreInfo.en} movies`,
		};
	}

	if (path.includes("/movie/iranian/")) {
		const genre = path.split("/").pop() || "";
		const genreInfo = genreMetadata[genre] || { en: genre, fa: genre };
		return {
			title: `${genreInfo[language]} - ${language === "fa" ? "فیلم ایرانی" : "Iranian Movies"} | IrDnl`,
			description:
				language === "fa"
					? `فیلم‌های ${genreInfo.fa} ایرانی`
					: `Iranian ${genreInfo.en} movies`,
		};
	}

	if (path.includes("/serie/foreign/")) {
		const genre = path.split("/").pop() || "";
		const genreInfo = genreMetadata[genre] || { en: genre, fa: genre };
		return {
			title: `${genreInfo[language]} - ${language === "fa" ? "سریال خارجی" : "Foreign Series"} | IrDnl`,
			description:
				language === "fa"
					? `سریال‌های ${genreInfo.fa} خارجی با کیفیت بالا`
					: `High-quality foreign ${genreInfo.en} series`,
		};
	}

	if (path.includes("/serie/iranian/")) {
		const genre = path.split("/").pop() || "";
		const genreInfo = genreMetadata[genre] || { en: genre, fa: genre };
		return {
			title: `${genreInfo[language]} - ${language === "fa" ? "سریال ایرانی" : "Iranian Series"} | IrDnl`,
			description:
				language === "fa"
					? `سریال‌های ${genreInfo.fa} ایرانی`
					: `Iranian ${genreInfo.en} series`,
		};
	}

	// Handle direct routes
	const metadata = routeMetadata[path];
	if (metadata) {
		return {
			title: `${metadata.title[language]} | IrDnl`,
			description: metadata.description[language],
		};
	}

	// Default metadata
	return {
		title: "IrDnl - Premium Persian Streaming",
		description:
			language === "fa"
				? "پلتفرم پخش آنلاین فیلم و سریال"
				: "Premium Persian streaming platform",
	};
}
