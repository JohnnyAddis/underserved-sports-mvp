import Link from 'next/link'
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import JsonLd from '@/components/JsonLd'
import type { PortableTextBlock } from '@portabletext/types'
import { canonical, ogImage } from '@/lib/seo'

type LeagueDetail = {
  name: string
  slug: string
  logoUrl?: string
  about?: PortableTextBlock[]
  metaTitle?: string
  metaDescription?: string
  noindex?: boolean
}

type LeagueArticle = {
  title: string
  slug: string
  excerpt?: string
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = await sanity.fetch<LeagueDetail | null>(
    `*[_type=="league" && slug.current==$slug][0]{
      name, "slug": slug.current, "logoUrl": logo.asset->url,
      metaTitle, metaDescription, noindex
    }`,
    { slug: params.slug }
  )

  if (!meta) return {}

  const title = meta.metaTitle || meta.name || 'League'
  const description = meta.metaDescription || ''
  const url = canonical(`/leagues/${params.slug}`)
  const image = ogImage(meta.logoUrl)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: meta.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function LeaguePage({ params }: { params: { slug: string } }) {
  const data = await sanity.fetch<{
    league: LeagueDetail | null
    articles: LeagueArticle[]
  }>(
    `
    {
      "league": *[_type=="league" && slug.current==$slug][0]{
        name,
        "slug": slug.current,
        "logoUrl": logo.asset->url,
        about
      },
      "articles": *[_type=="article" && league->slug.current==$slug]
        | order(publishedAt desc)[0...12]{
          title,
          "slug": slug.current,
          excerpt
        }
    }
    `,
    { slug: params.slug }
  )

  const league = data.league
  if (!league) return <div className="px-6 py-10">League not found.</div>

  // JSON-LD: CollectionPage + BreadcrumbList
  const url = canonical(`/leagues/${league.slug}`)
  const image = ogImage(league.logoUrl)
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: league.name,
    url,
    image,
    mainEntity: data.articles.map((a, i) => ({
      '@type': 'Article',
      position: i + 1,
      name: a.title,
      url: canonical(`/news/${a.slug}`),
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'Leagues', item: canonical('/leagues') },
      { '@type': 'ListItem', position: 3, name: league.name, item: url },
    ],
  }

  return (
    <div className="px-6 py-10 space-y-8">
      <header className="flex items-center gap-4">
        {league.logoUrl && (
          <img
            src={`${league.logoUrl}?w=96&h=96&fit=crop&auto=format`}
            alt={`${league.name} logo`}
            className="h-16 w-16 rounded"
          />
        )}
        <h1 className="text-3xl font-semibold">{league.name}</h1>
      </header>

      <section className="prose">
        {league.about?.length ? (
          <PortableText value={league.about} />
        ) : (
          <p className="text-gray-500">No about section yet.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Latest articles</h2>
        {!data.articles.length ? (
          <p className="text-gray-500">No articles yet for this league.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.articles.map((a) => (
              <li key={a.slug} className="border rounded-xl p-4 hover:shadow">
                <Link href={`/news/${a.slug}`}>
                  <h3 className="font-medium">{a.title}</h3>
                  {a.excerpt && <p className="text-sm mt-1 line-clamp-3">{a.excerpt}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Page-level JSON-LD */}
      <JsonLd data={collectionLd} />
      <JsonLd data={breadcrumbLd} />
    </div>
  )
}
