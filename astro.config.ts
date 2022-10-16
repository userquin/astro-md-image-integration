import { defineConfig } from 'astro/config';
import { relative, dirname  } from 'path';
import { fileURLToPath } from 'url'

const findImages = (tree: any) => {
    if (tree.type === 'image')
        tree.url = `/@virtual-img/${tree.url}`
    else
        tree.children && tree.children.forEach(findImages)
}

const root = dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
    markdown: {
        extendDefaultPlugins: true,
        remarkPlugins: [() => {
            return (tree) => {
                findImages(tree);
            }
        }],
    },
    vite: {
        plugins: [
            {
                name: 'astro-md-image-plugin',
                enforce: 'pre',
                async transform(code, id) {
                    if (id.endsWith('.md')) {
                        let matcher = /\\"(\/@virtual-img\/(.*\.[a-z]{3,}))\\"/.exec(code)
                        if (matcher) {
                            const path = dirname(relative(root, id)).replace(/\\/g, '/')
                            const newCode = code.replaceAll(matcher[1], `${path}/${matcher[2]}`)
                            return newCode.replaceAll(`(${matcher[2]})`, `(${path}/${matcher[2]})`)
                        }
                    }
                },
            }
        ]
    }
});
