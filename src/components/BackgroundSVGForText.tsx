import Batch from "../classes/Batch";
import { bottomCap, close, move, zCurve } from "../services/svg-helpers";
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
  let startX = 0;
  let startY = 0;
  batches.forEach((b, i) => {
    const isFirst = i === 0;
    const isLast = i === batches.length - 1;

    let isBatchShorterThanNext = false;
    if (isFirst) {
      startX = differenceInWidth(b._width, longestBatchWidth) / 2 + radius;
      rightPaths.push(move(startX, 0));
    }
    if (!isLast && batches.length > 1) {
      isBatchShorterThanNext = b.isShorterThan(batches[i + 1]);
    }

    if (isLast && !isSingle) {
      const sizeDifferenceToPrevious = differenceInWidth(
        b._width,
        batches[i - 1]._width
      );
      rightPaths.push(
        bottomCap(
          startX + sizeDifferenceToPrevious / 2,
          startY,
          b._width,
          b.heightIncludingMargin(0),
          radius
        )
      );
    }
    if (isBatchShorterThanNext) {
      rightPaths.push(
        zCurve(
          startX + b._width - radius,
          0,
          b.heightIncludingMargin(margin),
          radius
        )
      );

      startX += b._width - radius;
      startY += b.heightIncludingMargin(margin);
    }
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
