import 'server-only';
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing");
}

// Only log this on the server
if (!token && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn("SANITY_API_TOKEN is missing. Server-side fetches may fail for private datasets.");
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error("CRITICAL: NEXT_PUBLIC_SANITY_DATASET is not set in production. Falling back to 'development' which may cause data isolation issues.");
} else if (process.env.NODE_ENV !== 'production') {
  console.log(`Initializing Sanity Server Client - Project: ${projectId}, Dataset: ${dataset}`);
}

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  token,
});

/**
 * Server-side client for Server Components, route handlers and actions.
 *
 * This is the same authenticated client as `serverClient`; it previously
 * switched to the public browser client when the token was absent, which
 * silently degraded to unauthenticated reads and hid the misconfiguration.
 */
export const activeClient = serverClient;
