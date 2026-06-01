export default {
  name: 'beer',
  title: 'Beer',
  type: 'document',
  fields: [
    {
      name: 'beer_name',
      title: 'Beer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'On Deck', value: 'on_deck' },
          { title: 'Brewing', value: 'brewing' },
          { title: 'On Tap', value: 'ready' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
    },
    {
      name: 'abv',
      title: 'ABV',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
    },
    {
      name: 'is_flagship',
      title: 'Is Flagship',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'started_at',
      title: 'Started At',
      type: 'date',
    },
    {
      name: 'image',
      title: 'Beer Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};
