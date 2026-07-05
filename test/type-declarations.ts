// Compile-only check of the bundled type declarations (tsc --noEmit --strict).
import flat, { flatten, unflatten, FlattenOptions, UnflattenOptions } from '../index.js'

const opts: FlattenOptions = { delimiter: '/', maxDepth: 2, safe: true, transformKey: k => k }
const uopts: UnflattenOptions = { delimiter: '/', object: true, overwrite: true, transformKey: k => k }

// R defaults to Record<string, any> — no longer `unknown` (issue #179).
const flattened = flatten({ a: { b: 1 } }, opts)
const roundTripped = unflatten(flattened, uopts)
void flattened['a.b']
void roundTripped.a

// Explicit result type argument still works.
const typed = unflatten<Record<string, unknown>, { a: { b: number } }>({ 'a.b': 1 })
void typed.a.b

// Callable default with attached named helpers (v5 shape).
const viaDefault: Record<string, any> = flat({ a: { b: 1 } })
void viaDefault
void flat.flatten({ a: 1 })
void flat.unflatten({ 'a.b': 1 })
