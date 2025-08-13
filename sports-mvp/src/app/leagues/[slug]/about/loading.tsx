export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header skeleton */}
      <header className="mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-slate-200 animate-pulse" />
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="mt-2 h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Quick Facts skeleton */}
      <section className="mb-8 rounded-lg bg-slate-50 p-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-1" />
              <div className="h-6 w-16 bg-slate-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* Content sections skeleton */}
      {[1, 2].map(section => (
        <section key={section} className="mb-8">
          <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse" />
          </div>
        </section>
      ))}
    </div>
  )
}