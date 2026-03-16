// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://levelledmedia.github.io',
  base: '/agency',
  output: 'static',
  build: {
    format: 'directory'
  }
});
