/* eslint-disable @typescript-eslint/no-explicit-any */
export function findStringInObject(obj: any, targetString: string) {
  if (typeof obj === "string") {
    return obj.includes(targetString);
  }

  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (findStringInObject(obj[key], targetString)) {
          return true;
        }
      }
    }
  }

  return false;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
