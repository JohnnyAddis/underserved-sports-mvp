import { sanity } from '@/lib/sanity'
import type { LeagueListItem } from '@/types/content'
import Link from 'next/link'

export const metadata = { title: 'Leagues' }

export default async function LeaguesPage() {
  const leagues = await sanity.fetch<LeagueListItem[]>(`
    *[_type=="league"] | order(name asc) {
      name,
      "slug": slug.current,
      "logoUrl": logo.asset->url
    }
  `)

  if (!leagues?.length) {
    return <div>No leagues yet. Create one in Studio and publish.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leagues</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map(l => (
          <li key={l.slug} className="border rounded-xl p-4 hover:shadow">
            <Link href={`/leagues/${l.slug}`}>
              <div className="flex items-center gap-3">
                {l.logoUrl && <img src={`${l.logoUrl}?w=64&h=64&fit=crop`} alt="" className="h-10 w-10 rounded" />}
                <span className="font-medium">{l.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
