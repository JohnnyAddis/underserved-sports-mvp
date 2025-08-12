// src/app/news/[slug]/page.tsx
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs'
import type { Metadata } from 'next'

type ArticleData = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  heroUrl?: string
  metaTitle?: string
  metaDescription?: string
  noindex?: boolean
  sources?: string[]
  league?: { name: string; slug: string } | null
  authorName?: string
  body?: unknown // Portable Text value
}

// Static params for SSG
export async function generateStaticParams() {
  const slugs = await sanity.fetch<string[]>(
    `*[_type=="article" && defined(slug.current)].slug.current`
  )
  return slugs.map((slug) => ({ slug }))
}

// Page metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params
  const meta = await sanity.fetch<Pick<ArticleData,
    'title' | 'metaTitle' | 'metaDescription' | 'heroUrl'
  > | null>(
    `*[_type=="article" && slug.current == $slug][0]{
      title,
      metaTitle,
      metaDescription,
      "heroUrl": heroImage.asset->url
    }`,
    { slug }
  )
  if (!meta) return {}

  const title = meta.metaTitle || meta.title || 'Article'
  const description = meta.metaDescription || ''
  const base = process.env.NEXT_PUBLIC_SITE_URL || ''
  const url = `${base}/news/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: meta.heroUrl ? [{ url: meta.heroUrl }] : undefined,
      type: 'article',
    },
    robots: { index: true, follow: true }, // you can adjust using article.noindex on render
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const article = await sanity.fetch<ArticleData | null>(
    `*[_type=="article" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "heroUrl": heroImage.asset->url,
      metaTitle,
      metaDescription,
      noindex,
      sources,
      "league": league->{
        name,
        "slug": slug.current
      },
      "authorName": author->name,
      body
    }`,
    { slug }
  )

  if (!article) {
    notFound()
  }

  const crumbs: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Leagues', href: '/leagues' },
    ...(article.league
      ? [{ name: article.league.name, href: `/leagues/${article.league.slug}` as const }]
      : []),
    { name: article.title },
  ]

  return (
    <article>
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

      <header className="mb-4">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {article.authorName ? `By ${article.authorName}` : ''}{' '}
          {article.publishedAt ? `• ${new Date(article.publishedAt).toLocaleDateString()}` : ''}
        </p>
      </header>

      {article.heroUrl && (
        <div className="mb-4">
          <Image
            src={article.heroUrl}
            alt={article.title}
            width={1200}
            height={630}
            className="w-full rounded-lg object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-slate max-w-none">
        {article.body ? (
          <PortableText value={article.body as any} />
        ) : (
          <p className="text-slate-500">No body content yet.</p>
        )}
      </div>

      {/* Optional sources */}
      {article.sources && article.sources.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Sources</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
            {article.sources.map((u) => (
              <li key={u}>
                <a className="hover:underline" href={u} target="_blank" rel="noopener noreferrer">
                  {u}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
