import path from 'node:path'
import Eta from '@storipress/unplugin-eta'
import Vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),
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
    {
      name: 'replace-data-json',
      resolveId(source) {
        if (source.endsWith('data.schema.json')) {
          return this.resolve('lodash/stubTrue')
        }
        return null
      },
    },
  ],
  resolve: {
    alias: {
      '@storipress/block': path.resolve(__dirname, './packages/elements/block-elements'),
      '@storipress/article': path.resolve(__dirname, './packages/elements/article-elements'),
      data: path.resolve(__dirname, './sdk/data-shim.ts'),
    },
  },
  test: {
    server: {
      deps: {
        inline: ['@storipress/color-picker'],
      },
    },
    deps: {
      optimizer: {
        // web: {
        //   include: ['@storipress/color-picker'],
        // },
      },
      // web: {
      //   transformGlobPattern: [/\.vue$/]
      // }
    },
    globals: true,
    environment: 'happy-dom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      './tmp/**',
      '**/dist-*/**',
      './packages/templates/sources/**',
    ],
  },
})
