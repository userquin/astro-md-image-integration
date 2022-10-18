import type { MdImageOptions } from './types'

export interface ImagesPluginContext {
  options: MdImageOptions
  base: string
  projectRoot: string
  dev: boolean
  build: boolean
  preview: boolean
  serverConfigured: boolean
  assetsImages: string[]
  buildImages: string[]
}

export const createContext = (options: MdImageOptions): ImagesPluginContext => {
  return {
    options,
    base: undefined!,
    projectRoot: undefined!,
    dev: false,
    preview: false,
    build: false,
    serverConfigured: false,
    assetsImages: [],
    buildImages: [],
  }
}
