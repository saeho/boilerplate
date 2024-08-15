
/**
 * Combine list of class names
 */

export function cn(...classNames: (string | undefined | null)[]) {
  return classNames.filter(Boolean).join(' ');
}
