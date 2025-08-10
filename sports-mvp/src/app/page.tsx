import { sanity } from '@/lib/sanity'
import type { ArticleListItem } from '@/types/content'

export default async function Home() {
  const articles = await sanity.fetch<ArticleListItem[]>(`
    *[_type=="article"] | order(publishedAt desc) [0...6]{
      title,
      "slug": slug.current,
      excerpt,
      league->{ name, "slug": slug.current }
    }
  `)

  return (
    <main className="px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Trending</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <a key={a.slug} href={`/news/${a.slug}`} className="border rounded-xl p-4 hover:shadow">
            <div className="text-sm opacity-70">{a.league?.name}</div>
            <h2 className="font-semibold mt-1">{a.title}</h2>
            <p className="text-sm mt-2 line-clamp-3">{a.excerpt}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
