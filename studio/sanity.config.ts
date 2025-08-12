import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from '../schemas'

export default defineConfig({
  name: 'default',
  title: 'Underserved Sports',
  projectId: 'hjaa2x76', // Hardcoded project ID
  dataset: 'production', // Hardcoded dataset
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
