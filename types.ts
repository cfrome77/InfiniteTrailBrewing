// types.ts
export type BeerStatus =
  | "on_deck"
  | "fermenting"
  | "conditioning"
  | "finished"
  | "archived";

export interface Beer {
  id: string;
  beer_name: string;
  style: string;
  status: BeerStatus;
  notes?: string | null;
  abv?: string | null;
  is_flagship: boolean;
  started_at: string; // YYYY-MM-DD
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  date: string;
  read_time?: string;
  category?: string;
  featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};
