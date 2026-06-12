export const ALL_POSTS_QUERY = `
  *[_type == "post" && is_published == true && visibility in ["website", "both"]] | order(date desc) {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    author,
    date,
    category,
    featured,
    is_published,
    image,
    visibility,
    tags
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug && is_published == true && visibility in ["website", "both"]][0] {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    author,
    date,
    category,
    featured,
    is_published,
    image,
    visibility,
    tags,
    seo,
    relatedBeers[]->{
      _id,
      beer_name,
      "slug": slug.current,
      style,
      image
    }
  }
`;

export const ALL_POST_SLUGS_QUERY = `
  *[_type == "post" && is_published == true && visibility in ["website", "both"]].slug.current
`;

export const ALL_POSTS_ADMIN_QUERY = `
  *[_type == "post"] | order(date desc) {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    author,
    date,
    category,
    featured,
    is_published,
    image,
    visibility,
    tags
  }
`;
