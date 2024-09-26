import type { Plugin } from 'vite'
import type {} from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import Eta from '@storipress/unplugin-eta'
import Vue from '@vitejs/plugin-vue2'
import { compileTemplate } from '@vue/compiler-sfc'
import { defineConfig, mergeConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import Inspect from 'vite-plugin-inspect'

const require = createRequire(import.meta.url)

const external = new Set(['vue', 'lodash', 'postcss', 'postcss-nested', 'fs', 'path', 'data'])

// from @kingyue/vite-plugin-vue2-svg
export function createSvgPlugin(
  options: {
    defaultImport?: 'url' | 'raw'
  } = {}
): Plugin {
  const { defaultImport } = options
  const svgRegex = /\.svg(\?(raw|component|skipsvgo))?$/

  return {
    name: 'vite-plugin-vue2-svg',
    enforce: 'pre',
    async load(id: string) {
      if (!svgRegex.test(id)) {
        return
      }

      const [path, query] = id.split('?', 2)
      const importType = query || defaultImport
      if (/\?raw/.test(id)) {
        return null
      }
      if (importType === 'url') {
        return // Use default svg loader
      }

      let svg: string

      try {
        svg = readFileSync(path, { encoding: 'utf-8' })
      } catch (error) {
        console.warn('\n', `${id} couldn't be loaded by vite-plugin-vue2-svg, fallback to default loader`)
        return
      }

      if (importType === 'raw') {
        return `export default ${JSON.stringify(svg)}`
      }

      svg = svg.replace('<svg', '<svg v-on="$listeners"')

      const { code } = compileTemplate({
        source: svg,
        filename: path,
        transformAssetUrls: false,
        prettify: false,
      })

      return `${code}\nexport default { render: render }`
    },
  }
}

const libConfig = {
  articleSDK: {
    entry: { 'article-sdk': './sdk/article.ts' },
    formats: ['es'],
  },
  blockSDK: {
    entry: { 'block-sdk': './sdk/block.ts' },
    formats: ['es'],
  },
  testUtils: {
    name: 'TestUtils',
    entry: { 'test-utils': './sdk/test-utils/index.ts' },
    formats: ['umd'],
  },
}
function createLibConfig(mode: string) {
  return libConfig[mode]
}

export default defineConfig(({ mode }) => {
  // skipcq: JS-W1043
  const configMode = process.env.TARGET || mode || 'development'

  const config = defineConfig({
    mode: configMode,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
      sourcemap: 'hidden',
      lib: createLibConfig(mode),
      outDir: './',
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          sourcemap: false,
        },
        external: (id) => {
          if (external.has(id)) {
            return true
          }
          return id.startsWith('@babel/runtime')
        },
        treeshake: {
          moduleSideEffects: false,
        },
      },
    },
    test: {
      environment: 'jsdom',
      deps: {
        inline: ['@storipress/color-picker'],
      },
    },
    resolve: {
      alias: {
        '@storipress/article/mixins': require.resolve('@storipress/elements/_mixins.scss'),
        '@storipress/article': '@storipress/elements/article-elements',
        '@storipress/block': '@storipress/elements/block-elements',
        '@storipress/tiptap-schema': '@storipress/tiptap-schema/browser',
        'vuex-hooks': require.resolve('../builder/vuex-hooks/index.ts'),
      },
      extensions: ['.tsx', '.jsx', '.rollup.ts', '.ts', '.js', '.json', '.mjs'],
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    plugins: [
      cssInjectedByJsPlugin(),
      Inspect(),
      Vue(),
      createSvgPlugin(),
      Eta.vite({
        include: [/\.eta$/],
        options: {
          rmWhitespace: true,
          autoEscape: false,
        },
      }),
      Eta.vite({
        include: [/\.ejs$/],
        options: {
          rmWhitespace: true,
          autoEscape: false,
          autoTrim: 'slurp',
          tags: ['{{', '}}'],
        },
      }),
    ],
  })

  if (mode === 'test') {
    return mergeConfig(config, {
      resolve: {
        alias: {
          data: path.resolve(__dirname, './sdk/data-shim.ts'),
        },
      },
    })
  }

  return config
})
