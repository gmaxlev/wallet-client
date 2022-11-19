export function removePathTypes(path: string) {
  return path.replaceAll(/(\[.*?\])+/gi, "");
}

export function parseParams(path: string) {
  const parsed = [...path.matchAll(/(.):[a-z]+(\[[a-z]+\])?/gi)];

  const types: Record<string, string> = {};

  parsed.forEach((item) => {
    const [full, start, type] = item;

    const paramName = full.slice(
      start.length + 1,
      type ? -type.length : Infinity
    );

    types[paramName] = type ? type.slice(1, type.length - 1) : "unknown";
  });

  return types;
}

export function isPositiveIntParam(value: string | undefined) {
  if (typeof value !== "string") {
    return false;
  }
  const number = parseInt(value);
  return Number.isInteger(number) && number >= 0;
}
