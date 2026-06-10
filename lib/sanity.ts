import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set, using fallback: pzzfhnzk");
}

export const config = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
};

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
