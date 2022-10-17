import { fileURLToPath } from 'url'
import type { AstroIntegration } from 'astro'
import type { ImagesPluginContext } from './context'
import { createContext } from './context'
import { PathsPlugin } from './plugins/paths'
import { MdPlugin } from './plugins/md'
import { BuildPlugin } from './plugins/build'

export default function (): AstroIntegration {
  const context: ImagesPluginContext = createContext()

  return {
    name: '@vite-pwa/astro-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            extendDefaultPlugins: true,
            remarkPlugins: [MdPlugin()],
          },
          vite: {
            plugins: [PathsPlugin(context)],
          },
        })
      },
      'astro:config:done': ({ config }) => {
        context.root = fileURLToPath(config.root)
      },
      'astro:build:done': BuildPlugin(context),
    },
  }
}
