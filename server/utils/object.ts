
/**
 * Filter array and return only unique values
 */

export function uniq(arr: Array<any>, fn?: Function) {
  return arr.filter((value, index, self) => {
    return self.indexOf(value) === index && (!fn || fn(value, index, self));
  });
}

/**
 * Pick a random item from an array
 */

export function randomItem(arr: Array<any>) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Order an array of objects by a key
 */

export function orderBy(
  arr: Array<object>,
  key: ((obj: object) => any) | string,
  order: 'asc' | 'desc' = 'asc',
) {
  const compareFn = (a: object, b: object) => {
    const valueA = typeof key === 'function' ? key(a) : a[key];
    const valueB = typeof key === 'function' ? key(b) : b[key];

    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  return arr.sort(compareFn);
}
