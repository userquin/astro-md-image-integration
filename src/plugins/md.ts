import { virtualImagePrefix } from '../utils'

export const MdPlugin = () => {
  return () => (tree: any) => findImages(tree)
}

function findImages(tree: any) {
  if (tree.type === 'image') {
    if (!tree.url.startsWith('/'))
      tree.url = `${virtualImagePrefix}${tree.url}`
  }
  else {
    tree.children && tree.children.forEach(findImages)
  }
}
