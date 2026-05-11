/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatError(error: any) {
  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
