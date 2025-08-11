import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  useCdn: true,
  // token: process.env.SANITY_READ_TOKEN, // only if data set is private...
})
