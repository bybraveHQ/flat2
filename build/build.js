import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'

mkdirSync(new URL('../dist/', import.meta.url), { recursive: true })

await build({
  entryPoints: [new URL('../index.js', import.meta.url).pathname],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  outfile: new URL('../dist/index.cjs', import.meta.url).pathname,
  // Collapse the CJS namespace onto its default export so `require('@bybrave/flat2')`
  // returns the callable `flatten` with `.flatten` / `.unflatten` attached — the v5
  // shape CJS consumers expect (issues #101, #173, #171, #175).
  footer: { js: 'if(module.exports.default)module.exports=Object.assign(module.exports.default,module.exports);' }
})

console.log('build: dist/index.cjs')
