// types.ts
export type BeerStatus =
  | "on_deck"
  | "brewing"
  | "ready"
  | "archived";

export interface Beer {
  id: string;
  _id?: string; // Sanity ID
  beer_name: string;
  style: string;
  status: BeerStatus;
  notes?: string | null;
  abv?: string | null;
  color?: string | null; 
  is_flagship: boolean;
  image?: any; // Sanity image object
}

export type BlogPost = {
  id: string;
  _id?: string; // Sanity ID
  slug: string;
  title: string;
  excerpt: string;
  content: string | any[]; // Markdown string or Sanity Portable Text
  author?: string;
  date: string;
  read_time?: string;
  category?: string;
  featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};
