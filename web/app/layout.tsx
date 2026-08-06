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
    default: "Artificial Jobs — AI coding agents, MCP directory & engineering roles",
    template: "%s | Artificial Jobs",
  },
  description:
    "Compare AI coding agents, browse MCP servers and agent plugins, and find AI engineering jobs. Rankings, head-to-head comparisons, and agentic dev tools for developers.",
  openGraph: {
    type: "website",
    siteName: "Artificial Jobs",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Artificial Jobs — Agentic dev tools and AI engineering jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.svg"],
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
