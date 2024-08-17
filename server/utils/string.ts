
/**
 * Make string safe for regex search
 */

export function makeRegexSafe(str: string) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
};
