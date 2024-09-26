const { resolve, join } = require('node:path')
const { readPackageSync } = require('read-pkg')

const WORKSPACE_ROOT = resolve(__dirname, '../../..')
const PACKAGES_ROOT = resolve(WORKSPACE_ROOT, 'packages')
const PATTERNS = ['**/*.html', '**/*.vue', '**/*.jsx', '**/*.tsx', '**/*.ts']

const SRC_PATH = ['src']

const COMPONENT_PATH = {
  '@storipress/editor': SRC_PATH,
  '@storipress/builder': SRC_PATH,
  '@storipress/elements': ['article-elements', 'block-elements', 'common'],
  '@storipress/editor-core': ['example', 'common', 'remote-dialog', 'unsplash-picker', 'rich-input', 'schema', 'core'],
  '@storipress/templates': ['articles', 'blocks', 'other-blocks', 'other-pages'],
  shared: ['components'],
}

exports.buildPurgePaths = function buildPurgePaths(base) {
  const pkg = readPackageSync({ cwd: base })
  const deps = [
    pkg.name,
    ...Object.keys(pkg.dependencies ?? {}).filter((dep) => dep.startsWith('@storipress') || dep === 'shared'),
  ]
  const componentPaths = deps.flatMap((dep) =>
    (COMPONENT_PATH[dep] ?? []).map((path) => resolve(PACKAGES_ROOT, dep.replace('@storipress/', ''), path))
  )
  return [
    ...componentPaths.flatMap((path) => PATTERNS.map((pattern) => join(path, pattern))),
    resolve(PACKAGES_ROOT, 'shared/content.scss'),
  ]
}
