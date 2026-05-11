/* eslint-disable @typescript-eslint/no-explicit-any */
export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(Number(d));
}
/* eslint-enable @typescript-eslint/no-explicit-any */
