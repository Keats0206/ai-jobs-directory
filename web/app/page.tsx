import type { Metadata } from "next";
import { Container } from '@/components/page-shell';
import { SiteFooter } from '@/components/site-footer';
import { HomeBoard } from '@/components/home-board';
import { GeoContent } from '@/components/geo-content';

export const metadata: Metadata = {
  title: 'AI Engineering Jobs — Remote Roles, Salaries & Companies',
  description: 'Find AI engineering jobs at AI labs, startups, and technology companies. Browse remote roles, published salary ranges, and direct employer applications.',
  alternates: { canonical: "https://www.artificialjobs.dev" },
};

export default function Home() {
  return (
    <>
      <HomeBoard />
      <Container className="pb-16">
        <GeoContent url="/" />
      </Container>
      <SiteFooter />
    </>
  );
}
