import type { AstroIntegration } from 'astro'
import { createAstroIntegration } from './hooks'
import type { MdImageOptions } from './types'

export * from './types'

export default function (options: MdImageOptions): AstroIntegration {
  return createAstroIntegration(options)
}
