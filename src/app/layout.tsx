import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/providers/language-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PersiaPlay | Premium Persian Streaming",
  description:
    "PersiaPlay is the dedicated streaming hub for Persian films and series with secure downloads, subtitles, and multi-device support.",
  keywords: [
    "Persian streaming",
    "Iranian series",
    "Farsi movies",
    "download films",
    "HLS",
    "DRM",
  ],
  metadataBase: new URL("https://persiaplay.example"),
  openGraph: {
    title: "PersiaPlay",
    description: "Watch Persian movies and shows with multi-language support.",
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
        <ThemeProvider>
          <LanguageProvider>
            <div style={{ position: 'relative', minHeight: '100vh' }}>
              {/* Animated gradient orbs */}
              <div style={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  width: '384px',
                  height: '384px',
                  background: 'rgba(0, 212, 255, 0.25)',
                  borderRadius: '50%',
                  filter: 'blur(120px)',
                  animation: 'pulse 4s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: '25%',
                  width: '384px',
                  height: '384px',
                  background: 'rgba(147, 51, 234, 0.25)',
                  borderRadius: '50%',
                  filter: 'blur(120px)',
                  animation: 'pulse 6s ease-in-out infinite',
                  animationDelay: '1s',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  width: '384px',
                  height: '384px',
                  background: 'rgba(247, 37, 133, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(120px)',
                  animation: 'pulse 5s ease-in-out infinite',
                  animationDelay: '2s',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '60%',
                  width: '300px',
                  height: '300px',
                  background: 'rgba(255, 107, 53, 0.15)',
                  borderRadius: '50%',
                  filter: 'blur(100px)',
                  animation: 'pulse 7s ease-in-out infinite',
                  animationDelay: '1.5s',
                }} />
              </div>
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <Header />
                <main style={{
                  width: '100%',
                  minHeight: 'calc(100vh - 200px)',
                }}>
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
