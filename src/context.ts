export interface ImagesPluginContext {
  root: string
  images: string[]
}

export const createContext = (): ImagesPluginContext => {
  return {
    root: undefined!,
    images: [],
  }
}
