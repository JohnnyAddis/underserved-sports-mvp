// src/app/news/[slug]/page.tsx
import { sanity } from '@/lib/sanity'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

type Author = { name?: string }
type LeagueRef = { name?: string; slug?: string }

type Article = {
  _id: string
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
  heroUrl?: string | null
  body?: PortableTextBlock[]
  author?: Author | null
  league?: LeagueRef | null
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const meta = await sanity.fetch<
    { title?: string; metaTitle?: string; metaDescription?: string; imgUrl?: string | null } | null
  >(
    `*[_type=="article" && slug.current==$slug][0]{
      title,
      metaTitle,
      metaDescription,
      "imgUrl": heroImage.asset->url
    }`,
    { slug }
  )

  if (!meta) return {}

  const title = meta.metaTitle || meta.title || 'Article'
  const description = meta.metaDescription || ''
  const openGraphImages = meta.imgUrl ? [{ url: meta.imgUrl }] : undefined

  return {
    title,
    description,
    openGraph: { title, description, images: openGraphImages },
    twitter: { title, description, images: openGraphImages?.[0]?.url },
  }
}

export default async function ArticlePage({ params }: PageParams) {
  const { slug } = await params

  const data = await sanity.fetch<Article | null>(
    `
    *[_type=="article" && slug.current==$slug][0]{
      _id,
      title,
      excerpt,
      "slug": slug.current,
      publishedAt,
      "heroUrl": heroImage.asset->url,
      body,
      author->{ name },
      league->{ name, "slug": slug.current }
    }
  `,
    { slug }
  )

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-semibold">Article not found</h1>
        <p className="text-slate-600">
          Try the <Link className="text-indigo-600 underline" href="/">home page</Link> or{' '}
          <Link className="text-indigo-600 underline" href="/leagues">browse leagues</Link>.
        </p>
      </div>
    )
  }

  const components: PortableTextComponents = {
    block: {
      h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold">{children}</h2>,
      normal: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
    },
    types: {
      image: ({ value }) =>
        // eslint-disable-next-line @next/next/no-img-element
        value?.asset?._ref ? (
          <img alt={data.title} src={data.heroUrl ?? ''} className="my-4 rounded" />
        ) : null,
    },
  }

  return (
    <article className="mx-auto max-w-3xl">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link className="hover:text-indigo-700" href="/">Home</Link>
          </li>
          {data.league?.slug && data.league?.name ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link className="hover:text-indigo-700" href={`/leagues/${data.league.slug}`}>
                  {data.league.name}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">/</li>
          <li className="text-slate-900">{data.title}</li>
        </ol>
      </nav>

      <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
      {data.excerpt ? <p className="mb-4 text-slate-600">{data.excerpt}</p> : null}

      {data.heroUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.heroUrl} alt={data.title} className="mb-4 w-full rounded" />
      ) : null}

      {data.body && data.body.length > 0 ? (
        <div className="prose prose-slate max-w-none">
          <PortableText value={data.body} components={components} />
        </div>
      ) : null}

      <footer className="mt-8 border-t pt-4 text-sm text-slate-600">
        {data.author?.name ? <div>By {data.author.name}</div> : null}
        {data.publishedAt ? (
          <time dateTime={data.publishedAt}>
            {new Date(data.publishedAt).toLocaleDateString()}
          </time>
        ) : null}
      </footer>
    </article>
  )
}
