export const ALL_BEERS_QUERY = `
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
`;

export const BEERS_PAGE_QUERY = `
  *[_type == "beer"] | order(_createdAt desc) {
    _id,
    "id": _id,
    beer_name,
    "slug": slug.current,
    style,
    status,
    notes,
    abv,
    is_flagship,
    _createdAt,
    image
  }
`;

export const BEER_BY_SLUG_QUERY = `
  *[_type == "beer" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    "relatedPosts": *[_type == "post" && references(^._id) && is_published == true] {
        _id,
        title,
        "slug": slug.current,
        date,
        image
    }
  }
`;

export const ALL_BEER_SLUGS_QUERY = `
  *[_type == "beer" && defined(slug.current)].slug.current
`;
