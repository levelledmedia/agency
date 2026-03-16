// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://levelledmedia.com',
  output: 'static',
  build: {
    format: 'directory'
  }
});
