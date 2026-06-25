import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set, using fallback: pzzfhnzk");
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error("CRITICAL: NEXT_PUBLIC_SANITY_DATASET is not set in production. Falling back to 'development' which may cause data isolation issues.");
} else if (process.env.NODE_ENV !== 'production') {
  console.log(`Initializing Sanity Client - Project: ${projectId}, Dataset: ${dataset}`);
}

export const config = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
};

export const client = createClient(config);

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
