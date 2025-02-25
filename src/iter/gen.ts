export function gen<T>(iter: Iterable<T>): () => Generator<T> {
  return function* () {
    yield* iter;
  };
}
