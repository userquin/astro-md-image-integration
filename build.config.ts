import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vite',
    'astro',
    'astro-integration',
  ],
  rollup: {
    emitCJS: true,
  },
})
