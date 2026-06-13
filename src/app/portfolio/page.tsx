import PortfolioClient from "@/components/PortfolioClient";
import { getAlbums } from "@/lib/data";
import { Metadata } from "next";

export const revalidate = 60; // ISR cache revalidation every 60s

export const metadata: Metadata = {
  title: "Galleries & Albums",
  description: "Explore our premium photography portfolio including weddings, engagements, events, and corporate photoshoots captured by Aura Studio.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialCategory = typeof resolvedParams.category === "string" ? resolvedParams.category : "all";
  const albums = await getAlbums();

  return <PortfolioClient albums={albums} initialCategory={initialCategory} />;
}
