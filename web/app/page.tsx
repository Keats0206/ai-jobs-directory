import { Container } from '@/components/page-shell';
import { SiteFooter } from '@/components/site-footer';
import { HomeBoard } from '@/components/home-board';
import { GeoContent } from '@/components/geo-content';

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
