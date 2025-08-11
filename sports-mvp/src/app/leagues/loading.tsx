import { LeagueCardSkeleton } from '@/components/Skeletons'

export default function LoadingLeagues() {
  return (
    <div className="space-y-6 px-6 py-10">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i: number) => (
          <LeagueCardSkeleton key={i} />
        ))}
      </ul>
    </div>
  )
}
