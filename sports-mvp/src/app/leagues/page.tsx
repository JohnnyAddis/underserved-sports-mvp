import Link from 'next/link'
import Image from 'next/image'
import { sanity } from '@/lib/sanity'
import type { LeagueListItem } from '@/types/content'

export const metadata = { title: 'Leagues' }
export const revalidate = 300

type LeagueWithCount = LeagueListItem & { count: number }

export default async function LeaguesPage() {
  const leagues = await sanity.fetch<LeagueWithCount[]>(
    `
    *[_type=="league"] | order(name asc) {
      name,
      "slug": slug.current,
      "logoUrl": logo.asset->url,
      "count": count(*[_type=="article" && references(^._id)])
    }
    `
  )

  if (!leagues?.length) {
    return <div className="px-6 py-10">No leagues yet. Create one in Studio and publish.</div>
  }

  return (
    <div className="space-y-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">Leagues</h1>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((l) => (
          <li key={l.slug} className="border rounded-xl p-4 hover:shadow">
            <Link href={`/leagues/${l.slug}`} className="flex items-center gap-3" prefetch={false}>
              {l.logoUrl && (
                <Image
                  src={l.logoUrl}
                  alt={`${l.name} logo`}
                  width={40}
                  height={40}
                  className="rounded"
                />
              )}
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-gray-500">{l.count} articles</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
