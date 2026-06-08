export default {
  name: 'appUser',
  title: 'App User (Staff)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email().custom((email: string) => {
        if (email && email !== email.toLowerCase()) {
          return 'Email must be lowercase';
        }
        return true;
      }),
    },
    {
      name: 'isAdmin',
      title: 'Is Admin',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
