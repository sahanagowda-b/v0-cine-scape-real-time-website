-- Enable RLS on movies table (security fix)
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read movies (public read access)
CREATE POLICY "Anyone can read movies" ON movies
  FOR SELECT USING (true);

-- Only authenticated users can insert movies (for caching TMDB data)
CREATE POLICY "Authenticated users can insert movies" ON movies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update movies
CREATE POLICY "Authenticated users can update movies" ON movies
  FOR UPDATE USING (auth.role() = 'authenticated');
