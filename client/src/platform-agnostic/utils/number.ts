
/**
 * Comma format
 */

export function commaFormat(numVal: number | string) {
  return numVal ? (typeof numVal === 'string' ? numVal : numVal.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
}

/**
 * Currency format
 * Format number to currency format with decimals,
 * example: 1000 -> $1,000.00
 */

export function currencySymbolFormat(numVal: number, symbol: string = '$') {
  return symbol + commaFormat(numVal.toFixed(2));
}
