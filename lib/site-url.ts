/**
 * Canonical site origin, without a trailing slash.
 *
 * The same fallback string was repeated in every place that builds an absolute
 * URL, so a domain change meant finding all of them. `NEXT_PUBLIC_SITE_URL` wins
 * when set (preview deployments set it to their own origin, which matters for
 * unsubscribe links mailed from a preview).
 */
const FALLBACK = "https://infinitetrailbrewing.com";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK).replace(/\/+$/, "");
