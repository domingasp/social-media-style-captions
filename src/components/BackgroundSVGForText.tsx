import Batch from "../views/caption-creator/types/Batch";

type BackgroundSVGForTextProps = {
  batches: Batch[];
};
const BackgroundSVGForText = function BackgroundSVGForText({
  batches,
}: BackgroundSVGForTextProps) {
  const radius = 12;
  const margin = 14.08;

  const move = function move(destX: number, destY: number) {
    return `M ${destX} ${destY} `;
  };

  const line = function line(destX: number, destY: number) {
    return `L ${destX} ${destY} `;
  };

  const curve = function curve(destX: number, destY: number) {
    return `A ${radius} ${radius} 0 0 1 ${destX} ${destY} `;
  };

  const close = function close() {
    return "Z";
  };

  const generateBackgroundPath = function generateBackgroundPath() {
    let path = "";

    if (batches.length === 1) {
      const b = batches[0];
      if (b.labels.every((x) => x.label === "")) return path;

      const endX = b.width;
      const endY =
        b.labels[0].height * b.labels.length - margin * (b.labels.length - 1);
      path += move(radius, 0);
      path += line(endX - radius, 0);
      path += curve(endX, radius);
      path += line(endX, endY - radius);
      path += curve(endX - radius, endY);
      path += line(radius, endY);
      path += curve(0, endY - radius);
      path += line(0, radius);
      path += curve(radius, 0);
      path += close();
    } else {
      let movingForwards = true;
      let idx = 0;
      while (!path.includes(" Z")) {
        if (movingForwards) {
          if (idx === batches.length) {
            movingForwards = false;
          } else {
            idx += 1;
          }
        } else {
          if (idx === 0) {
            path += " Z";
            break;
          }
          idx -= 1;
        }
      }
    }

    return path;
  };

  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        opacity: "50%",
      }}
    >
      <path d={generateBackgroundPath()} fill="green" />
    </svg>
  );
};

export default BackgroundSVGForText;
