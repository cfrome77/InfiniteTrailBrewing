# AGENTS.md

Repository notes for AI agents and contributors.

## Stack

Next.js 16 App Router, React 19, Sanity v6 (embedded Studio at `/admin/studio`),
Tailwind, Resend for email. Package manager: npm.

## Commands

```bash
npm run dev            # wraps `next dev` via scripts/dev.js
npm run build
npm run lint           # eslint (flat config)
npm test               # jest, tests/unit
npm run test:e2e       # playwright, tests/e2e
npx tsc --noEmit       # typecheck
```

Verify changes with `npx tsc --noEmit`, `npm run lint`, `npm test`, and
`npm run build`. All four should be clean.

## Authentication model

Two independent layers:

1. **Site gate** (`proxy.ts`, cookie `itb_admin_session`). Protects `/admin`
   and everything under it except `/admin/login`. Tokens are HMAC-SHA256
   signed via `lib/admin-session.ts` and expire after 8 hours.
2. **Sanity Studio** still authenticates against Sanity itself. Passing the
   site gate does not grant content-edit rights.

Server Actions are public HTTP endpoints and are **not** covered by the proxy
matcher. Every admin-only action must call `requireAdmin()` from
`lib/admin-guard.ts` as its first statement. `proxy.ts` only guards page
navigation.

`ADMIN_SESSION_SECRET` must be >= 32 chars; shorter or missing fails closed.

## Caching

Sanity reads use tag-based caching (`beers`, `posts`, `beer:<slug>`,
`post:<slug>`) with `revalidate: 86400`. `/api/revalidate` receives Sanity
webhooks, verifies them with `@sanity/webhook` `isValidSignature` against
`SANITY_REVALIDATE_SECRET`, then calls `revalidateTag(..., "max")`.

The signature header is `sanity-webhook-signature` and its value is
`t=<ts>,v1=<base64url-hmac>` — not a hex digest. Do not hand-roll this check.

## Email / unsubscribe

- `GET /api/unsubscribe` never mutates state. Mail scanners and link
  prefetchers fetch every URL in an email, so GET only redirects to
  `/unsubscribe`, where the user confirms and POST performs the opt-out.
- `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058) is sent on
  newsletters; that one-click POST hits the same handler.
- `requestUnsubscribe()` always returns the same message whether or not the
  address exists, to prevent subscriber enumeration.
- `CONTACT_FROM_EMAIL` must be a domain verified in Resend. There is no
  hardcoded fallback sender.

## Supabase keepalive

`/api/unpause` runs daily from `vercel.json` and exists because Supabase
pauses Free Plan projects after a week of low **database** activity. A ping to
the project domain does not count — the handler issues a real PostgREST query
against `SUPABASE_KEEPALIVE_TABLE`, which is why the endpoint lives here even
though this repo's own data layer is Sanity.

Two constraints to keep in mind when changing it:

- **Vercel Hobby allows crons once per day only.** `0 0 * * *` is the most
  frequent legal schedule; anything like `0 * * * *` fails deployment with
  "Hobby accounts are limited to daily cron jobs". That is fine here because
  Supabase needs roughly daily activity, but it is not a fast failover.
- Vercel sends `Authorization: Bearer $CRON_SECRET` and nothing else. The
  handler returns 401 without it and 503 if `CRON_SECRET` is unset.

Do not move this to a GitHub Actions schedule. Scheduled workflows in public
repositories are automatically disabled after 60 days without repository
activity, so the keepalive would stop exactly when a dormant site needs it —
the same dormancy that triggers the Supabase pause. Vercel crons fire
regardless of git activity.

If independence from Vercel is ever wanted, an external pinger (for example
cron-job.org) hitting the same authenticated endpoint daily is the simplest
option. It needs no new code.

Use the **anon** key, not the service role key. The target table should have
RLS enabled with no policies so the query returns zero rows.

## Rate limiting

`lib/rate-limit.ts` is a fixed-window limiter. `rateLimit()` is **async**;
every call site must `await` it.

With `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` set, the counter
lives in Redis and is shared across all serverless instances. Without them it
falls back to per-process memory, where each instance keeps its own counters
and the effective limit is multiplied by the number of warm instances — a speed
bump only. Production should always configure Upstash.

Two deliberate choices in the Upstash path:

- **Fails open.** A Redis error or a 1s timeout falls back to the in-memory
  limiter rather than rejecting the request. The limiter guards public
  endpoints; Redis being down must not take the contact form with it.
- `INCR` then `PEXPIRE` is two commands, so a crash between them leaves a key
  with no TTL. The failure mode is a bucket that stops resetting, not one that
  resets early, which is the safe direction. Do not "fix" this with a Lua
  script unless the extra round trip is measured and acceptable.

The in-memory fallback sweeps once a minute and caps the map at 10,000 entries.
Do not add a per-call sweep: it is O(n) and would run on every request.

Jest needs `moduleNameMapper` entries for `@upstash/redis` and `uncrypto`
because jsdom resolves their browser ESM builds, which Jest cannot parse.

## Conventions

- `components/ui/` holds only the shadcn components actually used (badge,
  button, card, input, label). Add new ones with the shadcn CLI rather than
  copying files in.
- Adjust state during render instead of in an effect when deriving from props
  or router state (`prevX` pattern). The lint rule
  `react-hooks/set-state-in-effect` rejects the effect form.
- `scripts/*.js` are CommonJS Node scripts; `require` is allowed there via an
  eslint override.
