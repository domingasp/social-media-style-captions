import Batch from "../classes/Batch";
import { close, hookCurve, lCurve, move } from "../services/svg-helpers";
import { differenceInWidth } from "../views/caption-creator/helpers";

class AdjacentBatchInformation {
  _batch: Batch;
  _isLonger: boolean;
  _widthDifference: number;

  constructor(currBatch: Batch, adjacentBatch: Batch) {
    this._batch = adjacentBatch;
    this._isLonger = currBatch.isShorterThan(adjacentBatch);
    this._widthDifference = differenceInWidth(
      currBatch._width,
      adjacentBatch._width
    );
  }
}

const generateBackgroundPath = function generateBackgroundPath(
  batches: Batch[],
  radius: number,
  margin: number
) {
  const longestBatchWidth = Math.max(...batches.map((x) => x._width));
  let leftPaths: string[] = [];
  let rightPaths: string[] = [];

  const isSingle = batches.length === 1;
  let position: { x: number; y: number } = { x: 0, y: 0 };
  batches.forEach((b, i) => {
    if (isSingle) {
      return;
    }

    if (i === 0) {
      position.x = differenceInWidth(b._width, longestBatchWidth) / 2 + radius;
      rightPaths.push(move(position.x, position.y));
    }

    const adjacentBatches: {
      before: AdjacentBatchInformation | undefined;
      after: AdjacentBatchInformation | undefined;
    } = {
      before: batches[i - 1]
        ? new AdjacentBatchInformation(b, batches[i - 1])
        : undefined,
      after: batches[i + 1]
        ? new AdjacentBatchInformation(b, batches[i + 1])
        : undefined,
    };

    const height = b.heightIncludingMargin(
      margin,
      adjacentBatches.after?._isLonger ?? adjacentBatches.before!._isLonger
    );

    if (adjacentBatches.after?._isLonger || adjacentBatches.before?._isLonger) {
      const curve = lCurve(
        position.x + b._width - radius,
        position.y,
        height,
        radius
      );
      rightPaths.push(curve.path);

      position = { ...curve.coords };
    } else {
      const curve = hookCurve(
        position.x,
        position.y,
        (adjacentBatches.after?._widthDifference ??
          adjacentBatches.before!._widthDifference) / 2,
        height,
        radius
      );
      rightPaths.push(curve.path);

      position = { ...curve.coords };
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
