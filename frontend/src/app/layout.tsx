import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { PremiumLiquidGlassLayout } from "@/components/layout/PremiumLiquidGlassLayout";
import { LanguageProvider } from "@/providers/language-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { AGGridProvider } from "@/components/AGGridProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

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
		<html lang="fa" dir="rtl" suppressHydrationWarning>
			<head>
				{/* Preconnect to CDN for faster font loading */}
				<link rel="preconnect" href="https://cdn.jsdelivr.net" />
				<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
				{/* Inline script to apply stored language direction before React hydrates */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var l=localStorage.getItem('irdnl-language');if(l){document.documentElement.lang=l;document.documentElement.dir=l==='fa'?'rtl':'ltr';}}catch(e){}})();`,
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased`}
				suppressHydrationWarning
			>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<AGGridProvider>
						<LanguageProvider>
							<AuthProvider>
								<PremiumLiquidGlassLayout>{children}</PremiumLiquidGlassLayout>
							</AuthProvider>
						</LanguageProvider>
					</AGGridProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
