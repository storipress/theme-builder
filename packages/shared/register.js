require('@babel/register')({
  extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
  ignore: [/node_modules\/(?!shared).*/],
})

if (globalThis.process && globalThis.process.release && globalThis.process.release.name === 'node') {
  const { process } = require('@vue/vue2-jest')
  const { addHook } = require('pirates')
  const { eta } = require('./hooks/eta')
  addHook(eta, { exts: ['.ejs', '.eta'] })
  addHook(
    (code, filename) => {
      const compiledVue = process(code, filename, {
        config: { cwd: globalThis.process.cwd() },
      })
      return compiledVue.code
    },
    { exts: ['.vue'] }
  )
}
