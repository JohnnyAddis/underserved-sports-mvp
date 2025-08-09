import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Underserved Sports',
  projectId: '<YOUR_SANITY_PROJECT_ID>',
  dataset: 'production',
  plugins: [visionTool()],
  schema: { types: schemaTypes },
})