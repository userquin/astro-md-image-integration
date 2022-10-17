export interface ImagesPluginContext {
  root: string
  dev: boolean
  build: boolean
  preview: boolean
  serverConfigured: boolean
  assetsImages: string[]
  buildImages: string[]
}

export const createContext = (): ImagesPluginContext => {
  return {
    root: undefined!,
    dev: false,
    preview: false,
    build: false,
    serverConfigured: false,
    assetsImages: [],
    buildImages: [],
  }
}
