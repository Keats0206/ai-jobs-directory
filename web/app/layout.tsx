import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.artificialjobs.dev"),
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  title: {
    default: "Artificial Jobs — Live data on AI hiring, salaries & open roles",
    template: "%s | Artificial Jobs",
  },
  description:
    "Who is hiring AI engineers, what they pay, and which skills are in demand, from thousands of postings verified daily on company job boards.",
  openGraph: {
    type: "website",
    siteName: "Artificial Jobs",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Artificial Jobs — Live data on AI hiring",
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
      <body className="flex min-h-full flex-col bg-background text-foreground page-wash">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
