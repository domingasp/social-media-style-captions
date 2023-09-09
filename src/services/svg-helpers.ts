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
