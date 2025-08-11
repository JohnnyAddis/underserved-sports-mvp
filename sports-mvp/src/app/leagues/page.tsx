import Link from 'next/link'
import Image from 'next/image'
import { sanity } from '@/lib/sanity'

export const revalidate = 30
export const metadata = { title: 'Leagues' }

type LeagueCard = {
  name: string
  slug: string
  logoUrl?: string
  articleCount: number
}

export default async function LeaguesPage() {
  const leagues = await sanity.fetch<LeagueCard[]>(/* groq */ `
    *[_type=="league"] | order(name asc) {
      name,
      "slug": slug.current,
      "logoUrl": logo.asset->url,
      // IMPORTANT: count uses the same robust matching as the league page
      "articleCount": count(*[
        _type == "article" &&
        !(_id in path('drafts.**')) &&
        defined(slug.current) &&
        (
          references(^._id) ||
          (defined(league) && league->_id == ^._id) ||
          (defined(leagues) && ^._id in leagues[]._ref) ||
          (defined(leagueSlug) && leagueSlug == ^.slug.current)
        )
      ])
    }
  `)

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Leagues</h1>

      {leagues.length === 0 ? (
        <p className="text-slate-600">No leagues yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((l) => (
            <li key={l.slug} className="border rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
              <Link href={`/leagues/${l.slug}`} className="block" prefetch={false}>
                {l.logoUrl ? (
                  <div className="relative h-36 bg-white">
                    <Image
                      src={l.logoUrl}
                      alt={`${l.name} logo`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-contain p-6"
                    />
                  </div>
                ) : (
                  <div className="h-36 bg-slate-50" />
                )}
                <div className="p-4">
                  <h2 className="font-semibold">{l.name}</h2>
                  <p className="text-sm text-slate-600">{l.articleCount} article{l.articleCount === 1 ? '' : 's'}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
