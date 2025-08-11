import Link from 'next/link'
import Image from 'next/image'
import { sanity } from '@/lib/sanity'

export const revalidate = 30
export const metadata = { title: 'Home' }

type Card = {
  title: string
  slug: string
  excerpt?: string
  imgUrl?: string
  imgAlt?: string | null
  league?: { name: string; slug: string } | null
}

export default async function Home() {
  const articles = await sanity.fetch<Card[]>(`
    *[
      _type == "article" &&
      !(_id in path('drafts.**')) &&            // published (not a draft)
      !(
        defined(status) && status in ["draft","ai_generated"]
      )
    ] | order(coalesce(publishedAt, _updatedAt, _createdAt) desc)[0...6]{
      title,
      "slug": slug.current,
      excerpt,
      league->{ name, "slug": slug.current },
      "imgUrl": heroImage.asset->url,
      "imgAlt": heroImage.alt
    }
  `)

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Trending</h1>

      {articles.length === 0 ? (
        <p className="text-slate-600">No articles yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug} className="border rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
              <Link href={`/news/${a.slug}`} className="block" prefetch={false}>
                {a.imgUrl && (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={a.imgUrl}
                      alt={a.imgAlt || a.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  {a.league && (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {a.league.name}
                    </span>
                  )}
                  <h2 className="font-semibold">{a.title}</h2>
                  {a.excerpt && <p className="text-sm text-slate-600 line-clamp-2">{a.excerpt}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
