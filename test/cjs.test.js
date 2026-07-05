import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

// Exercises the built CommonJS bundle (dist/index.cjs). Run `npm run build`
// first — CI does this before `npm test`. Guards the core value of the fork:
// `require()` works again and returns the v5 shape (issues #101/#173/#171/#175).
const require = createRequire(import.meta.url)
const flat = require('../dist/index.cjs')

test('require() returns a callable flatten (v5 drop-in)', () => {
  assert.equal(typeof flat, 'function')
  assert.deepEqual(flat({ a: { b: 1 } }), { 'a.b': 1 })
})

test('require() exposes named .flatten / .unflatten', () => {
  assert.equal(typeof flat.flatten, 'function')
  assert.equal(typeof flat.unflatten, 'function')
  assert.deepEqual(flat.flatten({ a: { b: 1 } }), { 'a.b': 1 })
  assert.deepEqual(flat.unflatten({ 'a.b': 1 }), { a: { b: 1 } })
})

test('destructuring require() works', () => {
  const { flatten, unflatten } = require('../dist/index.cjs')
  assert.deepEqual(flatten({ x: { y: 'z' } }), { 'x.y': 'z' })
  assert.deepEqual(unflatten({ 'x.y': 'z' }), { x: { y: 'z' } })
})

test('CJS output matches ESM output', async () => {
  const esm = await import('../index.js')
  assert.deepEqual(
    flat.flatten({ a: { b: { c: 1 } } }),
    esm.flatten({ a: { b: { c: 1 } } })
  )
})
