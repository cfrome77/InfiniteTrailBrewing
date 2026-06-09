import { client } from "./sanity";
import { serverClient } from "./sanity.server";

export async function getAllBeers() {
  const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
  try {
    const beers = await activeClient.fetch(`
      *[_type == "beer"] | order(beer_name asc) {
        _id,
        beer_name,
        style,
        status,
        abv,
        ibu,
        is_flagship
      }
    `);
    return beers || [];
  } catch (e) {
    console.error("Error fetching beers:", e);
    return [];
  }
}
