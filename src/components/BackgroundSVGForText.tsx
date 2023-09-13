import Batch from "../classes/Batch";
import {
  cCurve,
  close,
  hookCurve,
  lCurve,
  line,
  move,
} from "../services/svg-helpers";
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
  console.log("start");
  batches.forEach((b, i) => {
    if (isSingle) {
      return;
    }

    if (i === 0) {
      position.x = differenceInWidth(b._width, longestBatchWidth) / 2 + radius;
      rightPaths.push(
        move(position.x, position.y),
        line(position.x + b._width - 2 * radius, position.y)
      );
      position.x += b._width - radius;
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
      adjacentBatches.before?._isLonger,
      adjacentBatches.after?._isLonger
    );

    if (
      (adjacentBatches.before?._isLonger &&
        !adjacentBatches.after?._isLonger) ||
      (!adjacentBatches.before?._isLonger && adjacentBatches.after?._isLonger)
    ) {
      const curve = lCurve(
        position.x,
        position.y,
        height,
        radius,
        (adjacentBatches.after?._widthDifference ??
          adjacentBatches.before!._widthDifference) / 2,
        adjacentBatches.before?._isLonger ?? false,
        i === batches.length - 1 ? b._width : undefined
      );
      rightPaths.push(curve.path);
      position = { ...curve.coords };

      console.log(
        "lcurve",
        b._labels.map((x) => x.label)
      );
    }

    if (
      !adjacentBatches.before?._isLonger &&
      !adjacentBatches.after?._isLonger
    ) {
      const curve = hookCurve(
        position.x,
        position.y,
        height,
        radius,
        (adjacentBatches.after?._widthDifference ??
          adjacentBatches.before!._widthDifference) / 2,
        i === batches.length - 1 ? b._width : undefined
      );
      rightPaths.push(curve.path);
      position = { ...curve.coords };

      console.log(
        "hookcurve",
        b._labels.map((x) => x.label)
      );
    }

    if (adjacentBatches.before?._isLonger && adjacentBatches.after?._isLonger) {
      const curve = cCurve(
        position.x,
        position.y,
        height,
        radius,
        adjacentBatches.after._widthDifference / 2
      );
      rightPaths.push(curve.path);
      position = { ...curve.coords };

      console.log(
        "ccurve",
        b._labels.map((x) => x.label)
      );
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
