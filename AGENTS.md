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

## Rate limiting

`lib/rate-limit.ts` is an in-memory fixed-window limiter. It is per-instance:
on multi-instance or serverless deployments each instance keeps its own
counters, so treat it as a speed bump, not a guarantee. Anything stronger
needs an edge/WAF limiter or a shared store.

## Conventions

- `components/ui/` holds only the shadcn components actually used (badge,
  button, card, input, label). Add new ones with the shadcn CLI rather than
  copying files in.
- Adjust state during render instead of in an effect when deriving from props
  or router state (`prevX` pattern). The lint rule
  `react-hooks/set-state-in-effect` rejects the effect form.
- `scripts/*.js` are CommonJS Node scripts; `require` is allowed there via an
  eslint override.
