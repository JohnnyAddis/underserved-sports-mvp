// src/app/leagues/[slug]/page.tsx
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'

type LeagueArticle = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  heroUrl?: string
  authorName?: string
}

type LeagueData = {
  _id: string
  name: string
  slug: string
  about?: unknown // Portable Text value
  logoUrl?: string
  articleCount: number
  articles: LeagueArticle[]
}

type LeagueQueryResult = LeagueData | null

export async function generateStaticParams() {
  const slugs = await sanity.fetch<string[]>(
    `*[_type=="league" && defined(slug.current)].slug.current`
  )
  return slugs.map((slug) => ({ slug }))
}

export default async function LeaguePage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const league = await sanity.fetch<LeagueQueryResult>(
    `*[_type=="league" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      about,
      "logoUrl": logo.asset->url,
      "articleCount": count(*[_type=="article" && references(^._id)]),
      "articles": *[_type=="article" && references(^._id)]|order(publishedAt desc)[0...20]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        "heroUrl": heroImage.asset->url,
        "authorName": author->name
      }
    }`,
    { slug }
  )

  if (!league) {
    notFound()
  }

  const crumbs: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Leagues', href: '/leagues' },
    { name: league.name },
  ]

  return (
    <section>
      <Breadcrumbs items={crumbs} />

      {/* JSON-LD (BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((c, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: c.name,
              ...(c.href
                ? { item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${c.href}` }
                : {}),
            })),
          }),
        }}
      />

      <header className="mb-6 flex items-center gap-3">
        {league.logoUrl && (
          <Image
            src={league.logoUrl}
            alt={`${league.name} logo`}
            width={48}
            height={48}
            className="h-12 w-12 rounded"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{league.name}</h1>
          <p className="text-sm text-slate-500">
            {league.articleCount} article{league.articleCount === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      {/* About */}
      <div className="prose prose-slate max-w-none mb-8">
        {league.about ? (
          <PortableText value={league.about as any} />
        ) : (
          <p className="text-slate-500">There is no about section yet.</p>
        )}
      </div>

      {/* Articles list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {league.articles.map((a) => (
          <Link
            key={a._id}
            href={`/news/${a.slug}`}
            className="border rounded-lg p-3 hover:shadow-sm transition"
          >
            {a.heroUrl && (
              <Image
                src={a.heroUrl}
                alt={a.title}
                width={640}
                height={360}
                className="mb-2 aspect-video w-full rounded object-cover"
              />
            )}
            <h3 className="font-semibold">{a.title}</h3>
            {a.excerpt && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.excerpt}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              {a.authorName ? `By ${a.authorName}` : ''}{' '}
              {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}
            </p>
          </Link>
        ))}
        {league.articles.length === 0 && (
          <p className="text-slate-500">No articles yet for this league.</p>
        )}
      </div>
    </section>
  )
}
