const antfu = require('@antfu/eslint-config').default
const prettier = require('eslint-plugin-prettier')

const ignores = [
  'dist',
  '**/dist/**',
  '**/*.toml',
  'storypress-components',
  '**/storypress-components/**',
  'generated',
  '**/generated/**',
  'site-templates',
  '**/site-templates/**',
  'packages/elements/sdk.js',
  'packages/elements/sdk.js/**',
  'packages/elements/test-utils.js',
  'packages/elements/test-utils.js/**',
  'packages/elements/display/common/image-focus',
  'packages/elements/display/common/image-focus/**',
  'packages/shared/iconfont-v*/demo-files',
  'packages/shared/iconfont-v*/demo-files/**',
  'packages/editor-core/schema/embed/easymde',
  'packages/editor-core/schema/embed/easymde/**',
  'packages/builder/vuex-hooks',
  'packages/builder/vuex-hooks/**',
  'packages/elements/article-sdk.js',
  'packages/elements/block-sdk.js',
  'packages/templates/sources',
  'packages/templates/sources/**',
  'packages/templates/blocks',
  'packages/templates/blocks/**',
  'packages/templates/articles',
  'packages/templates/articles/**',
  'packages/templates/other-blocks',
  'packages/templates/other-blocks/**',
  'packages/templates/other-pages',
  'packages/templates/other-pages/**',
  'tmp',
  '**/tmp/**',
  '!packages/templates/blocks/index.ts',
  '!packages/templates/blocks/index.ts/**',
  'iconfonts*',
  '**/iconfonts*/**',
]

module.exports = antfu(
  {
    ignores,
    stylistic: false,
    plugins: { prettier },
    vue: {
      vueVersion: 2,
      sfcBlocks: {
        blocks: {
          styles: false,
        },
      },
    },
    rules: {
      'antfu/top-level-function': 'error',
      'prettier/prettier': 'error',

      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    ignores,
  }
)
