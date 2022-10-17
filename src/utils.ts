export const virtualImagePrefix = '/@astro-md-img-integration/'
export const virtualExternalImagePrefix = `/@fs-${virtualImagePrefix.slice(2)}`
export const outputImageDir = 'astro-md-img-integration'

export const createVirtualImagePrefixRegExp = () => {
  return /(src=\\"\/@astro-md-img-integration\/(.*?\.[a-z]{3,})\\")/gm
}
