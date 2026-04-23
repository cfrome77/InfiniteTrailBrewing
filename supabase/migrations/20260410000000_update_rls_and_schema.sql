-- Ensure RLS is enabled
ALTER TABLE currently_brewing ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Update currently_brewing table schema
ALTER TABLE public.currently_brewing
    ALTER COLUMN abv TYPE TEXT,
    ALTER COLUMN status SET DEFAULT 'on_deck',
    ADD COLUMN IF NOT EXISTS is_flagship BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS color TEXT;

-- Ensure blog_posts has updated_at
ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update RLS policies for currently_brewing
DROP POLICY IF EXISTS "Allow public select" ON currently_brewing;
DROP POLICY IF EXISTS "Allow public insert" ON currently_brewing;
DROP POLICY IF EXISTS "Allow public update" ON currently_brewing;
DROP POLICY IF EXISTS "Allow admin manage" ON currently_brewing;

CREATE POLICY "Allow public select" ON currently_brewing
    FOR SELECT
    USING (true);

CREATE POLICY "Allow admin manage" ON currently_brewing
    FOR ALL
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Update RLS policies for blog_posts
DROP POLICY IF EXISTS "Allow public select" ON blog_posts;
DROP POLICY IF EXISTS "Allow admin manage" ON blog_posts;

CREATE POLICY "Allow public select" ON blog_posts
    FOR SELECT
    USING (true);

CREATE POLICY "Allow admin manage" ON blog_posts
    FOR ALL
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
