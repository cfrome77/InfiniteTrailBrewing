-- ============================================
-- Migration: Initialize all tables (schema only)
-- ============================================

-- Enable required extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- Contact Form Submissions
-- ================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- Newsletter Subscribers
-- ================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- ================================
-- Currently Brewing
-- ================================
CREATE TABLE IF NOT EXISTS currently_brewing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beer_name TEXT NOT NULL,
    style TEXT NOT NULL,
    abv TEXT,
    status TEXT NOT NULL DEFAULT 'fermenting',
    started_at DATE NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_flagship BOOLEAN DEFAULT FALSE,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- Blog Posts
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