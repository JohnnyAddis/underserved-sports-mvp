import Link from 'next/link'
import Image from 'next/image'
import { sanity } from '@/lib/sanity'
import type { LeagueListItem } from '@/types/content'

export const metadata = { title: 'Leagues' }

export default async function LeaguesPage() {
  const leagues = await sanity.fetch<LeagueListItem[]>(`
    *[_type=="league"] | order(name asc){
      name,
      "slug": slug.current,
      "logoUrl": logo.asset->url,
      "count": count(*[_type=="article" && references(^._id)])
    }
  `)

  if (!leagues?.length) {
    return <div className="text-slate-600">No leagues yet. Create one in Studio and publish.</div>
  }

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Leagues</h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leagues.map((l: LeagueListItem) => (
          <li key={l.slug} className="card hover:shadow-md transition-shadow">
            <Link href={`/leagues/${l.slug}`} className="block p-4" prefetch={false}>
              <div className="flex items-center gap-3">
                {l.logoUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200">
                    <Image alt="" src={l.logoUrl} fill sizes="48px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100" />
                )}

                <div className="flex-1">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-slate-600">{l.count} articles</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
