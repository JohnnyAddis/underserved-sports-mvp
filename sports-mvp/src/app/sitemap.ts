import type { MetadataRoute } from 'next'
import { sanity } from '@/lib/sanity'

export const revalidate = 3600 // hour

type UrlItem = {
  url: string
  lastModified?: string
  changeFrequency?: MetadataRoute.Sitemap['0']['changeFrequency']
  priority?: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const [articles, leagues] = await Promise.all([
    sanity.fetch<{ slug: string; updatedAt?: string }[]>(
      `*[_type=="article"]{ "slug": slug.current, "updatedAt": coalesce(_updatedAt, publishedAt) }`
    ),
    sanity.fetch<{ slug: string; updatedAt?: string }[]>(
      `*[_type=="league"]{ "slug": slug.current, "updatedAt": _updatedAt }`
    ),
  ])

  const base: UrlItem[] = [
    { url: `${siteUrl}/`, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${siteUrl}/leagues`, changeFrequency: 'daily', priority: 0.8 },
  ]

  const leagueUrls: UrlItem[] = leagues.map((l) => ({
    url: `${siteUrl}/leagues/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  const articleUrls: UrlItem[] = articles.map((a) => ({
    url: `${siteUrl}/news/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'hourly',
    priority: 0.9,
  }))

  return [...base, ...leagueUrls, ...articleUrls]
}
