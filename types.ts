// types.ts

/**
 * These types act as the "Frontend Contract" for data coming from Sanity.
 * They should be kept in sync with the schemas in /sanity/schema/
 */

export type BeerStatus =
  | "on_deck"
  | "brewing"
  | "ready"
  | "archived";

export interface TastingNotes {
  aroma?: string;
  flavor?: string;
  mouthfeel?: string;
}

export interface WaterProfile {
  ph?: number;
  sulfate?: number;
  chloride?: number;
  calcium?: number;
  waterNotes?: string;
}

export interface KettleAddition {
  time: string;
  label: string;
}

export interface Telemetry {
  currentGravity?: number;
  targetFg?: number;
  waterProfile?: WaterProfile;
  kettleSchedule?: KettleAddition[];
}

export interface BeerStyle {
  _id: string;
  title: string;
  slug: string;
  defaultTelemetry?: Telemetry;
}

export interface Beer {
  _id: string;
  id: string; // Map of _id
  beer_name: string;
  slug: string; // Mapped to slug.current in GROQ
  style: BeerStyle | string; // Server-resolved beer style reference or standard string style
  brewery?: string;
  status: BeerStatus;
  notes?: string | null; // General description
  abv?: number | null;
  ibu?: number | null;
  tastingNotes?: TastingNotes;
  brewDate?: string;
  batchNumber?: string;
  ingredients?: string;
  notableHops?: string[];
  is_flagship: boolean;
  image?: any; // Sanity image object (use with urlFor)
  relatedPosts?: any[]; // References to BlogPost documents
  telemetry?: Telemetry; // Optional Kettle & Cellar telemetry logs
  _createdAt?: string;

  // Coalesced/resolved presentation fields calculated in GROQ server-side
  resolvedPh: string;
  resolvedSulfate: number;
  resolvedChloride: number;
  resolvedCalcium: number;
  resolvedWaterNotes: string;
  resolvedKettleSchedule: KettleAddition[];
  resolvedCurrentSg: string;
  resolvedFg: string;
  resolvedOg: string;
}

export interface SEOFields {
  title?: string;
  description?: string;
}

export type BlogPost = {
  _id: string;
  id: string; // Map of _id
  slug: string; // Mapped to slug.current in GROQ
  title: string;
  excerpt: string;
  content: any | any[]; // Support both markdown string and portable text
  visibility?: 'website' | 'newsletter' | 'both';
  tags?: string[];
  author?: string;
  date: string;
  read_time?: string;
  category?: string;
  featured: boolean;
  is_published: boolean;
  image?: any; // Featured Image
  relatedBeers?: any[]; // References to Beer documents
  seo?: SEOFields;
  created_at?: string;
  updated_at?: string;
};

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed';
  subscribedAt: string;
  token: string; // Unique UUID for unsubscription
}
