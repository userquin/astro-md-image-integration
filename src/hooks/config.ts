import { fileURLToPath } from 'url'
import type { HookParameters } from 'astro'
import type { ImagesPluginContext } from '../context'
import { PathsPlugin } from '../plugins/paths'
import { AssetsPlugin } from '../plugins/assets'
import { MdPlugin } from '../plugins/md'

export const ConfigSetupHook = (context: ImagesPluginContext): ((config: HookParameters<'astro:config:setup'>) => Promise<void>) => {
  return async ({ command, updateConfig }) => {
    context.dev = command === 'dev'
    context.preview = command === 'preview'
    context.build = command === 'build'
    const plugins = [PathsPlugin(context)]
    if (context.build)
      plugins.push(AssetsPlugin(context))

    updateConfig({
      markdown: {
        extendDefaultPlugins: true,
        remarkPlugins: [MdPlugin()],
      },
      vite: {
        plugins,
      },
    })
  }
}

export const ConfigDoneHook = (context: ImagesPluginContext): ((config: HookParameters<'astro:config:done'>) => Promise<void>) => {
  return async ({ config }) => {
    context.root = fileURLToPath(config.root)
  }
}
