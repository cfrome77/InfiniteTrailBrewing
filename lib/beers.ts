export const ALL_BEERS_QUERY = `
  *[_type == "beer" && !(_id in path("drafts.**"))] | order(beer_name asc) {
    _id,
    "id": _id,
    beer_name,
    "slug": slug.current,
    style,
    brewery,
    status,
    notes,
    abv,
    ibu,
    tastingNotes,
    is_flagship,
    image,
    telemetry,
    _createdAt
  }
`;

export const BEERS_PAGE_QUERY = `
  *[_type == "beer" && !(_id in path("drafts.**"))] | order(beer_name asc) {
    _id,
    "id": _id,
    beer_name,
    "slug": slug.current,
    style,
    brewery,
    status,
    notes,
    abv,
    ibu,
    tastingNotes,
    is_flagship,
    image,
    telemetry,
    _createdAt
  }
`;

export const BEER_BY_SLUG_QUERY = `
  *[_type == "beer" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    "id": _id,
    beer_name,
    "slug": slug.current,
    style,
    brewery,
    status,
    notes,
    abv,
    ibu,
    tastingNotes,
    is_flagship,
    image,
    telemetry,
    "relatedPosts": *[_type == "post" && references(^._id) && !(_id in path("drafts.**"))] {
      _id,
      title,
      "slug": slug.current,
      image,
      date
    }
  }
`;

export const ALL_BEER_SLUGS_QUERY = `
  *[_type == "beer" && !(_id in path("drafts.**"))].slug.current
`;
