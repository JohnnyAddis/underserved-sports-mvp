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
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'about', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'isFeatured', type: 'boolean', initialValue: true }),
  ],
})
