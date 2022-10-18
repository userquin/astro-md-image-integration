import { fileURLToPath } from 'url'
import { basename, dirname, relative } from 'path'
import { promises as fs } from 'fs'
import { resolve } from 'node:path'
import type { HookParameters } from 'astro'
import type { ImagesPluginContext } from '../context'
import { outputImageDir } from '../utils'

export const BuildHook = (context: ImagesPluginContext): ((config: HookParameters<'astro:build:done'>) => Promise<void>) => {
  return async ({ dir }) => {
    const {
      buildImages,
      options: {
        root,
        excludeRoot = false,
      },
    } = context
    const rootDir = resolve(root)
    const dirOutputName = fileURLToPath(dir.href).replace(/\\/g, '/')
    const folder = `${dirOutputName}${excludeRoot ? '' : `${basename(rootDir)}/`}${outputImageDir}`.replace(/\\/g, '/')
    await fs.mkdir(folder, { recursive: true })
    const imageSet = Array.from(new Set(buildImages))
    for (const image of imageSet) {
      const relativePath = relative(rootDir, image).replace(/\\/g, '/')
      const dest = `${folder}/${relativePath}`
      await fs.mkdir(dirname(dest), { recursive: true })
      await fs.copyFile(image, dest)
    }
  }
}
