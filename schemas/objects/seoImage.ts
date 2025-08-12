import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seoImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Concise description for screen readers and SEO (aim for ≤120 chars).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'string',
      description: 'Photographer/source credit (optional).',
    }),
  ],
})
