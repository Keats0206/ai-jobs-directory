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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <footer className="border-t border-border mt-16 py-6">
          <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-xs text-muted">
            <span>&copy; {new Date().getFullYear()} Artificial Jobs</span>
            <div className="flex items-center gap-4">
              <a href="https://hot100ai.dev" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">AI Tools Directory</a>
              <span>&middot;</span>
              <a href="https://keatingholdings.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Keating Holdings</a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
