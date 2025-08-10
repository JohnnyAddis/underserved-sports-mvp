import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { sanity } from '@/lib/sanity'
import JsonLd from '@/components/JsonLd'
import { canonical, ogImage } from '@/lib/seo'

export const revalidate = 120 // Rebuild at most once every 2 minutes

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const meta = await sanity.fetch<LeagueDetail | null>(
    `*[_type=="league" && slug.current==$slug][0]{
      name,
      "slug": slug.current,
      "logoUrl": logo.asset->url,
      metaTitle,
      metaDescription,
      noindex
    }`,
    { slug }
  )

  if (!meta) return {}

  const title = meta.metaTitle || meta.name || 'League'
  const description = meta.metaDescription || ''
  const url = canonical(`/leagues/${slug}`)
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

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

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
    { slug }
  )

  const league = data.league
  if (!league) return <div className="px-6 py-10">League not found.</div>

  // JSON-LD
  const leagueUrl = canonical(`/leagues/${league.slug}`)
  const leagueImage = ogImage(league.logoUrl)
  const leagueLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: league.name,
    url: leagueUrl,
    logo: leagueImage ? { '@type': 'ImageObject', url: leagueImage } : undefined,
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'Leagues', item: canonical('/leagues') },
      { '@type': 'ListItem', position: 3, name: league.name, item: leagueUrl },
    ],
  }

  return (
    <div className="px-6 py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/leagues">Leagues</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="truncate max-w-[50vw]">{league.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="flex items-center gap-4">
        {league.logoUrl && (
          <Image
            src={league.logoUrl}
            alt={`${league.name} logo`}
            width={64}
            height={64}
            className="rounded"
            priority={false}
          />
        )}
        <h1 className="text-3xl font-semibold">{league.name}</h1>
      </header>

      {/* About */}
      <section className="prose">
        {league.about?.length ? (
          <PortableText value={league.about} />
        ) : (
          <p className="text-gray-500">No about section yet.</p>
        )}
      </section>

      {/* Articles */}
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

      {/* JSON-LD */}
      <JsonLd data={leagueLd} />
      <JsonLd data={breadcrumbLd} />
    </div>
  )
}
