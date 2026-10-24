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
  },
  twitter: {
    card: "summary_large_image",
  },
};

const SITE_URL = "https://www.artificialjobs.dev";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Artificial Jobs",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      description:
        "Directory of paid AI training jobs for domain experts and data partnerships for companies, sourced from micro1.",
      parentOrganization: { "@type": "Organization", name: "Keating Holdings", url: "https://keatingholdings.com" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Artificial Jobs",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        {/* React hoists this into <head>; set here because page-level `alternates` would replace a metadata version. */}
        <link rel="alternate" type="application/rss+xml" title="Artificial Jobs blog" href="/blog/feed.xml" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
