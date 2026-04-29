-- ============================================
-- Migration: RLS + Policies + Schema Updates
-- ============================================

-- ============================================
-- Enable Row Level Security (ALL TABLES)
-- ============================================
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currently_brewing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Schema adjustments (safe migrations)
-- ============================================

-- Currently Brewing adjustments
ALTER TABLE public.currently_brewing
    ALTER COLUMN status SET DEFAULT 'on_deck';

-- Blog posts safety column (idempotent)
ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- Helper concept: admin role check
-- (used consistently across policies)
-- ============================================
-- auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'

-- ============================================
-- CONTACT SUBMISSIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "admin_full_access_contact" ON contact_submissions;

CREATE POLICY "admin_full_access_contact"
ON contact_submissions
FOR ALL
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ============================================
-- NEWSLETTER SUBSCRIBERS POLICIES (SECURE)
-- ============================================

-- Allow public signup only (INSERT)
DROP POLICY IF EXISTS "newsletter_public_insert" ON newsletter_subscribers;
CREATE POLICY "newsletter_public_insert"
ON newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Block public reads (protect emails)
DROP POLICY IF EXISTS "newsletter_block_select" ON newsletter_subscribers;
CREATE POLICY "newsletter_block_select"
ON newsletter_subscribers
FOR SELECT
USING (false);

-- Admin full access
DROP POLICY IF EXISTS "newsletter_admin_all" ON newsletter_subscribers;
CREATE POLICY "newsletter_admin_all"
ON newsletter_subscribers
FOR ALL
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ============================================
-- CURRENTLY BREWING POLICIES
-- ============================================

DROP POLICY IF EXISTS "brewing_public_select" ON currently_brewing;
DROP POLICY IF EXISTS "brewing_admin_all" ON currently_brewing;

CREATE POLICY "brewing_public_select"
ON currently_brewing
FOR SELECT
USING (true);

CREATE POLICY "brewing_admin_all"
ON currently_brewing
FOR ALL
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ============================================
-- BLOG POSTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "blog_public_select" ON blog_posts;
DROP POLICY IF EXISTS "blog_admin_all" ON blog_posts;

CREATE POLICY "blog_public_select"
ON blog_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "blog_admin_all"
ON blog_posts
FOR ALL
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ============================================
-- CONTACT FORM OPTIONAL PUBLIC INSERT (if needed)
-- ============================================
-- If contact form is public-facing, enable this:

DROP POLICY IF EXISTS "contact_public_insert" ON contact_submissions;

CREATE POLICY "contact_public_insert"
ON contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);