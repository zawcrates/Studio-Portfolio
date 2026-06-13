import HomeClient from "@/components/HomeClient";
import { getHeroImages, getAlbums } from "@/lib/data";
import { SERVICES, TESTIMONIALS } from "@/lib/mockData";

export const revalidate = 60; // ISR cache revalidation every 60s

export default async function Home() {
  const heroImages = await getHeroImages();
  const albums = await getAlbums();

  return (
    <HomeClient
      heroImages={heroImages}
      featuredAlbums={albums}
      services={SERVICES}
      testimonials={TESTIMONIALS}
    />
  );
}
