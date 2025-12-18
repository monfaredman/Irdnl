import type { TranslationKey } from "@/providers/language-provider";

type NavLink = {
	href: string;
	translationKey: TranslationKey;
};

export const NAV_LINKS: NavLink[] = [
	{ href: "/", translationKey: "home" },
	{ href: "/movies/foreign", translationKey: "foreignMovies" },
	{ href: "/movies/iranian", translationKey: "iranianMovies" },
	{ href: "/series", translationKey: "series" },
	{ href: "/animation", translationKey: "animation" },
	{ href: "/anime", translationKey: "anime" },
	{ href: "/category", translationKey: "category" },
	{ href: "/search", translationKey: "search" },
];

export const FOOTER_LINKS = {
	legal: [
		{ label: "DMCA", href: "/legal/dmca" },
		{ label: "Terms", href: "/legal/terms" },
		{ label: "Privacy", href: "/legal/privacy" },
	],
	contact: [
		{ label: "Contact", href: "mailto:hello@irdnl.tv" },
		{ label: "Telegram", href: "https://t.me/irdnl" },
	],
	categories: [
		{ label: "Foreign Movies", href: "/movies/foreign" },
		{ label: "Iranian Movies", href: "/movies/iranian" },
		{ label: "Animation", href: "/animation" },
		{ label: "Anime", href: "/anime" },
	],
	social: [
		{ label: "Instagram", href: "https://instagram.com/irdnl" },
		{ label: "YouTube", href: "https://youtube.com/irdnl" },
	],
};
