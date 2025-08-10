import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'league', type: 'reference', to: [{ type: 'league' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'logo', type: 'seoImage' }), // ← was 'image'
    defineField({ name: 'bio', type: 'array', of: [{ type: 'block' }] }),
  ],
})
