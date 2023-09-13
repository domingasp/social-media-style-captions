export type SVGPathResponse = {
  path: string;
  coords: { x: number; y: number };
};

export const move = function move(x: number, y: number) {
  return `M ${x} ${y}`;
};

export const line = function line(x: number, y: number) {
  return `L ${x} ${y}`;
};

export const curve = function curve(x: number, y: number, radius: number) {
  return `A ${radius} ${radius} 0 0 1 ${x} ${y}`;
};

export const close = function close() {
  return "Z";
};

const arc = function arc(
  x: number,
  y: number,
  radius: number,
  isOuter: boolean
) {
  return `A ${radius} ${radius} 0 0 ${isOuter ? 1 : 0} ${x} ${y}`;
};

export const lCurve = function lCurve(
  x: number,
  y: number,
  height: number,
  radius: number
): SVGPathResponse {
  let path: string = "";

  let destination: { x: number; y: number } = { x: x + radius, y: y + height };
  path += line(x - radius, y) + " ";
  path += arc(x, y + radius, radius, true) + " ";
  path += line(x, y + height - radius) + " ";
  path += arc(destination.x, destination.y, radius, false);

  return { path, coords: { ...destination } };
};

export const hookCurve = function hookCurve(
  x: number,
  y: number,
  widthDifferenceToAdjacent: number,
  height: number,
  radius: number
): SVGPathResponse {
  let path: string = "";

  let destination: { x: number; y: number } = {
    x: x + widthDifferenceToAdjacent - 2 * radius,
    y: y + height,
  };
  path += line(x + widthDifferenceToAdjacent - 2 * radius, y) + " ";
  path +=
    arc(x + widthDifferenceToAdjacent - radius, y + radius, radius, true) + " ";
  path +=
    line(x + widthDifferenceToAdjacent - radius, y + height - radius) + " ";
  path += arc(
    x + widthDifferenceToAdjacent - 2 * radius,
    y + height,
    radius,
    true
  );

  return { path, coords: { ...destination } };
};

export const reverseHookCurve = function reverseHookCurve(
  x: number,
  y: number,
  widthDifferenceToAdjacent: number,
  height: number,
  radius: number
): SVGPathResponse {
  let path: string = "";

  let destination: { x: number; y: number } = {
    x: x + widthDifferenceToAdjacent - 2 * radius,
    y: y + height,
  };
  path += line(x + widthDifferenceToAdjacent - 2 * radius, y) + " ";
  path +=
    arc(x + widthDifferenceToAdjacent - radius, y + radius, radius, true) + " ";
  path +=
    line(x + widthDifferenceToAdjacent - radius, y + height - radius) + " ";
  path += arc(
    x + widthDifferenceToAdjacent - 2 * radius,
    y + height,
    radius,
    true
  );

  return { path, coords: { ...destination } };
};
