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
  startY: number,
  endY: number,
  radius: number
) {
  let path: string = "";

  path += line(x - radius, startY) + " ";
  path += arc(x, startY + radius, radius, true) + " ";
  path += line(x, endY - radius) + " ";
  path += arc(x + radius, endY, radius, false);

  return path;
};

export const jCurve = function jCurve(x: number, y: number, radius: number) {
  let path: string = "";

  path += line(x - radius, y);
  path += arc(x, y - radius, radius, false);
  path += line(x, 0 + radius);
  path += arc(x + radius, 0, radius, true);

  return path;
};

export const hookCurve = function hookCurve(
  x: number,
  startY: number,
  width: number,
  height: number,
  radius: number,
  differenceInSize: number
) {
  let path: string = "";

  path += line(x - radius, startY) + " ";
  path += arc(x, startY + radius, radius, true) + " ";
  path += line(x, startY + height - radius) + " ";
  path += arc(x - radius, startY + height, radius, true);
  path += line(x - differenceInSize + radius, startY + height);

  return path;
};

export const hookLeftCurve = function hookLeftCurve(
  x: number,
  y: number,
  height: number,
  radius: number
) {
  let path: string = "";

  path += line(x + radius, y) + " ";
  path += arc(x, y - radius, radius, true) + " ";
  path += line(x, y - height + radius) + " ";
  path += arc(x + radius, y - height, radius, true);

  return path;
};

export const bottomCap = function bottomCap(
  topRightX: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const leftSideX = topRightX - width;
  const bottomY = y + height;

  let path: string = "";

  path += line(topRightX - radius, y) + " ";
  path += arc(topRightX, y + radius, radius, true) + " ";
  path += line(topRightX, bottomY - radius) + " ";
  path += arc(topRightX - radius, bottomY, radius, true) + " ";
  path += line(leftSideX + radius, bottomY) + " ";
  path += arc(leftSideX, bottomY - radius, radius, true) + " ";
  path += line(leftSideX, y + radius) + " ";
  path += arc(leftSideX + radius, y, radius, true);

  return path;
};

export const bottomCapShorter = function bottomCapShorter(
  topRightX: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const leftSideX = topRightX - width;
  const bottomY = y + height;

  let path: string = "";

  path += arc(topRightX, y + radius, radius, false) + " ";
  path += line(topRightX, bottomY - radius) + " ";
  path += arc(topRightX - radius, bottomY, radius, true) + " ";
  path += line(leftSideX + radius, bottomY) + " ";
  path += arc(leftSideX, bottomY - radius, radius, true) + " ";
  path += line(leftSideX, y + radius) + " ";
  path += arc(leftSideX - radius, y, radius, false);

  return path;
};
