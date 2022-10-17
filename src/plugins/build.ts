import { fileURLToPath } from 'url'
import { dirname, relative } from 'path'
import { promises as fs } from 'fs'
import type { HookParameters } from 'astro'
import type { ImagesPluginContext } from '../context'

export const BuildPlugin = (context: ImagesPluginContext): ((config: HookParameters<'astro:build:done'>) => Promise<void>) => {
  return async ({ dir }) => {
    const { images, root } = context
    const dirName = fileURLToPath(dir.href).replace(/\\/g, '/')
    const imageSet = Array.from(new Set(images.map(i => relative(root, i).replace(/\\/g, '/'))))
    await Promise.all(imageSet.map(async (i) => {
      return fs.mkdir(`${dirName}${dirname(i)}`, { recursive: true })
    }))
    await Promise.all(imageSet.map(async (i) => {
      return fs.copyFile(`${root}/${i}`, `${dirName}${i}`)
    }))
  }
}
