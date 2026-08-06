import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.artificialjobs.dev"),
  title: {
    default: "AI Jobs Directory — Engineering roles at LLM labs & AI startups",
    template: "%s | AI Jobs Directory",
  },
  description:
    "Open AI engineering roles at LLM labs, AI startups, and infra companies. Search by skill, location, and salary. Updated daily.",
  openGraph: {
    type: "website",
    siteName: "AI Jobs Directory",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
