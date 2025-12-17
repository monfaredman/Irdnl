// Centralized route config for the Next.js App Router.
// Keep these in sync with `src/app/**/page.tsx`.

export const routes = {
	// Public
	home: "/",
	about: "/about",
	account: "/account",
	careers: "/careers",
	collections: "/collections",
	comingSoon: "/coming-soon",
	contact: "/contact",
	cookies: "/cookies",
	faq: "/faq",
	genres: "/genres",
	help: "/help",
	kids: "/kids",
	movies: "/movies",
	press: "/press",
	privacy: "/privacy",
	search: "/search",
	series: "/series",
	terms: "/terms",
	top250: "/top-250",

	// Auth
	auth: {
		login: "/auth/login",
		register: "/auth/register",
	},

	// User area
	user: {
		profile: "/user/profile",
		settings: "/user/settings",
		history: "/user/history",
		watchlist: "/user/watchlist",
		subscription: "/user/subscription",
		payment: "/user/payment",
	},

	// Admin
	admin: {
		login: "/admin/login",
		dashboard: "/admin/dashboard",
		users: "/admin/users",
		videos: "/admin/videos",
		notifications: "/admin/notifications",
		finance: "/admin/finance",
		content: "/admin/content",
		contentNew: "/admin/content/new",
		contentById: (id: string | number) => `/admin/content/${id}`,
	},

	// Dynamic content
	movieBySlug: (slug: string) => `/movies/${slug}`,
	seriesBySlug: (slug: string) => `/series/${slug}`,
} as const;

export type Routes = typeof routes;
