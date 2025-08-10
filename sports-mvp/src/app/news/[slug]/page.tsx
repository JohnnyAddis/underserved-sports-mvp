import Link from 'next/link'
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import JsonLd from '@/components/JsonLd'
import { canonical, ogImage } from '@/lib/seo'
import type { ArticleDetail, RelatedArticle } from '@/types/content'

type ArticleData = {
  article: (ArticleDetail & {
    slug: string
    author?: { name?: string }
  }) | null
  manualRelated: RelatedArticle[]
  fallbackRelated: RelatedArticle[]
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = await sanity.fetch<{
    title?: string
    metaTitle?: string
    metaDescription?: string
    noindex?: boolean
    imgUrl?: string
  }>(
    `*[_type=="article" && slug.current==$slug][0]{
      title, metaTitle, metaDescription, noindex,
      "imgUrl": heroImage.asset->url
    }`,
    { slug: params.slug }
  )

  if (!meta) return {}

  const title = meta.metaTitle || meta.title || 'Article'
  const description = meta.metaDescription || ''
  const url = canonical(`/news/${params.slug}`)
  const image = ogImage(meta.imgUrl || undefined)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: meta.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'article',
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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const data = await sanity.fetch<ArticleData>(
    `
    {
      "article": *[_type=="article" && slug.current==$slug][0]{
        "slug": slug.current,
        title,
        excerpt,
        "imgUrl": heroImage.asset->url,
        "imgAlt": heroImage.alt,
        body,
        publishedAt,
        "updatedAt": _updatedAt,
        tags,
        sources,
        league->{name, "slug": slug.current},
        author->{name}
      },
      "manualRelated": *[_type=="article" && slug.current==$slug][0].relatedArticles[]->{
        title, "slug": slug.current
      },
      "fallbackRelated": *[_type=="article" && league->slug.current==^.^.article.league->slug.current && slug.current!=$slug]
        | order(publishedAt desc)[0...5]{
          title, "slug": slug.current
        }
    }
    `,
    { slug: params.slug }
  )

  const a = data.article
  if (!a) return <main className="p-8">Not found</main>

  const related: RelatedArticle[] =
    (data.manualRelated?.length ? data.manualRelated : data.fallbackRelated || []).slice(0, 5)

  const url = canonical(`/news/${a.slug}`)
  const image = ogImage(a.imgUrl || undefined)
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    image: image ? [image] : undefined,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    author: a.author?.name ? { '@type': 'Person', name: a.author.name } : undefined,
    mainEntityOfPage: url,
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/leagues">Leagues</Link></li>
          {a.league && (
            <>
              <li aria-hidden>/</li>
              <li><Link href={`/leagues/${a.league.slug}`}>{a.league.name}</Link></li>
            </>
          )}
          <li aria-hidden>/</li>
          <li aria-current="page" className="truncate max-w-[50vw]">{a.title}</li>
        </ol>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{a.title}</h1>
      </header>

      {a.imgUrl && (
        <figure>
          <img
            src={`${a.imgUrl}?w=1200&h=630&fit=crop&auto=format`}
            alt={a.imgAlt ?? ''}
            className="w-full rounded-lg"
          />
          {a.imgAlt && <figcaption className="text-sm text-gray-500 mt-1">{a.imgAlt}</figcaption>}
        </figure>
      )}

      <section className="prose lg:prose-lg">
        {a.body?.length ? <PortableText value={a.body} /> : <p className="text-gray-500">No article body.</p>}
      </section>

      {!!a.sources?.length && (
        <section className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Sources</h2>
          <ul className="list-disc pl-5 space-y-1">
            {a.sources.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="nofollow noopener noreferrer">{url}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!related.length && (
        <aside className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Related</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {related.map(r => (
              <li key={r.slug} className="border rounded-lg p-3 hover:shadow">
                <Link href={`/news/${r.slug}`}>{r.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <JsonLd data={articleLd} />
    </main>
  )
}
