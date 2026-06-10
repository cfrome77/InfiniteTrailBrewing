import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schema';
import { NewsletterTool } from './app/admin/newsletter-tool';
import { InventoryTool } from './app/admin/inventory-tool';
import { Mail, Beer } from 'lucide-react';

export default defineConfig({
  name: 'default',
  title: 'Infinite Trail Brewing',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',

  basePath: '/admin/studio',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'inventory',
        title: 'Inventory',
        icon: Beer,
        component: InventoryTool,
      },
      {
        name: 'newsletter',
        title: 'Newsletter',
        icon: Mail,
        component: NewsletterTool,
      },
    ]
  },
});
