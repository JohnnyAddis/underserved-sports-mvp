import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 90 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'excerpt', type: 'text' }),

    // 🆕 Ensure this is 'seoImage' from A1
    defineField({ name: 'heroImage', type: 'seoImage' }),

    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),

    defineField({
      name: 'league',
      type: 'reference',
      to: [{ type: 'league' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'team', type: 'reference', to: [{ type: 'team' }] }),

    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // ---------- SEO fields ----------
    defineField({
      name: 'metaTitle',
      type: 'string',
      description: '≤ 60 characters',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      description: '≤ 160 characters',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),

    // ---------- Taxonomy / linking ----------
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related articles (manual)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      validation: (Rule) => Rule.max(8),
    }),

    // ---------- E-E-A-T ----------
    defineField({
      name: 'sources',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Links to sources/citations used in this piece.',
    }),

    // ---------- Optional helper ----------
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Minutes to read (optional; can be auto-calculated later).',
      validation: (Rule) => Rule.min(1).max(60),
    }),

    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['draft', 'ai_generated', 'edited', 'published'] },
      initialValue: 'draft',
    }),
  ],
})
