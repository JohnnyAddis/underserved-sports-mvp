import Link from 'next/link'
import Image from 'next/image'
import { sanity } from '@/lib/sanity'
import type { ArticleListItem } from '@/types/content'

export const revalidate = 60

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
        {articles.map((a, idx) => (
          <article key={a.slug} className="border rounded-xl p-4 hover:shadow">
            <Link href={`/news/${a.slug}`} className="block" prefetch={false}>
              {a.imgUrl && (
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={a.imgUrl}
                    alt={a.imgAlt ?? ''}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover rounded-md"
                    priority={idx === 0}
                  />
                </div>
              )}
              <h2 className="font-semibold">{a.title}</h2>
              {a.excerpt && <p className="text-sm mt-2 line-clamp-3">{a.excerpt}</p>}
            </Link>

            {a.league?.slug && (
              <div className="text-sm opacity-70 mt-2">
                <Link href={`/leagues/${a.league.slug}`} prefetch={false}>
                  {a.league.name}
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}
