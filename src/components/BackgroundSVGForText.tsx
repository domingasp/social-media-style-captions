import Batch from "../classes/Batch";
import { close, move } from "../services/svg-helpers";
import { differenceInWidth } from "../views/caption-creator/helpers";

const generateBackgroundPath = function generateBackgroundPath(
  batches: Batch[],
  radius: number,
  margin: number
) {
  const longestBatchWidth = Math.max(...batches.map((x) => x._width));
  let leftPaths: string[] = [];
  let rightPaths: string[] = [];

  const isSingle = batches.length === 1;
  let position = { x: 0, y: 0 };
  batches.forEach((b, i) => {
    if (isSingle) {
      return;
    }

    if (i === 0) {
      position.x = differenceInWidth(b._width, longestBatchWidth) / 2 + radius;
      rightPaths.push(move(position.x, 0));
    }

    const adjacentBatch =
      i < batches.length - 1 ? batches[i + 1] : batches[i - 1];
    let shorterThanAdjacent = b.isShorterThan(adjacentBatch); // for last batch 'adjacentBatch' means the previous batch
    let widthDifferenceToAdjacent = differenceInWidth(
      b._width,
      adjacentBatch._width
    );
  });

  leftPaths.push(close());
  return rightPaths.concat(leftPaths).join(" ");
};

type BackgroundSVGForTextProps = {
  batches: Batch[];
};
const BackgroundSVGForText = function BackgroundSVGForText({
  batches,
}: BackgroundSVGForTextProps) {
  const radius = 12;
  const margin = 16;

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
      <path d={generateBackgroundPath(batches, radius, margin)} fill="green" />
    </svg>
  );
};

export default BackgroundSVGForText;
