import { client } from "./sanity";
import { serverClient } from "./sanity.server";
import { Beer } from "@/types";

export async function getAllBeers(): Promise<Beer[]> {
  const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
  try {
    const beers = await activeClient.fetch(`
      *[_type == "beer"] | order(beer_name asc) {
        _id,
        "id": _id,
        beer_name,
        "slug": slug.current,
        style,
        brewery,
        status,
        abv,
        ibu,
        is_flagship,
        notes,
        tastingNotes,
        image
      }
    `);
    return beers || [];
  } catch (e) {
    console.error("Error fetching beers:", e);
    return [];
  }
}
