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
      name: 'date',
      title: 'Published Date',
      type: 'date',
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
      title: 'Post Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};
