import type { Metadata } from "next";
import { Container } from '@/components/page-shell';
import { SiteFooter } from '@/components/site-footer';
import { AgentsHubPage } from '@/components/agents-hub-page';
import { GeoContent } from '@/components/geo-content';

export const metadata: Metadata = {
  alternates: { canonical: "https://www.artificialjobs.dev/agents" },
};

export default function AgentsPage() {
  return (
    <>
      <AgentsHubPage />
      <Container className="-mt-8 pb-16">
        <GeoContent url="/agents" className="mt-0 border-t border-border/60 pt-12" />
      </Container>
      <SiteFooter />
    </>
  );
}
