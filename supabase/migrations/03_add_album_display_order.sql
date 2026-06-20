-- SQL Migration: Add display_order to albums table
-- This script adds a display_order column to the albums table and initializes it for existing records.

-- Add display_order column if it does not exist
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0 NOT NULL;

-- Set sequential display_order for existing albums based on their created_at date (oldest gets 1, newest gets N)
WITH numbered_albums AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM public.albums
)
UPDATE public.albums a
SET display_order = na.row_num
FROM numbered_albums na
WHERE a.id = na.id;

-- Document the column
COMMENT ON COLUMN public.albums.display_order IS 'Determines the visual rendering order of albums in the dashboard and frontend. Lower values display first.';
