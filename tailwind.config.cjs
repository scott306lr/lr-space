const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',

  safelist: [
    // for markdown autolink
    'align-baseline',
    'items-baseline',
    'justify-end',
    'flex-row-reverse',
    '-ml-8',
    'w-8',
    'h-6',
    'opacity-0',
    'group',
    'group-hover:opacity-100',
  ],
  keyframes: {
    'moving-line': {
      from: {
        width: '0px',
        opacity: '0',
      },
      to: {
        width: '30%',
        opacity: '0.6',
      },
    },
  },
  animation: {
    'moving-line': 'moving-line .8s ease .5s forwards',
  },
  variants: {
    animation: ['motion-safe'],
  },
};
