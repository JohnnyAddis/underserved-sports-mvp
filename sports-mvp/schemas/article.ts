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
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
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
    // SEO basics
    defineField({ name: 'metaTitle', type: 'string' }),
    defineField({ name: 'metaDescription', type: 'text' }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
    // future AI hooks (safe to ignore for now)
    defineField({ name: 'sources', type: 'array', of: [{ type: 'url' }] }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['draft', 'ai_generated', 'edited', 'published'] },
      initialValue: 'draft',
    }),
  ],
})
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
    defineField({ name: 'heroImage', type: 'seoImage' }), // ← was 'image'
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
    defineField({ name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'metaTitle', type: 'string' }),
    defineField({ name: 'metaDescription', type: 'text' }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
    defineField({ name: 'sources', type: 'array', of: [{ type: 'url' }] }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['draft', 'ai_generated', 'edited', 'published'] },
      initialValue: 'draft',
    }),
  ],
})
