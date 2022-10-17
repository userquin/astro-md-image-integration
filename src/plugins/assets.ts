import type { Plugin } from 'vite'
import type { ImagesPluginContext } from '../context'

export const AssetsPlugin = (_: ImagesPluginContext): Plugin => {
  return {
    name: 'astro-md-image:assets',
    enforce: 'post',
    apply: 'build',
  }
}
