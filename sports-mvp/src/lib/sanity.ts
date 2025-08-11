import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Did you set it in .env.local or Vercel?')
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // token: process.env.SANITY_READ_TOKEN, // only if dataset is private
  perspective: 'published',
})
