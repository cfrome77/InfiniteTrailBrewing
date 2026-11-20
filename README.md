# Infinite Trail Brewing

A non-commercial homebrew project site built with **Next.js 16** (App Router),
**Sanity.io**, **Tailwind CSS v4**, and **Resend**.

---

## Stack

| Concern | Implementation |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Server Components, Server Actions) |
| CMS | Sanity.io (`sanity/schema/`) with embedded Studio at `/admin/studio` |
| Styling | Tailwind CSS v4 with brand tokens in `app/globals.css` |
| Email | Resend (`lib/resend.ts`) |
| Tests | Jest (unit) and Playwright (e2e) |

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Homepage: hero, brewery pillars, featured brews |
| `/beers` | The Brew Log — filterable catalog of batches |
| `/beers/[slug]` | Individual beer: specs, tasting notes, telemetry |
| `/beers/archive` | Brew Archive — retired batches |
| `/blog` | Brew log notes |
| `/blog/[slug]` | Individual article |
| `/our-story` | About the brewery |
| `/contact` | Contact form |
| `/unsubscribe` | Token-based unsubscribe |
| `/admin` | Redirects to `/admin/studio` |
| `/admin/login` | Password login for the admin area |
| `/admin/studio` | Embedded Sanity Studio |

`/telemetry` is a legacy path that redirects to `/beers`. Telemetry data
(pH, gravity, water profile, kettle schedule) is stored on the `beer` document
and rendered on `/beers/[slug]`; there is no standalone telemetry console.

---

## API routes

| Route | Method | Notes |
| --- | --- | --- |
| `/api/contact` | POST | Validates, rate limits per IP, sends via Resend |
| `/api/revalidate` | POST | Sanity webhook; HMAC-verified, fail-closed |
| `/api/unsubscribe` | GET, POST | Token-based unsubscribe. `GET` is the link target (redirects to `/unsubscribe`); `POST` is the RFC 8058 one-click target and returns `200` without redirecting |

### Generated routes

| Route | Notes |
| --- | --- |
| `/sitemap.xml` | Built from the same slug queries the pages use, so the draft and publish filters apply automatically |
| `/robots.txt` | Disallows `/admin` and `/api/`; Studio and the login page also send `noindex` |
| `/opengraph-image` | Generated 1200x630 social card; beer and post pages have their own at `<path>/opengraph-image` |

### Page metadata

Every page declares its own `title` and `description`. List pages use
`pageMetadata()` from `lib/metadata.ts`; the two detail pages use
`generateMetadata()` so the title and description come from the CMS document.
Blog posts honour an editor-supplied `seo.title` / `seo.description` when set.

`pageMetadata()` exists because a page that sets `openGraph` replaces the
parent's object instead of merging into it, which silently drops the inherited
social card. The helper always emits `images`, so a page cannot lose its
`og:image`. The root layout supplies the `%s | Infinite Trail Brewing` template,
so child pages pass a bare title.

Both derive their origin from `lib/site-url.ts`, which reads
`NEXT_PUBLIC_SITE_URL` and falls back to the production domain. That module is
also the single source for the absolute links in outbound email.

### Cache invalidation

Server-side fetches are tagged (`lib/beers.server.ts`, `lib/blog.server.ts`):

- `/beers` -> `["beers"]`
- `/beers/[slug]` -> `["beer:<slug>", "beers"]`
- `/blog` -> `["posts"]`
- `/blog/[slug]` -> `["post:<slug>", "posts"]`

`/api/revalidate` verifies Sanity's `sanity-webhook-signature` header the same
way `@sanity/webhook` does: HMAC-SHA256 over `"<timestamp>.<raw body>"`,
base64url encoded, compared in constant time. It then calls `revalidateTag`.
It responds `503` when the secret is unconfigured and `401` on a missing,
malformed or invalid signature, so an unauthenticated caller can never clear
the cache.

Configure the Sanity webhook with:

- **URL**: `https://<site>/api/revalidate`
- **Secret**: the same value as `SANITY_REVALIDATE_SECRET`
- **Projection**: at minimum `{_type, _id, "slug": slug.current}`
- **Filter**: `_type in ["beer", "post"]`

Draft documents (`_id` starting with `drafts.`) are acknowledged but do not
revalidate, because Studio autosaves continuously and would otherwise purge the
cache on every keystroke.

The legacy `content-signature` header (bare hex HMAC of the body) is still
accepted so a webhook configured against the previous format keeps working
during migration. Remove that branch once all webhooks are on Sanity signing.

---

## Admin access

The admin area is gated by `proxy.ts` (middleware) using a signed session cookie
issued by `app/actions/admin-auth.ts`.

- Authentication is a **shared password** (`ADMIN_LOGIN_PASSWORD`), not Sanity
  SSO credentials. The password is compared in constant time
  (`lib/constant-time.ts`) and the session token is signed with
  `ADMIN_SESSION_SECRET`.
- Server Actions that mutate data re-check the session server-side via
  `requireAdmin` (`lib/admin-auth.ts`). Hiding UI is never the security
  boundary: invoking an action directly still requires a valid session.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Usually `production` |
| `SANITY_API_TOKEN` | yes | Server-side reads and writes |
| `SANITY_REVALIDATE_SECRET` | yes | HMAC secret for `/api/revalidate` |
| `NEXT_PUBLIC_SITE_URL` | yes | Absolute URL used in emails |
| `NEXT_PUBLIC_CONTACT_EMAIL` | yes | Public contact address |
| `NEXT_PUBLIC_FOURTHWALL_SHOP_URL` | no | External shop link |
| `RESEND_API_KEY` | yes | Email delivery |
| `CONTACT_RECEIVING_EMAIL` | yes | Contact-form recipient |
| `ADMIN_LOGIN_PASSWORD` | yes | Admin area password |
| `ADMIN_SESSION_SECRET` | yes | Signs the admin session cookie |

When `RESEND_API_KEY` is absent, email-dependent features degrade to explicit
`503`/error responses rather than silently reporting success.

---

## Getting started

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Log in at `/admin/login`.

---

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build (type checking enabled)
npm run start      # serve the production build
npm run lint       # eslint; expected to report 0 warnings
npm run typecheck  # tsc --noEmit
npm test           # jest unit tests
npm run test:e2e   # playwright (production build when CI=true)
```

CI runs lint, typecheck, unit tests, build, and e2e; see
`.github/workflows/ci.yml`.

---

## Content model

- **`beer`** (`sanity/schema/beer.ts`): split into **Lab Specs** and
  **Commercial Info** tabs. Commercial fields are hidden unless
  `isCommercialProduct` is enabled. Telemetry (gravity, water chemistry, kettle
  schedule) is optional; the beer page falls back to style-based defaults when
  it is absent.
- **`post`**: blog articles with Portable Text bodies.
- **`subscriber`**: newsletter subscribers with `status`
  (`subscribed`/`unsubscribed`) and a `token` used for unsubscribe links.

Every outbound newsletter email carries `List-Unsubscribe` and
`List-Unsubscribe-Post: List-Unsubscribe=One-Click`, so a mail client can
unsubscribe a recipient without them opening a page. The `POST` handler exists
for that; it must not redirect, because the client only reads the status code.

Subscribers created by hand in Studio have no `token`, so they are skipped by a
send and counted in the result message rather than mailed a link that would
fail.

---

## Disclaimer

Infinite Trail Brewing is a private, non-commercial homebrew project. Beers are
crafted for personal documentation, educational exploration, and sharing with
friends and community events, not for commercial sale or public distribution.
