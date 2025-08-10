import { ArticleCardSkeleton } from '@/components/Skeletons'

export default function LoadingHome() {
  return (
    <main className="px-6 py-10 space-y-6">
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
