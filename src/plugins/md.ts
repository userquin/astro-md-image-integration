import { virtualImagePrefix } from '../utils'
import type { ImagesPluginContext } from '../context'

export const MdPlugin = (context: ImagesPluginContext) => {
  return () => (tree: any) => findImages(tree, context)
}

function findImages(tree: any, context: ImagesPluginContext) {
  if (tree.type === 'image') {
    if (!tree.url.startsWith('/'))
      tree.url = `${virtualImagePrefix}${tree.url}`
    else if (!tree.url.startsWith(context.base) && context.build)
      tree.url = tree.url.replace('/', context.base)
  }
  else {
    tree.children && tree.children.forEach((child: any) => {
      findImages(child, context)
    })
  }
}
