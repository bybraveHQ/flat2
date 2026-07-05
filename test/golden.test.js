import { test } from 'node:test'
import assert from 'node:assert/strict'
import { flatten, unflatten } from '../index.js'
import * as orig from './fixtures/orig.mjs'

// Byte-for-byte compatibility: the fork must produce output identical to
// flat@6.0.1 across a broad battery of inputs and option combinations.

const cases = [
  {},
  { a: 1 },
  { a: { b: { c: 1 } } },
  { a: { b: 1 }, c: { d: 2 } },
  { a: [1, 2, 3] },
  { a: { b: [1, { c: 2 }] } },
  { 'a.b': 1, a: { c: 2 } },
  { a: { 0: 'x', 1: 'y' } },
  { a: null, b: undefined, c: 0, d: '', e: false },
  { a: { b: {} }, c: { d: [] } },
  { hello: { world: { again: 'good morning' } } },
  { hello: { world: { again: 'good morning' }, lorem: { ipsum: 'whatever' } }, name: 'bla' },
  { a: { b: 'c' }, x: { y: 'z' } },
  { 'foo.bar': { baz: 1 } },
  { a: { 12: 12 } },
  { a: { '0001': 'test' } },
  { deeply: { nested: { object: { with: { many: { levels: 'value' } } } } } }
]

const optionSets = [
  undefined,
  { delimiter: '/' },
  { delimiter: ':' },
  { safe: true },
  { maxDepth: 1 },
  { maxDepth: 2 },
  { object: true },
  { overwrite: true },
  { transformKey: k => k.toUpperCase() }
]

test('flatten matches original across cases × options', () => {
  for (const input of cases) {
    for (const opts of optionSets) {
      const mine = flatten(input, opts)
      const ref = orig.flatten(input, opts)
      assert.deepEqual(mine, ref, `flatten ${JSON.stringify(input)} opts=${JSON.stringify(opts)}`)
    }
  }
})

test('unflatten matches original across cases × options', () => {
  for (const input of cases) {
    for (const opts of optionSets) {
      const flat = orig.flatten(input, opts)
      const mine = unflatten(flat, opts)
      const ref = orig.unflatten(flat, opts)
      assert.deepEqual(mine, ref, `unflatten ${JSON.stringify(flat)} opts=${JSON.stringify(opts)}`)
    }
  }
})

test('flatten → unflatten round-trip matches original', () => {
  for (const input of cases) {
    const mine = unflatten(flatten(input))
    const ref = orig.unflatten(orig.flatten(input))
    assert.deepEqual(mine, ref, `round-trip ${JSON.stringify(input)}`)
  }
})

test('serialized JSON output is byte-identical to original', () => {
  for (const input of cases) {
    assert.equal(
      JSON.stringify(flatten(input)),
      JSON.stringify(orig.flatten(input)),
      `serialized flatten ${JSON.stringify(input)}`
    )
  }
})
