import Link from 'next/link'
import type { FC, ReactNode } from 'react'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumbs: FC<Props> = ({ items, className }) => {
  if (!items?.length) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {isLast || !item.href ? (
                <span aria-current="page" className="font-medium text-slate-900">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-indigo-700">
                  {item.label}
                </Link>
              )}
              {!isLast && <span className="mx-2 select-none text-slate-400">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
