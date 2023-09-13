export type SVGPathResponse = {
  rightPath: string;
  leftPath: string;
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
  width: number,
  height: number,
  radius: number,
  widthDifference: number,
  widthDifferenceToBefore: number,
  isLast: boolean,
  interior: boolean
): SVGPathResponse {
  let rightPath: string = "";
  let leftPath: string = "";

  let destination: { x: number; y: number } = {
    x: x + (isLast ? width : widthDifference),
    y: y + height,
  };

  if (interior) {
    destination.x = x - (isLast ? width : widthDifference);
    destination.y = y + height;

    rightPath += arc(x - radius, y + radius, radius, false) + " ";
    rightPath += line(x - radius, y + height - radius) + " ";
    rightPath += arc(x - 2 * radius, y + height, radius, true) + " ";
    rightPath += line(destination.x, destination.y);

    leftPath += arc(x - width - radius, y + height - radius, radius, true);
    leftPath += line(x - width - radius, y + radius);
    leftPath += arc(x - width - 2 * radius, y, radius, false);
    leftPath += line(x - width - widthDifferenceToBefore, y);
  } else {
    rightPath += line(x - radius, y) + " ";
    rightPath += arc(x, y + radius, radius, true) + " ";
    rightPath += line(x, y + height - radius) + " ";
    rightPath += arc(x + radius, y + height, radius, false);
    rightPath += line(destination.x, destination.y);

    leftPath += arc(x - width, y + height - radius, radius, false);
    leftPath += line(x - width, y + radius);
    leftPath += arc(x - width + radius, y, radius, true);
    leftPath += line(x - width + widthDifferenceToBefore - radius, y);
  }

  return { rightPath, leftPath, coords: { ...destination } };
};

export const hookCurve = function hookCurve(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  widthDifference: number,
  widthDifferenceToBefore: number,
  isLast: boolean
): SVGPathResponse {
  let rightPath: string = "";
  let leftPath: string = "";

  let destination: { x: number; y: number } = {
    x: x - (isLast ? width : widthDifference) + radius,
    y: y + height,
  };
  rightPath += line(x - radius, y) + " ";
  rightPath += arc(x, y + radius, radius, true) + " ";
  rightPath += line(x, y + height - radius) + " ";
  rightPath += arc(x - radius, y + height, radius, true) + " ";
  rightPath += line(destination.x, destination.y);

  leftPath += arc(x - width, y + height - radius, radius, true);
  leftPath += line(x - width, y + radius);
  leftPath += arc(x - width + radius, y, radius, true);
  leftPath += line(x - width + widthDifferenceToBefore - radius, y);

  return { rightPath, leftPath, coords: { ...destination } };
};

export const cCurve = function cCurve(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  widthDifference: number,
  widthDifferenceToBefore: number
): SVGPathResponse {
  let rightPath: string = "";
  let leftPath: string = "";

  let destination: { x: number; y: number } = {
    x: x + widthDifference - radius,
    y: y + height,
  };

  rightPath += arc(x - radius, y + radius, radius, false) + " ";
  rightPath += line(x - radius, y + height - radius) + " ";
  rightPath += arc(x, y + height, radius, false);
  rightPath += line(destination.x, destination.y);

  leftPath += arc(x - width - radius, y + height - radius, radius, false);
  leftPath += line(x - width - radius, y + radius);
  leftPath += arc(x - width - 2 * radius, y, radius, false);
  leftPath += line(x - width - widthDifferenceToBefore, y);

  return { rightPath, leftPath, coords: { ...destination } };
};
