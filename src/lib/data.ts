import { supabase } from './supabase';
import { MOCK_HERO_IMAGES, MOCK_ALBUMS, SERVICES, Album, HeroImage, Service } from './mockData';

// Helper to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && !url.includes('placeholder') && !key.includes('placeholder');
};

export async function getHeroImages(): Promise<HeroImage[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_HERO_IMAGES;
  }

  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('id, image_url, display_order')
      .order('display_order', { ascending: true });

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.error('Error fetching hero images from Supabase, falling back to mock data:', error);
  }

  return MOCK_HERO_IMAGES;
}

export async function getAlbums(): Promise<Album[]> {
  if (!isSupabaseConfigured()) {
    return [...MOCK_ALBUMS].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  try {
    const { data: albumsData, error: albumsError } = await supabase
      .from('albums')
      .select('*, photos(id, image_url)')
      .order('display_order', { ascending: true })
      .order('created_at', { foreignTable: 'photos', ascending: true });

    if (albumsError) throw albumsError;

    if (albumsData && albumsData.length > 0) {
      return albumsData;
    }
  } catch (error) {
    console.error('Error fetching albums from Supabase, falling back to mock data:', error);
  }

  return [...MOCK_ALBUMS].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (!isSupabaseConfigured()) {
    const mockAlbum = MOCK_ALBUMS.find((a) => a.slug === slug);
    return mockAlbum || null;
  }

  try {
    const { data: album, error } = await supabase
      .from('albums')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      // Try mock data
      const mockAlbum = MOCK_ALBUMS.find((a) => a.slug === slug);
      if (mockAlbum) return mockAlbum;
      throw error;
    }

    if (album) {
      const { data: photos } = await supabase
        .from('photos')
        .select('id, image_url')
        .eq('album_id', album.id)
        .order('created_at', { ascending: true });

      return {
        ...album,
        photos: photos || [],
      };
    }
  } catch (error) {
    console.error(`Error fetching album with slug ${slug}:`, error);
    // Fall back to mock data
    const mockAlbum = MOCK_ALBUMS.find((a) => a.slug === slug);
    return mockAlbum || null;
  }

  return null;
}

export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return SERVICES;
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        longDescription: item.long_description,
        coverImage: item.cover_image,
        features: item.features || [],
      }));
    }
  } catch (error) {
    console.error('Error fetching services from Supabase, falling back to mock data:', error);
  }

  return SERVICES;
}
