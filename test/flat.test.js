import { test } from 'node:test'
import assert from 'node:assert/strict'
import flat, { flatten, unflatten } from '../index.js'

test('flatten nested object', () => {
  assert.deepEqual(
    flatten({ hello: { world: { again: 'good morning' } } }),
    { 'hello.world.again': 'good morning' }
  )
})

test('unflatten delimited keys', () => {
  assert.deepEqual(
    unflatten({ 'hello.world.again': 'good morning' }),
    { hello: { world: { again: 'good morning' } } }
  )
})

test('round-trip is identity for plain objects', () => {
  const input = { a: { b: { c: 1 } }, d: [1, 2, { e: 3 }] }
  assert.deepEqual(unflatten(flatten(input)), input)
})

test('custom delimiter', () => {
  assert.deepEqual(
    flatten({ a: { b: 1 } }, { delimiter: '/' }),
    { 'a/b': 1 }
  )
  assert.deepEqual(
    unflatten({ 'a/b': 1 }, { delimiter: '/' }),
    { a: { b: 1 } }
  )
})

test('maxDepth stops flattening', () => {
  assert.deepEqual(
    flatten({ a: { b: { c: 1 } } }, { maxDepth: 2 }),
    { 'a.b': { c: 1 } }
  )
})

test('safe keeps arrays intact', () => {
  assert.deepEqual(
    flatten({ a: [{ b: 1 }] }, { safe: true }),
    { a: [{ b: 1 }] }
  )
})

test('transformKey rewrites keys', () => {
  assert.deepEqual(
    flatten({ a: { b: 1 } }, { transformKey: k => k.toUpperCase() }),
    { 'A.B': 1 }
  )
})

// --- default export mirrors the v5 CommonJS shape (issues #101/#173) ---

test('default export is callable as flatten', () => {
  assert.equal(typeof flat, 'function')
  assert.deepEqual(flat({ a: { b: 1 } }), { 'a.b': 1 })
})

test('default export exposes .flatten and .unflatten', () => {
  assert.equal(flat.flatten, flatten)
  assert.equal(flat.unflatten, unflatten)
})

// --- by-design behaviors, documented in README (issues #103/#115/#50) ---

test('numeric keys coerce to array indexes by default (#103)', () => {
  assert.deepEqual(
    unflatten({ 'a.0': 'x', 'a.1': 'y' }),
    { a: ['x', 'y'] }
  )
})

test('object:true disables numeric-key coercion (#103/#115)', () => {
  assert.deepEqual(
    unflatten({ 'a.0': 'x', 'a.1': 'y' }, { object: true }),
    { a: { 0: 'x', 1: 'y' } }
  )
})

test('leading zeros preserved with object:true (#50)', () => {
  assert.deepEqual(
    unflatten({ 'a.0001': 'test' }, { object: true }),
    { a: { '0001': 'test' } }
  )
})

// --- prototype-pollution guard must survive the fork (issue #105) ---

test('unflatten does not pollute Object.prototype via __proto__', () => {
  const before = ({}).polluted
  unflatten({ '__proto__.polluted': 'yes' })
  assert.equal(({}).polluted, before)
  assert.equal(Object.prototype.polluted, undefined)
})

test('unflatten does not pollute via nested __proto__', () => {
  unflatten({ 'a.__proto__.polluted': 'yes' })
  assert.equal(({}).polluted, undefined)
})

// --- maxDepth as a recursion-depth mitigation (issues #189/#24/#161) ---

test('maxDepth caps recursion on deeply nested input', () => {
  let deep = 'leaf'
  for (let i = 0; i < 5000; i++) deep = { nest: deep }
  const out = flatten(deep, { maxDepth: 3 })
  const keys = Object.keys(out)
  assert.equal(keys.length, 1)
  assert.equal(keys[0], 'nest.nest.nest')
})

// --- non-object passthrough ---

test('unflatten passes non-objects through unchanged', () => {
  assert.equal(unflatten(42), 42)
  assert.equal(unflatten('str'), 'str')
  assert.equal(unflatten(null), null)
})

test('buffers are treated as leaf values', () => {
  const buf = Buffer.from('abc')
  assert.deepEqual(flatten({ a: buf }), { a: buf })
})
