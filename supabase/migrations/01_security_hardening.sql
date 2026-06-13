-- 1. Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Trigger function to automatically register Srikanth as admin when auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'srikanth11022008@gmail.com' THEN
    INSERT INTO public.admins (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed existing user if already registered in auth.users
INSERT INTO public.admins (id, email)
SELECT id, email
FROM auth.users
WHERE email = 'srikanth11022008@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Clean up existing policies for rerun safety
DROP POLICY IF EXISTS "Allow users to read their own admin record" ON public.admins;
DROP POLICY IF EXISTS "Allow public read access to albums" ON public.albums;
DROP POLICY IF EXISTS "Allow admin write access to albums" ON public.albums;
DROP POLICY IF EXISTS "Allow public read access to photos" ON public.photos;
DROP POLICY IF EXISTS "Allow admin write access to photos" ON public.photos;
DROP POLICY IF EXISTS "Allow public read access to hero_images" ON public.hero_images;
DROP POLICY IF EXISTS "Allow admin write access to hero_images" ON public.hero_images;
DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;
DROP POLICY IF EXISTS "Allow admin write access to services" ON public.services;
DROP POLICY IF EXISTS "Allow admin read access to inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow admin update access to inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow admin delete access to inquiries" ON public.inquiries;

-- 5. Define policies

-- Policy: admins
CREATE POLICY "Allow users to read their own admin record" ON public.admins
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Policies: albums
CREATE POLICY "Allow public read access to albums" ON public.albums
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin write access to albums" ON public.albums
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Policies: photos
CREATE POLICY "Allow public read access to photos" ON public.photos
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin write access to photos" ON public.photos
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Policies: hero_images
CREATE POLICY "Allow public read access to hero_images" ON public.hero_images
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin write access to hero_images" ON public.hero_images
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Policies: services
CREATE POLICY "Allow public read access to services" ON public.services
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin write access to services" ON public.services
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Policies: inquiries
CREATE POLICY "Allow admin read access to inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Allow admin update access to inquiries" ON public.inquiries
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Allow admin delete access to inquiries" ON public.inquiries
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );
