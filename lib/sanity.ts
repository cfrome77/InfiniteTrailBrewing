import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const config = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Needed for mutations
};

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
