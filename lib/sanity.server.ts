import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing");
}

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  token,
});
