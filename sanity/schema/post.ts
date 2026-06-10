export default {
  name: 'post',
  title: 'The Trail Report (Blog)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ]
        }
      ],
    },
    {
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Website Only', value: 'website' },
          { title: 'Newsletter Only', value: 'newsletter' },
          { title: 'Website and Newsletter', value: 'both' },
        ],
      },
      initialValue: 'both',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'date',
      title: 'Published Date',
      type: 'date',
    },
    {
      name: 'read_time',
      title: 'Read Time',
      type: 'string',
      description: 'e.g. 5 min read',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'is_published',
      title: 'Is Published',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'relatedBeers',
      title: 'Related Beers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'beer' }] }],
    },
    {
      name: 'seo',
      title: 'SEO & Social',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Meta Title',
          type: 'string',
          description: 'Ideally 50-60 characters',
        },
        {
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Ideally 150-160 characters',
        },
      ],
    },
  ],
};
