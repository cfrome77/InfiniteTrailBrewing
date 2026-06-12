import 'server-only';
import { createClient } from 'next-sanity';
import { client } from './sanity.client';

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

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  token,
});

/**
 * server-only client that automatically uses the SANITY_API_TOKEN if available.
 * Use this in Server Components, API routes, and Server Actions.
 */
export const activeClient = token ? serverClient : client;
