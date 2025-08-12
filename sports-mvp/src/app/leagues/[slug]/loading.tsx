import { ParagraphSkeleton, ArticleCardSkeleton } from '@/components/Skeletons'

export default function LoadingLeague() {
  return (
    <div className="px-6 py-10 space-y-8">
      <nav className="h-4 w-56 bg-gray-200 dark:bg-gray-800 rounded" />
      <header className="flex items-center gap-4">
        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
      </header>

      <section>
        <ParagraphSkeleton lines={6} />
      </section>

      <section className="space-y-3">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i: number) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </ul>
      </section>
    </div>
  )
}
