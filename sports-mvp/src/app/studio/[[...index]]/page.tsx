'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config' // relative to this file

export default function StudioPage() {
  return <NextStudio config={config} />
}


