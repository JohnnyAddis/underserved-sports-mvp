// src/app/leagues/[slug]/page.tsx
import { sanity } from '@/lib/sanity'
import { generateSEOMetadata } from '@/lib/seo-utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

type ArticleCard = {
  _id: string
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
  heroUrl?: string | null
}

type LeagueData = {
  name: string
  about?: PortableTextBlock[]
  logoUrl?: string | null
  articles: ArticleCard[]
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const data = await sanity.fetch<{
    name?: string
    metaTitle?: string
    metaDescription?: string
    aboutSummary?: string
    logoUrl?: string | null
    noindex?: boolean
  } | null>(
    `*[_type=="league" && slug.current==$slug][0]{
      name,
      metaTitle,
      metaDescription,
      aboutSummary,
      "logoUrl": logo.asset->url,
      noindex
    }`,
    { slug }
  )
  
  if (!data) return {}
  
  return generateSEOMetadata(
    {
      title: data.name,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      excerpt: data.aboutSummary,
      imgUrl: data.logoUrl,
      noindex: data.noindex,
      url: `https://underservedsports.com/leagues/${slug}`,
    },
    'League',
    `Latest news and information about ${data.name || 'this league'}.`
  )
}

export default async function LeaguePage({ params }: PageParams) {
  const { slug } = await params

  const data = await sanity.fetch<LeagueData>(
    `
    *[_type=="league" && slug.current==$slug][0]{
      name,
      about,
      "logoUrl": logo.asset->url,
      "articles": *[_type=="article" && references(^._id) && defined(slug.current)] | order(publishedAt desc)[0...24]{
        _id,
        title,
        excerpt,
        "slug": slug.current,
        publishedAt,
        "heroUrl": heroImage.asset->url
      }
    }
  `,
    { slug }
  )

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-semibold">League not found</h1>
        <p className="text-slate-600">
          Try the <Link className="text-indigo-600 underline" href="/">home page</Link>.
        </p>
      </div>
    )
  }

  const { name, about, logoUrl, articles } = data

  const components: PortableTextComponents = {
    block: {
      h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold">{children}</h2>,
      normal: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
    },
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center gap-4">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={`${name} logo`} className="h-12 w-12 rounded border object-contain" />
        ) : null}
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-sm text-slate-600">
            {articles?.length ?? 0} article{(articles?.length ?? 0) === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      <section className="prose prose-slate max-w-none">
        {about && about.length > 0 ? (
          <PortableText value={about} components={components} />
        ) : (
          <p className="text-slate-600">No about section yet.</p>
        )}
      </section>

      <h2 className="mt-8 text-xl font-semibold">Latest articles</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(articles ?? []).map((a) => (
          <Link
            key={a._id}
            href={`/news/${a.slug}`}
            className="group block rounded-lg border bg-white p-3 hover:shadow-sm"
          >
            {a.heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.heroUrl}
                alt={a.title}
                className="mb-2 h-40 w-full rounded object-cover"
                loading="lazy"
              />
            ) : null}
            <h3 className="line-clamp-2 font-medium group-hover:text-indigo-700">{a.title}</h3>
            {a.excerpt ? <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.excerpt}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  )
}
