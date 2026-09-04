import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';

// GitHub Pages project site serves this repo under /portfolio_project/, so
// assets and client-side routes both need that base path baked in.
const BASE_PATH = '/portfolio_project/';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact(), pluginTailwindcss()],
  server: {
    base: BASE_PATH,
  },
  tools: {
    rspack: {
      module: {
        rules: [{ test: /\.md$/, type: 'asset/source' }],
      },
    },
  },
  html: {
    title: 'DEV_ARCHITECT - Portfolio',
    tags: [
      {
        tag: 'script',
        head: true,
        append: false,
        children:
          "try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t?t==='dark':true)}catch(e){}",
      },
      {
        tag: 'link',
        attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: true,
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
        },
      },
    ],
  },
});
