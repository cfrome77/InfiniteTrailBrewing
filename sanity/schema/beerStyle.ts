export default {
  name: "beerStyle",
  title: "Beer Style (Telemetry Defaults)",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Style Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "defaultTelemetry",
      title: "Default Style Telemetry Standards",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        { name: "ph", title: "Mash pH", type: "number" },
        { name: "sulfate", title: "Sulfate (ppm)", type: "number" },
        { name: "chloride", title: "Chloride (ppm)", type: "number" },
        { name: "calcium", title: "Calcium (ppm)", type: "number" },
        { name: "waterNotes", title: "Water Adjustment Notes", type: "text", rows: 3 },
        {
          name: "kettleSchedule",
          title: "Default Kettle Addition Timing Logs",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "time", title: "Time (e.g. '60 min', 'Flameout')", type: "string" },
                { name: "label", title: "Addition Detail (e.g. 'Citra 10 IBU')", type: "string" }
              ]
            }
          ]
        }
      ]
    }
  ]
};
