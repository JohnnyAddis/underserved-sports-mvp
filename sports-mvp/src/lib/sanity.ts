import { createClient } from '@sanity/client'
export const sanity = createClient({
  projectId: 'hjaa2x76',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})