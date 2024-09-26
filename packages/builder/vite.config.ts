import type { Plugin } from 'vite'
import type {} from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import Eta from '@storipress/unplugin-eta'
import Vue from '@vitejs/plugin-vue2'
import { compileTemplate } from '@vue/compiler-sfc'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import Inspect from 'vite-plugin-inspect'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// from @kingyue/vite-plugin-vue2-svg
export function createSvgPlugin(
  options: {
    defaultImport?: 'url' | 'raw'
  } = {},
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

export default defineConfig(({ mode, command }) => {
  // skipcq: JS-W1043
  const configMode = process.env.TARGET || mode || 'development'
  const { SENTRY_AUTH_TOKEN } = loadEnv(configMode, process.cwd(), '')

  return {
    base: '/builder/',
    mode: configMode,
    build: {
      sourcemap: 'hidden',
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
        'vuex-hooks': require.resolve('./vuex-hooks/index.ts'),
        '~': resolve(__dirname, 'src'),
      },
      extensions: ['.tsx', '.jsx', '.rollup.ts', '.ts', '.js', '.json', '.mjs'],
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    plugins: [
      AutoImport({
        imports: ['vue', '@vueuse/core'],
      }),
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
      sentryVitePlugin({
        disable: command === 'serve',
        authToken: SENTRY_AUTH_TOKEN,
        org: 'storipress',
        project: 'builder',
        sourcemaps: {
          assets: ['dist/**/*.js', 'dist/**/*.map'],
          deleteFilesAfterUpload: ['dist/**/*.map'],
        },
      }),
    ],
  }
})
