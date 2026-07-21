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
    brewDate,
    batchNumber,
    ingredients,
    notableHops,
    is_flagship,
    image,
    telemetry,
    _createdAt,

    // Server-side coalesced fields
    "resolvedPh": string(coalesce(telemetry.waterProfile.ph, 5.32)),
    "resolvedSulfate": coalesce(telemetry.waterProfile.sulfate, 80),
    "resolvedChloride": coalesce(telemetry.waterProfile.chloride, 80),
    "resolvedCalcium": coalesce(telemetry.waterProfile.calcium, 65),
    "resolvedWaterNotes": coalesce(telemetry.waterProfile.waterNotes, "Balanced 1:1 Sulfate-to-Chloride ratio profiles the malt sweetness and hop bitterness equally."),
    "resolvedKettleSchedule": coalesce(telemetry.kettleSchedule, [
      { "time": "60 min (Boil Start)", "label": "Magnum Hops (15 IBU)" },
      { "time": "15 min (Flavor)", "label": "Cascade Hops (5 IBU)" },
      { "time": "0 min (Whirlpool)", "label": "Willamette Finings" }
    ])
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
    brewDate,
    batchNumber,
    ingredients,
    notableHops,
    is_flagship,
    image,
    telemetry,
    _createdAt,

    // Server-side coalesced fields
    "resolvedPh": string(coalesce(telemetry.waterProfile.ph, 5.32)),
    "resolvedSulfate": coalesce(telemetry.waterProfile.sulfate, 80),
    "resolvedChloride": coalesce(telemetry.waterProfile.chloride, 80),
    "resolvedCalcium": coalesce(telemetry.waterProfile.calcium, 65),
    "resolvedWaterNotes": coalesce(telemetry.waterProfile.waterNotes, "Balanced 1:1 Sulfate-to-Chloride ratio profiles the malt sweetness and hop bitterness equally."),
    "resolvedKettleSchedule": coalesce(telemetry.kettleSchedule, [
      { "time": "60 min (Boil Start)", "label": "Magnum Hops (15 IBU)" },
      { "time": "15 min (Flavor)", "label": "Cascade Hops (5 IBU)" },
      { "time": "0 min (Whirlpool)", "label": "Willamette Finings" }
    ])
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
    brewDate,
    batchNumber,
    ingredients,
    notableHops,
    is_flagship,
    image,
    telemetry,
    "relatedPosts": *[_type == "post" && references(^._id) && !(_id in path("drafts.**"))] {
      _id,
      title,
      "slug": slug.current,
      image,
      date,
      isJournalEntry,
      category
    },

    // Server-side coalesced fields
    "resolvedPh": string(coalesce(telemetry.waterProfile.ph, 5.32)),
    "resolvedSulfate": coalesce(telemetry.waterProfile.sulfate, 80),
    "resolvedChloride": coalesce(telemetry.waterProfile.chloride, 80),
    "resolvedCalcium": coalesce(telemetry.waterProfile.calcium, 65),
    "resolvedWaterNotes": coalesce(telemetry.waterProfile.waterNotes, "Balanced 1:1 Sulfate-to-Chloride ratio profiles the malt sweetness and hop bitterness equally."),
    "resolvedKettleSchedule": coalesce(telemetry.kettleSchedule, [
      { "time": "60 min (Boil Start)", "label": "Magnum Hops (15 IBU)" },
      { "time": "15 min (Flavor)", "label": "Cascade Hops (5 IBU)" },
      { "time": "0 min (Whirlpool)", "label": "Willamette Finings" }
    ])
  }
`;

export const ALL_BEER_SLUGS_QUERY = `
  *[_type == "beer" && !(_id in path("drafts.**"))].slug.current
`;
