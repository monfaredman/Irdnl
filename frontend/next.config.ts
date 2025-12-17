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
};

export default nextConfig;
