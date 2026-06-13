-- Enable pgcrypto if not already enabled (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create trigger function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create photos table (referenced to albums with cascade deletes)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  features TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT,
  event_date DATE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- CREATE PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_albums_slug ON albums(slug);
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_display_order ON photos(album_id, display_order);
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- ==========================================
-- ATTACH AUTO-UPDATE TIMESTAMPS TRIGGERS
-- ==========================================

-- Albums
DROP TRIGGER IF EXISTS update_albums_modtime ON albums;
CREATE TRIGGER update_albums_modtime
  BEFORE UPDATE ON albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Photos
DROP TRIGGER IF EXISTS update_photos_modtime ON photos;
CREATE TRIGGER update_photos_modtime
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Hero Images
DROP TRIGGER IF EXISTS update_hero_images_modtime ON hero_images;
CREATE TRIGGER update_hero_images_modtime
  BEFORE UPDATE ON hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Services
DROP TRIGGER IF EXISTS update_services_modtime ON services;
CREATE TRIGGER update_services_modtime
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inquiries
DROP TRIGGER IF EXISTS update_inquiries_modtime ON inquiries;
CREATE TRIGGER update_inquiries_modtime
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
