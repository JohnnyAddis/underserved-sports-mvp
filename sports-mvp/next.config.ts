// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.sanity.io' } // covers cdn.sanity.io
    ],
  },
}

export default nextConfig
