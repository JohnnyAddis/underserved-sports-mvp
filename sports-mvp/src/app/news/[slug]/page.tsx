import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type ArticleDetail = {
  title: string
  excerpt?: string
  img?: string
  body?: PortableTextBlock[]
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await sanity.fetch<{ title: string; metaTitle?: string; metaDescription?: string; noindex?: boolean }>(
    `*[_type=="article" && slug.current==$slug][0]{title,metaTitle,metaDescription,noindex}`,
    { slug: params.slug }
  )
  if (!a) return {}
  return {
    title: a.metaTitle || a.title,
    description: a.metaDescription || '',
    robots: a.noindex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function Article({ params }: { params: { slug: string } }) {
  const a = await sanity.fetch<ArticleDetail>(
    `*[_type=="article" && slug.current==$slug][0]{
      title,
      excerpt,
      "img": heroImage.asset->url,
      body
    }`,
    { slug: params.slug }
  )

  if (!a) return <div className="p-8">Not found</div>

  return (
    <article className="prose lg:prose-lg mx-auto">
      <h1>{a.title}</h1>
      {a.img && <img src={`${a.img}?w=1200`} alt="" />}
      {a.body ? <PortableText value={a.body} /> : <p className="text-gray-500">No body content.</p>}
    </article>
  )
}
