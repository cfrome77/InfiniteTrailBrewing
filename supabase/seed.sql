
-- =========================
-- BLOG POSTS
-- =========================
insert into public.blog_posts (
  id,
  slug,
  title,
  excerpt,
  content,
  author,
  date,
  read_time,
  category,
  featured,
  is_published,
  created_at,
  updated_at
)
values
(
  gen_random_uuid(),
  'first-brew-log',
  'First Brew Log',
  'A look at our first test batch.',
  'We brewed a test batch today...',
  'Admin',
  current_date,
  '3 min read',
  'brewing',
  true,
  true,
  now(),
  now()
);

-- =========================
-- CURRENT BREWING
-- =========================
insert into public.currently_brewing (
  id,
  beer_name,
  style,
  abv,
  status,
  started_at,
  notes,
  is_active,
  created_at,
  updated_at
)
values
(
  gen_random_uuid(),
  'Trailhead IPA',
  'IPA',
  6.5,
  'fermenting',
  current_date,
  'Hoppy citrus-forward profile',
  true,
  now(),
  now()
);

-- =========================
-- NEWSLETTER
-- =========================
insert into public.newsletter_subscribers (
  id,
  email,
  subscribed_at,
  is_active
)
values
(
  gen_random_uuid(),
  'test@example.com',
  now(),
  true
);