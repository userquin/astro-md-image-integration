import { dirname, relative } from 'path'
// import { promises as fs } from 'fs'
import type { Plugin } from 'vite'
import type { ImagesPluginContext } from '../context'

export const PathsPlugin = (context: ImagesPluginContext): Plugin => {
  return {
    name: 'astro-md-image:paths',
    enforce: 'pre',
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const { root, images } = context
        const regex = /(src=\\"\/@virtual-img\/(.*?\.[a-z]{3,}))\\"/gm
        let matcher = regex.exec(code)
        if (matcher) {
          let newCode = code
          const path = dirname(relative(root, id)).replace(/\\/g, '/')
          do {
            images.push(`${path}/${matcher[2]}`)
            newCode = newCode.replaceAll(matcher[1], `src=\\"${path}/${matcher[2]}\\"`)
            matcher = regex.exec(newCode)
          }
          while (matcher)

          return newCode
        }

        return code
      }
    },
  }
}
