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

export const zCurve = function zCurve(
  x: number,
  startY: number,
  endY: number,
  radius: number
) {
  return `${line(x - radius, startY)} ${arc(
    x,
    startY + radius,
    radius,
    true
  )} ${line(x, endY - radius)} ${arc(x + radius, endY, radius, false)}`;
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

  return `${line(topRightX - radius, y)} ${arc(
    topRightX,
    y + radius,
    radius,
    true
  )} ${line(topRightX, bottomY - radius)} ${arc(
    topRightX - radius,
    bottomY,
    radius,
    true
  )} ${line(leftSideX + radius, bottomY)} ${arc(
    leftSideX,
    bottomY - radius,
    radius,
    true
  )} ${line(leftSideX, y + radius)} ${arc(
    leftSideX + radius,
    y,
    radius,
    true
  )}`;
};
