<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Verification commands

Run all of these before considering a change complete. CI runs the same set
(`.github/workflows/ci.yml`).

```bash
npm run lint       # eslint, flat config in eslint.config.mjs — must be 0 warnings
npm run typecheck  # tsc --noEmit
npm test           # jest unit tests
npm run build      # production build (type checking is NOT skipped)
npm run test:e2e   # playwright; uses a production build when CI=true
```

## Project-specific notes

- **ESLint** uses flat config importing `eslint-config-next/core-web-vitals`
  directly. `FlatCompat` fails against it ("Converting circular structure to
  JSON"). The `@typescript-eslint` plugin is scoped to `**/*.ts(x)`, so rules
  for it must declare the same `files` glob.
- **Jest** must transform `@portabletext/to-html` (ESM-only). `next/jest`
  prepends its own `transformIgnorePatterns`, so `jest.config.ts` overrides the
  resolved config rather than passing it through the factory.
- **Sanity schemas** default-export schema objects by convention; the
  `import/no-anonymous-default-export` rule is disabled for `sanity/schema/`.
- **`next-env.d.ts`** churn is normalized by `scripts/stabilize-env.js`
  (`postbuild` and `dev`). `*.tsbuildinfo` is a build artifact and is ignored.
- **Admin Server Actions** authorize server-side via `lib/admin-auth.ts`
  (`requireAdmin`); the Sanity Studio UI is not the security boundary.
- **Revalidation** is HMAC-verified and fail-closed: 503 when
  `SANITY_REVALIDATE_SECRET` is unset, 401 on missing/invalid signature.
