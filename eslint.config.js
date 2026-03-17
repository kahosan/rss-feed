import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['shims.d.ts', 'workers-site/index.js'],
  jsonc: false,
})
