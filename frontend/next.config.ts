import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				port: "",
				pathname: "/t/p/**",
			},
		],
		// Bypass Next.js image optimization to avoid private IP blocking
		unoptimized: true,
	},
	async redirects() {
		return [
			// Old genre-based routes to new structure
			{
				source: "/genres",
				destination: "/category",
				permanent: true,
			},
			{
				source: "/movies",
				destination: "/movies/foreign",
				permanent: false,
			},
			// Query parameter redirects
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "origin",
						value: "foreign",
					},
				],
				destination: "/movies/foreign",
				permanent: false,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "origin",
						value: "iranian",
					},
				],
				destination: "/movies/iranian",
				permanent: false,
			},
			{
				source: "/series",
				has: [
					{
						type: "query",
						key: "origin",
						value: "foreign",
					},
				],
				destination: "/series/foreign",
				permanent: false,
			},
			{
				source: "/series",
				has: [
					{
						type: "query",
						key: "origin",
						value: "iranian",
					},
				],
				destination: "/series/iranian",
				permanent: false,
			},
			// Genre query parameter redirects for foreign movies
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "genre",
						value: "action",
					},
				],
				destination: "/movies/foreign/action",
				permanent: false,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "genre",
						value: "drama",
					},
				],
				destination: "/movies/foreign/drama",
				permanent: false,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "genre",
						value: "comedy",
					},
				],
				destination: "/movies/foreign/comedy",
				permanent: false,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "genre",
						value: "thriller",
					},
				],
				destination: "/movies/foreign/thriller",
				permanent: false,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "genre",
						value: "horror",
					},
				],
				destination: "/movies/foreign/horror",
				permanent: false,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "genre",
						value: "scifi",
					},
				],
				destination: "/movies/foreign/scifi",
				permanent: false,
			},
			// Old category routes
			{
				source: "/coming-soon",
				destination: "/category/coming-soon",
				permanent: true,
			},
			{
				source: "/collections",
				destination: "/category/collections",
				permanent: true,
			},
			{
				source: "/kids",
				destination: "/category/kids",
				permanent: true,
			},
			// Old genre-type routes
			{
				source: "/genres",
				has: [
					{
						type: "query",
						key: "type",
						value: "animation",
					},
				],
				destination: "/animation",
				permanent: true,
			},
			{
				source: "/genres",
				has: [
					{
						type: "query",
						key: "type",
						value: "anime",
					},
				],
				destination: "/anime",
				permanent: true,
			},
			{
				source: "/movies",
				has: [
					{
						type: "query",
						key: "dubbed",
						value: "true",
					},
				],
				destination: "/dubbed",
				permanent: true,
			},
		];
	},
};

export default nextConfig;

