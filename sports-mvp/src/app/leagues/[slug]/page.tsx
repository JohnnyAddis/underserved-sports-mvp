import { sanity } from '@/lib/sanity'
import Link from 'next/link'
import type { PortableTextBlock } from '@portabletext/types'

type LeagueDetail = {
  name: string
  about?: PortableTextBlock[]
  logoUrl?: string
  slug: string
}
type ArticleListItem = {
  title: string
  slug: string
  excerpt?: string
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await sanity.fetch<Pick<LeagueDetail, 'name'>>(
    `*[_type=="league" && slug.current==$slug][0]{ name }`,
    { slug: params.slug }
  )
  return { title: data?.name ?? 'League' }
}

export default async function LeaguePage({ params }: { params: { slug: string } }) {
  const { league, articles } = await sanity.fetch<{
    league: LeagueDetail | null
    articles: ArticleListItem[]
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
        | order(publishedAt desc) [0...6] {
          title,
          "slug": slug.current,
          excerpt
        }
    }
    `,
    { slug: params.slug }
  )

  if (!league) return <div className="p-6">League not found.</div>

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        {league.logoUrl && <img src={`${league.logoUrl}?w=96&h=96&fit=crop`} className="h-16 w-16 rounded" alt="" />}
        <h1 className="text-3xl font-semibold">{league.name}</h1>
      </header>

      {/* About (optional; render plain for now) */}
      {league.about && <div className="prose"><p>About section coming soon.</p></div>}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Latest articles</h2>
        {!articles.length ? (
          <p>No articles yet for this league.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(a => (
              <li key={a.slug} className="border rounded-xl p-4 hover:shadow">
                <Link href={`/news/${a.slug}`}>
                  <h3 className="font-medium">{a.title}</h3>
                  <p className="text-sm mt-1 line-clamp-3">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
