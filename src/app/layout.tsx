import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/providers/language-provider";
import { LiquidGlassLayoutWrapper } from "@/components/layout/LiquidGlassLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PersiaPlay | Cinema Redefined",
  description:
    "Experience movies and series like never before with PersiaPlay's premium liquid glass interface.",
  keywords: [
    "Persian streaming",
    "Iranian series",
    "Farsi movies",
    "premium streaming",
    "liquid glass design",
  ],
  metadataBase: new URL("https://persiaplay.example"),
  openGraph: {
    title: "PersiaPlay - Cinema Redefined",
    description: "Premium streaming experience with liquid glass design.",
    siteName: "PersiaPlay",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <LiquidGlassLayoutWrapper>
            {children}
          </LiquidGlassLayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
