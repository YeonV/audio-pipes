export function* generate<T>(length: number, generator: (index: number) => T): Generator<T> {
  for (let i = 0; i < length; i++) {
    yield generator(i);
  }
}

export function generateArray<T>(length: number, generator: (index: number) => T): Array<T> {
  return Array.from(generate(length, generator));
}

export function first<T>(collection: ArrayLike<T>): T | undefined {
  return collection.length ? collection[0] : undefined;
}

export function last<T>(collection: ArrayLike<T>): T | undefined {
  return collection.length ? collection[collection.length - 1] : undefined;
}

export function* generateZip<A, B>(a: A[], b: B[]): Generator<[A, B]> {
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index++) {
    yield [a[index], b[index]];
  }
}

export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return Array.from(generateZip(a, b));
}
