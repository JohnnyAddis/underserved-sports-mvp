import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'leagueEvergreen',
  title: 'League Evergreen Content',
  type: 'document',
  fields: [
    defineField({
      name: 'league',
      title: 'League',
      type: 'reference',
      to: [{ type: 'league' }],
      validation: (Rule) => Rule.required(),
      description: 'The league this evergreen content belongs to',
    }),

    defineField({
      name: 'history',
      title: 'League History',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Brief history of the league (optional)',
    }),

    defineField({
      name: 'format',
      title: 'League Format',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'How the league is structured - divisions, playoffs, seasons, etc. (optional)',
    }),

    defineField({
      name: 'teams',
      title: 'Teams',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'team',
          fields: [
            defineField({ 
              name: 'name', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'Team name',
            }),
            defineField({ 
              name: 'founded', 
              type: 'string',
              description: 'Year founded (optional)',
            }),
            defineField({ 
              name: 'location', 
              type: 'string',
              description: 'City/Location (optional)',
            }),
            defineField({ 
              name: 'stadium', 
              type: 'string',
              description: 'Home stadium/venue (optional)',
            }),
            defineField({ 
              name: 'description', 
              type: 'text', 
              rows: 2,
              description: 'Brief description (optional)',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'location',
            },
          },
        },
      ],
      description: 'List of teams in the league (optional)',
    }),

    defineField({
      name: 'stats',
      title: 'Key Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ 
              name: 'label', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'Stat label (e.g., "Founded", "Number of Teams")',
            }),
            defineField({ 
              name: 'value', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'Stat value',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
      description: 'Key statistics about the league (optional)',
    }),

    defineField({
      name: 'champions',
      title: 'Past Champions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'champion',
          fields: [
            defineField({ 
              name: 'year', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'Year/Season',
            }),
            defineField({ 
              name: 'team', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'Champion team name',
            }),
            defineField({ 
              name: 'runnerUp', 
              type: 'string',
              description: 'Runner-up team (optional)',
            }),
            defineField({ 
              name: 'notes', 
              type: 'string',
              description: 'Additional notes (optional)',
            }),
          ],
          preview: {
            select: {
              title: 'year',
              subtitle: 'team',
            },
          },
        },
      ],
      description: 'List of past champions (optional)',
    }),

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      description: 'SEO title for the evergreen page (optional)',
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
      description: 'SEO description for the evergreen page (optional)',
    }),
  ],
  preview: {
    select: {
      title: 'league.name',
      subtitle: 'league.slug.current',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title ? `${title} - Evergreen` : 'League Evergreen',
        subtitle: subtitle || '',
      }
    },
  },
})