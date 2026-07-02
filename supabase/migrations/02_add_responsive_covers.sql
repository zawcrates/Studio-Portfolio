-- SQL Migration: Add Desktop and Mobile Responsive Cover Images
-- This script adds desktop_cover_image and mobile_cover_image columns to the albums table.
-- It keeps existing cover_image values intact as the default fallback.

-- Add columns if they do not exist
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS desktop_cover_image TEXT;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS mobile_cover_image TEXT;

-- Document the columns
COMMENT ON COLUMN public.albums.desktop_cover_image IS 'Optional separate cover image for desktop displays. Falls back to mobile_cover_image or cover_image.';
COMMENT ON COLUMN public.albums.mobile_cover_image IS 'Optional separate cover image for mobile displays. Falls back to desktop_cover_image or cover_image.';
