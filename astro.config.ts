import { dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { defineConfig } from 'astro/config'
import type { Plugin } from 'vite'

const findImages = (tree: any) => {
  if (tree.type === 'image')
    tree.url = `/@virtual-img/${tree.url}`
  else
    tree.children && tree.children.forEach(findImages)
}

const root = dirname(fileURLToPath(import.meta.url))
const images: string[] = []

// https://astro.build/config
export default defineConfig({
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
                      const matcher = /\\"(\/@virtual-img\/(.*\.[a-z]{3,}))\\"/.exec(code)
                      if (matcher) {
                        const path = dirname(relative(root, id)).replace(/\\/g, '/')
                        images.push(`${path}/${matcher[2]}`)
                        const newCode = code.replaceAll(matcher[1], `${path}/${matcher[2]}`)
                        return newCode.replaceAll(`(${matcher[2]})`, `(${path}/${matcher[2]})`)
                      }
                    }
                  },
                },
              ],
            },
          })
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
