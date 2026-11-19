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
| `/api/unsubscribe` | GET | Token-based unsubscribe link target |

### Cache invalidation

Server-side fetches are tagged (`lib/beers.server.ts`, `lib/blog.server.ts`):

- `/beers` -> `["beers"]`
- `/beers/[slug]` -> `["beer:<slug>", "beers"]`
- `/blog` -> `["posts"]`
- `/blog/[slug]` -> `["post:<slug>", "posts"]`

`/api/revalidate` verifies the `content-signature` header with an HMAC-SHA256 of
the raw body against `SANITY_REVALIDATE_SECRET`, then calls `revalidateTag`. It
responds `503` when the secret is unconfigured and `401` on a missing or invalid
signature, so an unauthenticated caller can never clear the cache.

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

---

## Disclaimer

Infinite Trail Brewing is a private, non-commercial homebrew project. Beers are
crafted for personal documentation, educational exploration, and sharing with
friends and community events, not for commercial sale or public distribution.
