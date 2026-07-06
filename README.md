# @bybrave/flat2

**Maintained, drop-in fork of [`flat`](https://github.com/hughsk/flat)** — take a
nested JavaScript object and flatten it, or unflatten an object with delimited keys.

The original `flat` has had no npm release since 2023, ships **no bundled TypeScript
types**, and its v6 went **ESM-only**. `@bybrave/flat2` ships the **exact same
flatten/unflatten algorithm** (verified byte-for-byte against `flat@6.0.1`) —
maintained, fully typed, and packaged as dual ESM + CommonJS.

```
npm install @bybrave/flat2
```

## Why this fork

| Fix | Upstream issues |
|---|---|
| **Alive & maintained** — published again, CI on Node 18/20/22 | #137, #156, #110 |
| **Bundled TypeScript types**, guaranteed in the tarball (no `@types/flat`) | #162 |
| **Improved generics** — result type is `Record<string, any>`, not `unknown` | #179 |
| **A CHANGELOG** | #76 (👍13) |
| **Dual ESM + CommonJS** — `require()` works on every Node, including <20.19 / <22.12 where `flat` v6 throws `ERR_REQUIRE_ESM` | #101 (👍18), #173, #171, #175 |

Zero runtime dependencies — same as the original.

## Usage

### ESM

```js
import { flatten, unflatten } from '@bybrave/flat2'

flatten({ key1: { keyA: 'valueI' }, key2: { keyB: 'valueII' } })
// { 'key1.keyA': 'valueI', 'key2.keyB': 'valueII' }

unflatten({ 'key1.keyA': 'valueI', 'key2.keyB': 'valueII' })
// { key1: { keyA: 'valueI' }, key2: { keyB: 'valueII' } }
```

### CommonJS

```js
const flatten = require('@bybrave/flat2')          // callable, like flat v5
const { unflatten } = require('@bybrave/flat2')     // or destructure

flatten({ a: { b: 1 } })      // { 'a.b': 1 }
flatten.unflatten({ 'a.b': 1 }) // { a: { b: 1 } }
```

### CLI

```bash
npx flat2 foo.json
cat foo.json | npx flat2
```

## API

### `flatten(object, options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `delimiter` | `string` | `'.'` | Key delimiter in the flattened output. |
| `maxDepth` | `number` | — | Stop flattening after this depth. Also a mitigation for deeply nested/untrusted input. |
| `safe` | `boolean` | `false` | Preserve arrays (and their contents) instead of flattening into them. |
| `transformKey` | `(key: string) => string` | identity | Transform each key while (un)flattening. |

### `unflatten(object, options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `delimiter` | `string` | `'.'` | Key delimiter to split on. |
| `object` | `boolean` | `false` | Do not turn numeric keys into arrays — keep them as object keys. |
| `overwrite` | `boolean` | `false` | Overwrite existing non-object values instead of skipping. |
| `transformKey` | `(key: string) => string` | identity | Transform each key while unflattening. |

## Migrating from `flat`

`@bybrave/flat2` is a drop-in replacement. In most projects only the import changes:

```diff
- const flatten = require('flat')
+ const flatten = require('@bybrave/flat2')
```

```diff
- import { flatten, unflatten } from 'flat'
+ import { flatten, unflatten } from '@bybrave/flat2'
```

The output of `flatten` / `unflatten` and every option behaves identically — no
code changes beyond the module specifier. The `flat` CLI is available as `flat2`.

## By design (not bugs)

These behaviors are inherited from the original spec and left unchanged for
compatibility. They are configurable, not broken:

- **Numeric keys become array indexes.** `unflatten({ 'a.0': 'x', 'a.1': 'y' })`
  produces `{ a: ['x', 'y'] }`, and leading zeros in numeric keys are dropped
  (`'0001'` → `1`). Pass `{ object: true }` to keep numeric keys as object keys
  and preserve the exact string. (Issues #103, #115, #50.)
- **A flat key can't record whether its container was an object or an array**
  (`{ '0': 2 }` vs `[2]`); `{ object: true }` forces objects. (#115.)
- **Recursion is recursive.** Extremely deep input can exceed the call stack; use
  `{ maxDepth: n }` to bound it when flattening untrusted data. (#189, #24, #161.)

## Security

The prototype-pollution guard from upstream (`__proto__` keys are ignored during
`unflatten`) is retained and covered by a regression test. When processing
untrusted input, also bound recursion with `maxDepth`.

## Support

If this package saves you time, you can support maintenance:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy%20me%20a%20coffee-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/bybrave)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-BTC-F7931A?logo=bitcoin&logoColor=white)](#support)

Bitcoin (BTC): `bc1q37557q5jpeaxqydzwvf3jgj7zhnfpn2td3q40q`

## License

BSD-3-Clause. Original © 2014 Hugh Kennedy; fork © 2026 bybrave. See [LICENSE](./LICENSE).
