'use client'

import React from 'react'
import clsx from 'clsx'

function shimmer(className?: string) {
  return clsx('animate-pulse bg-gray-200 dark:bg-gray-800', className)
}

export function ArticleCardSkeleton() {
  return (
    <div className="border rounded-xl p-4">
      <div className={shimmer('h-40 w-full rounded-md mb-3')} />
      <div className={shimmer('h-5 w-3/4 rounded')} />
      <div className={shimmer('h-4 w-full rounded mt-2')} />
      <div className={shimmer('h-4 w-5/6 rounded mt-1')} />
    </div>
  )
}

export function LeagueCardSkeleton() {
  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={shimmer('h-10 w-10 rounded')} />
        <div className="flex-1">
          <div className={shimmer('h-4 w-1/2 rounded')} />
          <div className={shimmer('h-3 w-1/3 rounded mt-2')} />
        </div>
      </div>
    </div>
  )
}

export function ParagraphSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={shimmer('h-4 w-full rounded')} />
      ))}
    </div>
  )
}
