# Changelog

All notable changes to `@bybrave/flat2` are documented here.
This fork exists because the original [`flat`](https://github.com/hughsk/flat) has
had no npm release since 2023 (issues #137, #156, #110).

## 6.0.0 — 2026-07-05

First `@bybrave/flat2` release. Forked from `flat@6.0.1`. The `flatten` /
`unflatten` algorithm and all option semantics are **byte-for-byte identical**
to the original (verified by golden tests) — this is a drop-in replacement.

### Added
- **Dual ESM + CommonJS.** `require('@bybrave/flat2')` works again and returns
  the callable v5 shape (`flat(obj)` with `.flatten` / `.unflatten` attached),
  while `import { flatten, unflatten }` keeps the v6 named exports. Fixes the
  largest pain cluster in the upstream tracker — #101 (ESM support, 👍18), #173,
  #171, #175 (`ERR_REQUIRE_ESM` after the v6 ESM-only release).
- **Bundled TypeScript types**, guaranteed shipped in the published tarball and
  wired through `exports.types`, so no separate `@types/flat` is needed (#162).
- **Improved generics.** `flatten` / `unflatten` default their result type to
  `Record<string, any>` instead of resolving to `unknown` (#179).
- **This CHANGELOG** (#76, 👍13).
- CI on Node 18 / 20 / 22.

### Unchanged (by design — documented, not "fixed")
- Numeric keys still coerce to array indexes; pass `{ object: true }` to keep
  them as string object keys (#103, #115, #50).
- Prototype-pollution guard on `__proto__` retained and covered by a regression
  test (#105).
- Recursion remains recursive; use `{ maxDepth: n }` to bound depth on
  untrusted input (#189, #24, #161).
