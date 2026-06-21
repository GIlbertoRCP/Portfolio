// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind'; // Swapped to the Astro integration

// https://astro.build/config
export default defineConfig({
  // Update this to your custom domain or GitHub user domain
  site: 'https://GIlbertoRCP.github.io',
  
  // Set the base path to match your repository name on GitHub (e.g. '/portfolio')
  // If deploying to a personal user page (https://GIlbertoRCP.github.io/), set base to '/'
  base: '/portfolio',
  
  integrations: [
    mdx(), 
    sitemap(), 
    react(),
    tailwind() // Added to the integrations array
  ]
});