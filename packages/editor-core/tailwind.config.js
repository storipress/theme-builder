const { buildPurgePaths } = require('shared/build/build-purge-paths')
const config = require('shared/tailwind.config')

module.exports = {
  ...config,
  content: buildPurgePaths(__dirname),
}
