import type { GenFn } from "../types.ts";
import { DoubleEndedIter } from "./double_ended.ts";
import { ExactSizedIter } from "./exact_sized.ts";
import { Iter } from "./iter.ts";

type IterInput<T> = GenFn<T> | Iterable<T>;
type IterOutput<T> = Iter<T> | ExactSizedIter<T> | DoubleEndedIter<T>;

export function iter<T>(input: Array<T>): DoubleEndedIter<T>;
export function iter<K, V>(input: Map<K, V>): ExactSizedIter<[K, V]>;
export function iter<T>(input: Set<T>): ExactSizedIter<T>;
export function iter<T>(input: GenFn<T>): Iter<T>;
export function iter<T>(input: Iterable<T>): Iter<T>;
export function iter<T>(input: IterInput<T>): IterOutput<T> {
  if (typeof input === "function") return new Iter(input);
  if (Array.isArray(input)) {
    return new DoubleEndedIter(
      function* () {
        for (let i = 0; i < input.length; i++) yield input[i];
      },
      function* () {
        for (let i = input.length - 1; i >= 0; i--) yield input[i];
      },
      input.length,
    );
  }

  if (input instanceof Set || input instanceof Map) {
    return new ExactSizedIter(
      function* () {
        for (const item of input) yield item;
      },
      input.size,
    );
  }

  return new Iter(function* () {
    for (const item of input) yield item;
  });
}
