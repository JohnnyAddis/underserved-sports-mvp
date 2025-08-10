import { sanity } from '@/lib/sanity'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await sanity.fetch(`*[_type=="article" && slug.current==$slug][0]{title,metaTitle,metaDescription,noindex}`, { slug: params.slug })
  if (!a) return {}
  return {
    title: a.metaTitle || a.title,
    description: a.metaDescription || '',
    robots: a.noindex ? { index:false, follow:false } : { index:true, follow:true },
  }
}

export default async function Article({ params }: { params: { slug: string } }) {
  const a = await sanity.fetch(`*[_type=="article" && slug.current==$slug][0]{title,excerpt,"img":heroImage.asset->url,body}`, { slug: params.slug })
  if (!a) return <div className="p-8">Not found</div>
  return (
    <article className="prose lg:prose-lg mx-auto px-6 py-10">
      <h1>{a.title}</h1>
      {a.img && <img src={`${a.img}?w=1200`} alt="" />}
      <p>{a.excerpt}</p>
      {/* TODO: render body blocks later */}
    </article>
  )
}
