import { beerStyles } from "../constants/beerStyles";

export default {
  name: "beer",
  title: "Beer",
  type: "document",
  fields: [
    {
      name: "beer_name",
      title: "Beer Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "beer_name",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: beerStyles,
        layout: "dropdown",
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "brewery",
      title: "Brewery",
      type: "string",
      initialValue: "Infinite Trail Brewing",
    },
    {
      name: "status",
      title: "Availability Status",
      type: "string",
      options: {
        list: [
          { title: "On Deck", value: "on_deck" },
          { title: "Brewing", value: "brewing" },
          { title: "On Tap", value: "ready" },
          { title: "Archived", value: "archived" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "abv",
      title: "ABV (%)",
      type: "number",
      validation: (Rule: any) => Rule.min(0).max(25),
    },
    {
      name: "ibu",
      title: "IBU",
      type: "number",
      validation: (Rule: any) => Rule.min(0).max(200),
    },
    {
      name: "tastingNotes",
      title: "Structured Tasting Notes",
      type: "object",
      fields: [
        { name: "aroma", title: "Aroma", type: "text", rows: 3 },
        { name: "flavor", title: "Flavor", type: "text", rows: 3 },
        { name: "mouthfeel", title: "Mouthfeel", type: "text", rows: 3 },
      ],
    },
    {
      name: "notes",
      title: "General Description",
      type: "text",
    },
    {
      name: "is_flagship",
      title: "Is Flagship",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "image",
      title: "Beer Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "relatedPosts",
      title: "Related Blog Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    },
  ],
};
