import type { AstroIntegration } from 'astro'
import { createContext } from '../context'
import type { MdImageOptions } from '../types'
import { ConfigDoneHook, ConfigSetupHook } from './config'
import { DevServerHook } from './devServer'
import { BuildHook } from './build'

export const createAstroIntegration = (options: MdImageOptions): AstroIntegration => {
  const context = createContext(options)
  return {
    name: 'astro-md-image-integration',
    hooks: {
      'astro:config:setup': ConfigSetupHook(context),
      'astro:server:setup': DevServerHook(context),
      'astro:config:done': ConfigDoneHook(context),
      'astro:build:done': BuildHook(context),
    },
  }
}
