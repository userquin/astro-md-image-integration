import path, { dirname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { cwd } from 'process'
import { defineConfig } from 'astro/config'
import type { Plugin } from 'vite'

const findImages = (tree: any) => {
  if (tree.type === 'image') {
    if (!tree.url.startsWith('/'))
      tree.url = `/@virtual-img/${tree.url}`
  }
  else {
    tree.children && tree.children.forEach(findImages)
  }
}

let root = cwd()
const images: string[] = []

// https://astro.build/config
export default defineConfig({
  base: '/docs',
  integrations: [
    {
      name: 'astro-md-image-integration',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            markdown: {
              extendDefaultPlugins: true,
              remarkPlugins: [() => {
                return (tree: any) => {
                  findImages(tree)
                }
              }],
            },
            vite: {
              plugins: [
                <Plugin>{
                  name: 'astro-md-image-plugin',
                  enforce: 'pre',
                  async transform(code, id) {
                    if (id.endsWith('.md')) {
                      const regex = /\\"(\/@virtual-img\/(.*?\.[a-z]{3,}))\\"/gm
                      let matcher = regex.exec(code)
                      if (matcher) {
                        let newCode = code
                        let assetPath: string
                        const fileRootDir = dirname(id)
                        do {
                          assetPath = resolve(fileRootDir, matcher[2])
                            .replace(root, '')
                            .split(path.sep)
                            .filter(p => p.trim() !== '')
                            .join(path.posix.sep)

                          images.push(assetPath)
                          newCode = newCode.replaceAll(matcher[1], assetPath)
                          newCode = newCode.replaceAll(`(${matcher[2]})`, assetPath)
                          matcher = regex.exec(newCode)
                        }
                        while (matcher)

                        return newCode
                      }
                      return code
                    }
                  },
                },
              ],
            },
          })
        },
        'astro:config:done': ({ config }) => {
          root = fileURLToPath(config.root)
        },
        'astro:build:done': async ({ dir }) => {
          const dirName = fileURLToPath(dir.href).replace(/\\/g, '/')
          const imageSet = Array.from(new Set(images.map(i => relative(root, i).replace(/\\/g, '/'))))
          await Promise.all(imageSet.map(async (i) => {
            return fs.mkdir(`${dirName}${dirname(i)}`, { recursive: true })
          }))
          await Promise.all(imageSet.map(async (i) => {
            return fs.copyFile(`${root}/${i}`, `${dirName}${i}`)
          }))
        },
      },
    },
  ],
})
