// src/components/Breadcrumbs.tsx
import Link from 'next/link'

export type Crumb = { name: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded px-1 py-0.5 text-slate-700 hover:text-indigo-700 hover:bg-slate-50"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="px-1 py-0.5 text-slate-500" aria-current="page">
                  {item.name}
                </span>
              )}
              {!isLast && <span aria-hidden="true" className="text-slate-400">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
