import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schema';
import dynamic from 'next/dynamic';
import { Mail, Beer, LogOut } from 'lucide-react';

const InventoryTool = dynamic(() => import('./app/admin/inventory-tool').then(mod => mod.InventoryTool), { ssr: false });
const NewsletterTool = dynamic(() => import('./app/admin/newsletter-tool').then(mod => mod.NewsletterTool), { ssr: false });
const LogoutTool = dynamic(() => import('./app/admin/logout-tool').then(mod => mod.LogoutTool), { ssr: false });

const schema = {
  types: schemaTypes,
};

const plugins = [
  deskTool(),
  visionTool(),
];

export default defineConfig({
  name: 'default',
  title: 'Infinite Trail Brewing',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pzzfhnzk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',

  basePath: '/admin/studio',

  plugins,
  schema,

  tools: (prev) => [
    ...prev,
    {
      name: 'inventory',
      title: 'Inventory',
      icon: Beer,
      component: InventoryTool,
    } as any,
    {
      name: 'newsletter',
      title: 'Newsletter',
      icon: Mail,
      component: NewsletterTool,
    } as any,
    {
      name: 'logout',
      title: 'Sign Out',
      icon: LogOut,
      component: LogoutTool,
    } as any,
  ],
});
