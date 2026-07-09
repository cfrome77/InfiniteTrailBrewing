import { beerStyles } from "../constants/beerStyles";

export default {
  name: "beer",
  title: "Beer",
  type: "document",
  groups: [
    { name: "lab", title: "Lab Specs", default: true },
    { name: "commercial", title: "Commercial Info" },
  ],
  fields: [
    {
      name: "beer_name",
      title: "Beer Name",
      type: "string",
      group: "lab",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "lab",
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
      group: "lab",
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
      group: "lab",
      initialValue: "Infinite Trail Brewing",
    },
    {
      name: "status",
      title: "Availability Status",
      type: "string",
      group: "lab",
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
      group: "lab",
      validation: (Rule: any) => Rule.min(0).max(25),
    },
    {
      name: "ibu",
      title: "IBU",
      type: "number",
      group: "lab",
      validation: (Rule: any) => Rule.min(0).max(200),
    },
    {
      name: "tastingNotes",
      title: "Structured Tasting Notes",
      type: "object",
      group: "lab",
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
      group: "lab",
    },
    {
      name: "is_flagship",
      title: "Is Flagship",
      type: "boolean",
      group: "lab",
      initialValue: false,
    },
    {
      name: "image",
      title: "Beer Image",
      type: "image",
      group: "lab",
      options: {
        hotspot: true,
      },
    },
    {
      name: "relatedPosts",
      title: "Related Blog Posts",
      type: "array",
      group: "lab",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    },
    {
      name: "isCommercialProduct",
      title: "Ready for Public Sale (Commercial)",
      type: "boolean",
      group: "commercial",
      initialValue: false,
    },
    {
      name: "commercialSpecs",
      title: "Commercial Specifications",
      type: "object",
      group: "commercial",
      hidden: ({ document }: any) => !document?.isCommercialProduct,
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        { name: "price", title: "Price ($)", type: "number" },
        { name: "sku", title: "SKU", type: "string" },
        { name: "stockCount", title: "Stock Count", type: "number" },
      ],
    },
  ],
};
