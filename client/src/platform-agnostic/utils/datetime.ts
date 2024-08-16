
/**
 * Convert date to full date (readable string)
 */

export function getFullDate(_d: Date | string, joinstr: string = '/') {
  let d;
  if (_d instanceof Date) {
    d = _d;
  } else {
    d = new Date(_d);
  }

  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = d.getFullYear();

  if (month.length < 2) {
    month = `0${month}`;
  }
  if (day.length < 2) {
    day = `0${day}`;
  }

  return `${year}${joinstr}${month}${joinstr}${day}`;
}
