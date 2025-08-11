import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            h1: { color: theme('colors.slate.900') },
            h2: { color: theme('colors.slate.900') },
            h3: { color: theme('colors.slate.900') },
            a: {
              color: theme('colors.indigo.700'),
              textDecoration: 'none',
              fontWeight: '600',
            },
            'a:hover': { color: theme('colors.indigo.800') },
            hr: { borderColor: theme('colors.slate.200') },
            blockquote: {
              color: theme('colors.slate.800'),
              borderLeftColor: theme('colors.slate.200'),
            },
            code: { color: theme('colors.indigo.700') },
            figcaption: { color: theme('colors.slate.500') },
          },
        },
        invert: {
          // keep dark mode styles around in case we add a toggle later
          css: {
            '--tw-prose-body': theme('colors.slate.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.indigo.300'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-quotes': theme('colors.slate.300'),
            '--tw-prose-captions': theme('colors.slate.400'),
          },
        },
      }),
    },
  },
  plugins: [typography],
}

export default config
