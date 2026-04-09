-- ============================================
-- Migration: Initialize all tables for project
-- ============================================

-- ================================
-- Contact Form Submissions Table
-- ================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON contact_submissions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public select" ON contact_submissions
    FOR SELECT
    USING (true);

-- ================================
-- Newsletter Subscribers Table
-- ================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public select" ON newsletter_subscribers
    FOR SELECT
    USING (true);

-- ================================
-- Currently Brewing Table
-- ================================
CREATE TABLE IF NOT EXISTS currently_brewing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beer_name TEXT NOT NULL,
    style TEXT NOT NULL,
    abv NUMERIC(5,2),
    status TEXT NOT NULL DEFAULT 'fermenting',
    started_at DATE NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE currently_brewing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON currently_brewing
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert" ON currently_brewing
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update" ON currently_brewing
    FOR UPDATE
    USING (true);

-- ================================
-- Blog Posts Table
-- ================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    date DATE NOT NULL,
    read_time TEXT,
    category TEXT,
    featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON blog_posts
    FOR SELECT
    USING (true);