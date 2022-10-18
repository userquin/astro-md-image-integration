import { basename, dirname, relative } from 'path'
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
        const {
          base,
          buildImages,
          projectRoot,
          options: {
            root,
            excludeRoot = false,
          },
        } = context
        const regex = createVirtualImagePrefixRegExp()
        let matcher = regex.exec(code)
        if (matcher) {
          let newCode = code
          const path = dirname(relative(projectRoot, id)).replace(/\\/g, '/')
          const realPath = resolve(path).replaceAll('\\', '/')
          const rootDir = resolve(root)
          const rootDirName = basename(rootDir)
          do {
            if (path.startsWith('../')) {
              if (context.build) {
                const image = resolve(realPath, matcher[2]).replace(/\\/g, '/')
                buildImages.push(image)
                const relativePath = relative(rootDir, image).replace(/\\/g, '/')
                newCode = newCode.replaceAll(
                  matcher[1],
                    `src=\\"${base}${excludeRoot ? '' : `${rootDirName}/`}${outputImageDir}/${relativePath}\\"`,
                )
              }
              else {
                newCode = newCode.replaceAll(
                  matcher[1],
                    `src=\\"${virtualExternalImagePrefix}${realPath}/${matcher[2]}\\"`,
                )
              }
            }
            else {
              // TODO: why we include this if/else statement?
              // if (!matcher[2].startsWith(base) && context.build)
              //   newCode = newCode.replaceAll(matcher[1], `src=\\"${base}${matcher[2]}\\"`)
              // else
              //   newCode = newCode.replaceAll(matcher[1], `src=\\"${matcher[2]}\\"`)
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
