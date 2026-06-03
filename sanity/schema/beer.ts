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
      name: "status",
      title: "Status",
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
      name: "notes",
      title: "Notes",
      type: "text",
    },

    {
      name: "abv",
      title: "ABV",
      type: "number",
      validation: (Rule: any) =>
        Rule.min(0).max(20).custom((value: number, context: any) => {
          const status = context.document?.status;

          if (status === "ready" && value == null) {
            return "ABV is required for beers that are on tap";
          }

          return true;
        }),
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
      // intentionally NOT required
    },
  ],
};
