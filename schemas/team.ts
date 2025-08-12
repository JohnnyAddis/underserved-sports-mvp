import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'league',
      type: 'reference',
      to: [{ type: 'league' }],
      validation: (Rule) => Rule.required(),
    }),

    // uses seoImage from A1
    defineField({ name: 'logo', type: 'seoImage' }),

    defineField({ name: 'bio', type: 'array', of: [{ type: 'block' }] }),

    // 🆕 SEO
    defineField({
      name: 'metaTitle',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
  ],
})
