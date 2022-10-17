import { defineConfig } from 'astro/config'
import AstroMdImages from 'astro-md-image-integration'

// https://astro.build/config
export default defineConfig({
  base: '/docs',
  integrations: [AstroMdImages()],
})
