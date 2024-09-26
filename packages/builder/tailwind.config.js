const { buildPurgePaths } = require('shared/build/build-purge-paths')
const config = require('shared/tailwind.config')

module.exports = {
  presets: [config],
  content: buildPurgePaths(__dirname),
  plugins: [require('tailwind-scrollbar-hide')],
}
