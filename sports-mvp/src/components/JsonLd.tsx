'use client'

import React from 'react'

type Props = { data: Record<string, unknown> }

/** Safely injects a JSON-LD script tag */
export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
