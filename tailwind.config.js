/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          display: ['Outfit', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        },
        boxShadow: {
          'flat-sm': '1.5px 1.5px 0px 0px currentColor',
          'flat-md': '3px 3px 0px 0px currentColor',
          'flat-lg': '5px 5px 0px 0px currentColor',
          'flat-slate': '4px 4px 0px 0px #1e293b',
          'flat-slate-sm': '2px 2px 0px 0px #1e293b',
        },
        colors: {
          slate: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
            950: '#09090b',
          }
        }
      },
    },
    plugins: [],
  }