import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const display = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.artificialjobs.dev"),
  title: {
    default: "Artificial Jobs — Get paid to train AI with your expertise",
    template: "%s | Artificial Jobs",
  },
  description:
    "Paid AI training jobs for lawyers, doctors, engineers, scientists and linguists, plus data partnerships for companies. Refreshed daily.",
  openGraph: {
    type: "website",
    siteName: "Artificial Jobs",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Artificial Jobs — Get paid to train AI",
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
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
