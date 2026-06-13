import AlbumClient from "@/components/AlbumClient";
import { getAlbumBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60; // ISR cache revalidation every 60s

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const album = await getAlbumBySlug(resolvedParams.slug);

  if (!album) {
    return {
      title: "Album Not Found",
    };
  }

  return {
    title: `${album.title}`,
    description: album.description || `Browse photo gallery and cinematic photography of ${album.title} by Aura Studio.`,
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const resolvedParams = await params;
  const album = await getAlbumBySlug(resolvedParams.slug);

  if (!album) {
    notFound();
  }

  return <AlbumClient album={album} />;
}
