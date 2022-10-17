import { fileURLToPath } from 'url'
import { dirname, relative } from 'path'
import { promises as fs } from 'fs'
import type { HookParameters } from 'astro'
import type { ImagesPluginContext } from '../context'
import { outputImageDir } from '../utils'

export const BuildHook = (context: ImagesPluginContext): ((config: HookParameters<'astro:build:done'>) => Promise<void>) => {
  return async ({ dir }) => {
    // TODO: disabled until we can figure out how to configure the outer content folder
    if (true)
      return

    const { buildImages } = context
    const dirName = fileURLToPath(dir.href).replace(/\\/g, '/')
    const folder = `${dirName}/${outputImageDir}`
    // TODO: buildImages contains absolute paths, maybe we need to add the pair or just refactor to include the roots?
    await fs.mkdir(folder, { recursive: true })
    const imageSet = Array.from(new Set(buildImages))
    // const imageSet = Array.from(new Set(buildImages.map(i => relative(root, i).replace(/\\/g, '/'))))
    await Promise.all(imageSet.map(async (i) => {
      return fs.mkdir(`${folder}${dirname(i)}`, { recursive: true })
      // return fs.mkdir(`${dirName}${dirname(i)}`, { recursive: true })
    }))
    await Promise.all(imageSet.map(async (i) => {
      return fs.copyFile(i, `${dirName}${i}`)
      // return fs.copyFile(`${root}/${i}`, `${dirName}${i}`)
    }))
  }
}
