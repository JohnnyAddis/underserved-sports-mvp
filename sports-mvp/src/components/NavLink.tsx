'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import clsx from 'clsx'

type Props = { href: string; children: ReactNode; className?: string }

export default function NavLink({ href, children, className }: Props) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className={clsx(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        active
          ? 'text-indigo-800 bg-indigo-50'
          : 'text-slate-700 hover:text-indigo-800 hover:bg-slate-100',
        className
      )}
      prefetch={false}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
