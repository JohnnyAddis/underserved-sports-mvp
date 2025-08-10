import { ParagraphSkeleton } from '@/components/Skeletons'

export default function LoadingArticle() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <nav className="h-4 w-60 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-[315px] sm:h-[420px] w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <section>
        <ParagraphSkeleton lines={12} />
      </section>
    </main>
  )
}
