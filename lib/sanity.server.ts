import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing");
}

if (!token && process.env.NODE_ENV !== 'production') {
  console.warn("SANITY_API_TOKEN is missing. Server-side fetches may fail for private datasets.");
}

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  token,
});
