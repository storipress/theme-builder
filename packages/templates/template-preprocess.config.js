import { resolve } from 'node:path'

const IGNORE = ['**/preview.{png,jpg,jpeg,webp}']

export default {
  styles: [resolve(__dirname, 'dist')],
  templates: [
    {
      type: 'front-page',
      pattern: resolve(__dirname, 'dist/blocks/*/*/block'),
      directory: true,
      ignore: IGNORE,
      archive: {
        name: 'block',
        base: resolve(__dirname, 'dist/blocks'),
        file: resolve(__dirname, './pack-templates/block.tar.br'),
        include: ['./dist/blocks/index.js', './dist/blocks/fallback.json', './dist/blocks/version'],
      },
    },
    {
      type: 'article',
      pattern: resolve(__dirname, './dist/articles/*/block'),
      directory: true,
      ignore: IGNORE,
      archive: {
        name: 'article',
        base: resolve(__dirname, './dist/articles'),
        file: resolve(__dirname, './pack-templates/article.tar.br'),
        include: ['./dist/articles/index.js', './dist/articles/fallback.json', './dist/articles/version'],
      },
    },
    {
      type: 'page',
      pattern: resolve(__dirname, './dist/pages/*/block'),
      directory: true,
      ignore: IGNORE,
      archive: {
        name: 'page',
        base: resolve(__dirname, './dist/pages'),
        file: resolve(__dirname, './pack-templates/page.tar.br'),
        include: ['./dist/pages/index.js', './dist/pages/fallback.json', './dist/page/version'],
      },
    },
    {
      type: 'other',
      pattern: [resolve(__dirname, './dist/other/subscribe/**/*.vue')],
      directory: false,
      ignore: IGNORE,
      archive: {
        name: 'other',
        base: resolve(__dirname, './dist/other'),
        file: resolve(__dirname, './pack-templates/other.tar.br'),
        include: [
          './dist/other/blockquote/**/style.scss',
          './dist/other/dropcap/**/style.scss',
          './dist/other/version',
        ],
      },
    },
  ],
}
