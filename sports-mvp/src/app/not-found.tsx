import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-gray-600 max-w-prose">
        The page you’re looking for doesn’t exist. Try browsing the latest articles or pick a league.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-lg border px-4 py-2 hover:shadow">Home</Link>
        <Link href="/leagues" className="rounded-lg border px-4 py-2 hover:shadow">Leagues</Link>
      </div>
    </main>
  )
}
