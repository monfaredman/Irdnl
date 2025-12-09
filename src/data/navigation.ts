import type { TranslationKey } from "@/providers/language-provider";

type NavLink = {
  href: string;
  translationKey: TranslationKey;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", translationKey: "home" },
  { href: "/movies", translationKey: "movies" },
  { href: "/series", translationKey: "series" },
  { href: "/genres", translationKey: "genres" },
  { href: "/search", translationKey: "search" },
];

export const FOOTER_LINKS = {
  legal: [
    { label: "DMCA", href: "/legal/dmca" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
  ],
  contact: [
    { label: "Contact", href: "mailto:hello@persiaplay.tv" },
    { label: "Telegram", href: "https://t.me/persiaplay" },
  ],
  categories: [
    { label: "Drama", href: "/genres/drama" },
    { label: "Thriller", href: "/genres/thriller" },
    { label: "Comedy", href: "/genres/comedy" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/persiaplay" },
    { label: "YouTube", href: "https://youtube.com/persiaplay" },
  ],
};
