import Link from 'next/link'
import { sanity } from '@/lib/sanity'
import type { ArticleListItem } from '@/types/content'

export default async function Home() {
  const articles = await sanity.fetch<ArticleListItem[]>(
    `
    *[_type=="article"] | order(publishedAt desc)[0...6]{
      title,
      "slug": slug.current,
      excerpt,
      league->{ name, "slug": slug.current },
      "imgUrl": heroImage.asset->url,
      "imgAlt": heroImage.alt
    }
    `
  )

  return (
    <main className="px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Trending</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.slug} className="border rounded-xl p-4 hover:shadow">
            {/* Primary link (image + title + excerpt) */}
            <Link href={`/news/${a.slug}`} className="block">
              {a.imgUrl && (
                <img
                  src={`${a.imgUrl}?w=800&h=450&fit=crop&auto=format`}
                  alt={a.imgAlt ?? ''}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h2 className="font-semibold">{a.title}</h2>
              {a.excerpt && <p className="text-sm mt-2 line-clamp-3">{a.excerpt}</p>}
            </Link>

            {/* Secondary link (league) — separate link, not nested */}
            {a.league?.slug && (
              <div className="text-sm opacity-70 mt-2">
                <Link href={`/leagues/${a.league.slug}`}>{a.league.name}</Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}
