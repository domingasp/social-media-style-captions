import Batch from "../views/caption-creator/types/Batch";

type BackgroundSVGForTextProps = {
  batches: Batch[];
};
const BackgroundSVGForText = function BackgroundSVGForText({
  batches,
}: BackgroundSVGForTextProps) {
  const generateBackgroundPath = function generateBackgroundPath() {
    let path = "M 0 0 L 100 0 L 100 100";

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

    return path;
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <path d={generateBackgroundPath()} fill="white" />
    </svg>
  );
};

export default BackgroundSVGForText;
