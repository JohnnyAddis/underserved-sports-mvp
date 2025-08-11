import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

export const revalidate = 30

type LeagueData = {
  name: string
  logoUrl?: string
  about?: PortableTextBlock[]
}

type Card = {
  title: string
  slug: string
  excerpt?: string
  imgUrl?: string
  imgAlt?: string | null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const league = await sanity.fetch<{ name?: string }>(
    `*[_type=="league" && slug.current==$slug][0]{ name }`,
    { slug }
  )
  return { title: league?.name ?? 'League' }
}

export default async function LeaguePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Load league (for header UI). If not found, 404.
  const league = await sanity.fetch<(LeagueData & { _id: string }) | null>(
    `*[_type=="league" && slug.current==$slug][0]{
      _id,
      name,
      "logoUrl": logo.asset->url,
      about
    }`,
    { slug }
  )
  if (!league) return notFound()

  // Articles for this league (robust matching; same as in Leagues page count)
  const articles = await sanity.fetch<Card[]>(
    `*[
      _type == "article" &&
      !(_id in path('drafts.**')) &&
      defined(slug.current) &&
      (
        references($leagueId) ||
        (defined(league) && league->_id == $leagueId) ||
        (defined(leagues) && $leagueId in leagues[]._ref) ||
        (defined(leagueSlug) && leagueSlug == $slug)
      )
    ]
    | order(coalesce(publishedAt, _updatedAt, _createdAt) desc){
      title,
      "slug": slug.current,
      excerpt,
      "imgUrl": heroImage.asset->url,
      "imgAlt": heroImage.alt
    }`,
    { leagueId: league._id, slug }
  )

  const articleCount = articles.length

  return (
    <main className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {league.logoUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-slate-200">
              <Image src={league.logoUrl} alt="" fill sizes="64px" className="object-cover" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-lg bg-slate-100" />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
            <p className="text-sm text-slate-600">
              {articleCount} article{articleCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </header>

      <section className="prose lg:prose-lg">
        {Array.isArray(league.about) && league.about.length > 0 ? (
          <PortableText value={league.about} />
        ) : (
          <p className="text-gray-500">No about section yet.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Articles</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <li key={a.slug} className="border rounded-xl p-4 hover:shadow">
              <Link href={`/news/${a.slug}`} className="block" prefetch={false}>
                {a.imgUrl && (
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={a.imgUrl}
                      alt={a.imgAlt || a.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <h3 className="font-medium">{a.title}</h3>
                {a.excerpt && <p className="text-sm mt-1 line-clamp-3">{a.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>

        {!articles.length && (
          <p className="text-gray-500">No articles yet for this league.</p>
        )}
      </section>
    </main>
  )
}
