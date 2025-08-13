import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from '../schemas'

// Sanity configuration using environment variables for security
// Ensure these are set in your .env.local file
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing environment variable: SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID. ' +
    'Please add it to your .env.local file.'
  )
}

export default defineConfig({
  name: 'default',
  title: 'Underserved Sports',
  projectId: projectId,
  dataset: dataset,
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
