import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { PremiumLiquidGlassLayout } from "@/components/layout/PremiumLiquidGlassLayout";
import { LanguageProvider } from "@/providers/language-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
	variable: "--font-vazirmatn",
	subsets: ["arabic", "latin"],
	weight: ["300", "400", "500", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "IrDnl | Cinema Redefined",
	description:
		"Experience movies and series like never before with IrDnl's premium liquid glass interface.",
	keywords: [
		"Persian streaming",
		"Iranian series",
		"Farsi movies",
		"premium streaming",
		"liquid glass design",
	],
	metadataBase: new URL("https://irdnl.example"),
	openGraph: {
		title: "IrDnl - Cinema Redefined",
		description: "Premium streaming experience with liquid glass design.",
		siteName: "IrDnl",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* Preconnect to CDN for faster font loading */}
				<link rel="preconnect" href="https://cdn.jsdelivr.net" />
				<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased`}
			>
				<LanguageProvider>
					<PremiumLiquidGlassLayout>{children}</PremiumLiquidGlassLayout>
				</LanguageProvider>
			</body>
		</html>
	);
}
