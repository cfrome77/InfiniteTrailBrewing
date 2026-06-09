import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schema';
import { NewsletterTool } from './app/admin/newsletter-tool';
import { Mail, LayoutDashboard } from 'lucide-react';

export default defineConfig({
  name: 'default',
  title: 'Infinite Trail Brewing',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',

  basePath: '/admin',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  tools: (prev) => {
    return [
      {
        name: 'newsletter',
        title: 'Newsletters',
        icon: Mail,
        component: NewsletterTool,
      },
      ...prev,
    ]
  },
});
