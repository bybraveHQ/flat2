export interface FlattenOptions {
  delimiter?: string;
  maxDepth?: number;
  safe?: boolean;
  transformKey?: (key: string) => string;
}

export interface UnflattenOptions {
  delimiter?: string;
  object?: boolean;
  overwrite?: boolean;
  transformKey?: (key: string) => string;
}

// R defaults to Record<string, any> so `unflatten(x)` / `flatten(x)` resolve
// to a usable object type instead of `unknown` (issue #179). Key-level
// flat↔nested typing is not statically representable; callers wanting a
// precise shape still pass it explicitly as the R type argument.
export function flatten<T = any, R = Record<string, any>>(
  target: T,
  options?: FlattenOptions
): R;

export function unflatten<T = any, R = Record<string, any>>(
  target: T,
  options?: UnflattenOptions
): R;

// Callable default mirrors the CommonJS v5 shape (`flat` === `flatten`, with
// `.flatten` / `.unflatten` attached).
interface Flat {
  <T = any, R = Record<string, any>>(target: T, options?: FlattenOptions): R;
  flatten: typeof flatten;
  unflatten: typeof unflatten;
}

declare const flat: Flat;
export default flat;
