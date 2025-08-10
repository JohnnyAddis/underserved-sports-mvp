import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'league',
  title: 'League',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),

    // uses seoImage from A1
    defineField({ name: 'logo', type: 'seoImage' }),

    defineField({ name: 'about', type: 'array', of: [{ type: 'block' }] }),

    // 🆕 short summary for meta/preview
    defineField({
      name: 'aboutSummary',
      type: 'string',
      description: 'Short 1–2 sentence summary used for previews/SEO (≤ 160 chars).',
      validation: (Rule) => Rule.max(160),
    }),

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

    defineField({ name: 'isFeatured', type: 'boolean', initialValue: true }),
  ],
})
