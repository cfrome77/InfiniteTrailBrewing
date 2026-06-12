import 'server-only';
import { activeClient } from "./sanity.server";
import { Beer } from "@/types";
import { ALL_BEERS_QUERY, BEERS_PAGE_QUERY, BEER_BY_SLUG_QUERY, ALL_BEER_SLUGS_QUERY } from "./beers";

export async function getAllBeers(): Promise<Beer[]> {
  try {
    const beers = await activeClient.fetch(ALL_BEERS_QUERY);
    return beers || [];
  } catch (e) {
    console.error("Error fetching beers:", e);
    return [];
  }
}

export async function getBeersForPage(): Promise<Beer[]> {
  try {
    const beers = await activeClient.fetch(BEERS_PAGE_QUERY);
    return beers || [];
  } catch (e) {
    console.error("Error fetching beers for page:", e);
    return [];
  }
}

export async function getBeerBySlug(slug: string): Promise<Beer | null> {
  try {
    const beer = await activeClient.fetch(BEER_BY_SLUG_QUERY, { slug });
    return beer || null;
  } catch (e) {
    console.error("Error fetching beer by slug:", e);
    return null;
  }
}

export async function getAllBeerSlugs(): Promise<string[]> {
  try {
    const slugs = await activeClient.fetch(ALL_BEER_SLUGS_QUERY);
    return slugs || [];
  } catch (e) {
    console.error("Error fetching beer slugs:", e);
    return [];
  }
}
