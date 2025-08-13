import type { Metadata } from 'next'

interface SEOData {
  title?: string
  metaTitle?: string
  metaDescription?: string
  excerpt?: string
  imgUrl?: string | null
  imgAlt?: string | null
  noindex?: boolean
  publishedAt?: string
  author?: { name?: string } | null
  type?: 'article' | 'website' | 'profile'
  url?: string
}

export function generateSEOMetadata(
  data: SEOData,
  fallbackTitle: string,
  fallbackDescription?: string
): Metadata {
  const title = data.metaTitle || data.title || fallbackTitle
  const description = data.metaDescription || data.excerpt || fallbackDescription || ''
  
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: data.type || 'website',
      images: data.imgUrl ? [{ 
        url: data.imgUrl,
        alt: data.imgAlt || title
      }] : undefined,
    },
    twitter: {
      card: data.imgUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: data.imgUrl ? [data.imgUrl] : undefined,
    },
  }

  // Handle noindex
  if (data.noindex) {
    metadata.robots = {
      index: false,
      follow: true,
    }
  }

  // Add article metadata if applicable
  if (data.type === 'article' && data.publishedAt) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: data.publishedAt,
      authors: data.author?.name ? [data.author.name] : undefined,
    }
  }

  // Add canonical URL if provided
  if (data.url) {
    metadata.alternates = {
      canonical: data.url,
    }
  }

  return metadata
}