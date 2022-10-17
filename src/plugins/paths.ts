import { dirname, relative } from 'path'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import type { ImagesPluginContext } from '../context'
import { createVirtualImagePrefixRegExp, outputImageDir, virtualExternalImagePrefix } from '../utils'

export const PathsPlugin = (context: ImagesPluginContext): Plugin => {
  return {
    name: 'astro-md-image:paths',
    enforce: 'pre',
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const { root, buildImages } = context
        const regex = createVirtualImagePrefixRegExp()
        let matcher = regex.exec(code)
        if (matcher) {
          let newCode = code
          const path = dirname(relative(root, id)).replace(/\\/g, '/')
          const realPath = resolve(path).replaceAll('\\', '/')
          do {
            if (path.startsWith('../')) {
              buildImages.push(realPath)
              if (context.build)
                newCode = newCode.replaceAll(matcher[1], `src=\\"${outputImageDir}/${matcher[2]}\\"`)
              else
                newCode = newCode.replaceAll(matcher[1], `src=\\"${virtualExternalImagePrefix}${realPath}/${matcher[2]}\\"`)
            }
            else {
              newCode = newCode.replaceAll(matcher[1], `src=\\"${matcher[2]}\\"`)
            }

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
