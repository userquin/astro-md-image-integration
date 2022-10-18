import fs from 'fs'
import type { HookParameters } from 'astro'
import type { ImagesPluginContext } from '../context'
import { virtualExternalImagePrefix } from '../utils'

export const DevServerHook = (context: ImagesPluginContext): ((config: HookParameters<'astro:server:setup'>) => Promise<void>) => {
  return async ({ server }) => {
    if (context.dev && !context.serverConfigured) {
      context.serverConfigured = true
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (url?.startsWith(virtualExternalImagePrefix)) {
          const path = url.slice(virtualExternalImagePrefix.length)
          const extIdx = path.lastIndexOf('.')
          let contentType: string | undefined
          if (extIdx > -1) {
            const ext = path.slice(extIdx + 1)
            contentType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`
          }

          const stream = fs.createReadStream(path)
          stream.on('open', () => {
            contentType && res.setHeader('Content-Type', contentType)
            // TODO: handle 302 outside of the stream, if we want to handle not modified
            res.statusCode = 200
            stream.pipe(res)
          })
          stream.on('error', () => {
            res.setHeader('Content-Type', 'text/plain')
            res.statusCode = 404
            res.end('Not found')
          })
          return
        }

        next()
      })
    }
  }
}
