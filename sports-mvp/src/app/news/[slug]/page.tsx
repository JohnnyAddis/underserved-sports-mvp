import { sanity } from '@/lib/sanity'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import type { ArticleDetail, RelatedArticle } from '@/types/content'
import { formatDate } from '../../../lib/format'

type ArticleData = {
  article: ArticleDetail | null
  manualRelated: RelatedArticle[]
  fallbackRelated: RelatedArticle[]
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = await sanity.fetch<{ title?: string; metaTitle?: string; metaDescription?: string; noindex?: boolean }>(
    `*[_type=="article" && slug.current==$slug][0]{title,metaTitle,metaDescription,noindex}`,
    { slug: params.slug }
  )
  if (!meta) return {}
  return {
    title: meta.metaTitle || meta.title || 'Article',
    description: meta.metaDescription || '',
    robots: meta.noindex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const data = await sanity.fetch<ArticleData>(
    `
    {
      "article": *[_type=="article" && slug.current==$slug][0]{
        title,
        excerpt,
        "imgUrl": heroImage.asset->url,
        "imgAlt": heroImage.alt,
        body,
        publishedAt,
        "updatedAt": _updatedAt,
        tags,
        sources,
        league->{name, "slug": slug.current}
      },

      // manual related list (editor-picked)
      "manualRelated": *[_type=="article" && slug.current==$slug][0].relatedArticles[]->{
        title, "slug": slug.current
      },

      // fallback related: same league, exclude current, most recent
      "fallbackRelated": *[_type=="article" && league->slug.current==^.^.article.league->slug.current && slug.current!=$slug]
        | order(publishedAt desc)[0...5]{
          title, "slug": slug.current
        }
    }
    `,
    { slug: params.slug }
  )

  const a = data.article
  if (!a) return <div className="p-8">Not found</div>

  // choose up to 5 related, manual first then fallback
  const related: RelatedArticle[] = (data.manualRelated?.length ? data.manualRelated : data.fallbackRelated || []).slice(0, 5)

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* Breadcrumbs */}
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
        <div className="text-sm text-gray-500 flex gap-2">
          {a.publishedAt && <time dateTime={a.publishedAt}>Published {formatDate(a.publishedAt)}</time>}
          {a.updatedAt && a.updatedAt !== a.publishedAt && (
            <span>· Updated {formatDate(a.updatedAt)}</span>
          )}
        </div>
      </header>

      {a.imgUrl && (
        <figure>
          <img
            src={`${a.imgUrl}?w=1200&h=630&fit=crop&auto=format`}
            alt={a.imgAlt ?? ''}
            className="w-full rounded-lg"
            loading="eager"
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
    </article>
  )
}
