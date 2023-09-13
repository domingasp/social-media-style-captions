import Batch from "../classes/Batch";
import {
  arc,
  cCurve,
  close,
  hookCurve,
  lCurve,
  line,
  move,
} from "../services/svg-helpers";
import ColorInformation from "../types/ColorInformation";
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
  margin: number,
  alignment: string
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
    const widthDifferenceDivider = alignment === "center" ? 2 : 1;

    if (i === 0) {
      if (alignment === "center") {
        position.x =
          differenceInWidth(b._width, longestBatchWidth) / 2 + radius;
        rightPaths.push(
          move(position.x, position.y),
          line(position.x + b._width - 2 * radius, position.y)
        );
        position.x += b._width - radius;
      } else {
        position.x = 0;
        position.y = 0 + radius;
        rightPaths.push(
          move(position.x, position.y),
          arc(position.x + radius, position.y - radius, radius, true),
          line(position.x + b._width - 2 * radius, position.y - radius)
        );
        position.x += b._width;
        position.y -= radius;
      }
    }

    if (
      (adjacentBatches.before?._isLonger &&
        !adjacentBatches.after?._isLonger) ||
      (!adjacentBatches.before?._isLonger && adjacentBatches.after?._isLonger)
    ) {
      const curve = lCurve(
        position.x,
        position.y,
        b._width,
        height,
        radius,
        (adjacentBatches.after?._widthDifference ??
          adjacentBatches.before!._widthDifference) / widthDifferenceDivider,
        (adjacentBatches.before?._widthDifference ?? 0) /
          widthDifferenceDivider,
        i === batches.length - 1,
        adjacentBatches.before?._isLonger ?? false
      );
      rightPaths.push(curve.rightPath);
      leftPaths.push(curve.leftPath);
      position = { ...curve.coords };
    }

    if (
      !adjacentBatches.before?._isLonger &&
      !adjacentBatches.after?._isLonger
    ) {
      const curve = hookCurve(
        position.x,
        position.y,
        b._width,
        height,
        radius,
        (adjacentBatches.after?._widthDifference ??
          adjacentBatches.before!._widthDifference) / widthDifferenceDivider,
        (adjacentBatches.before?._widthDifference ?? 0) /
          widthDifferenceDivider,
        i === batches.length - 1
      );
      rightPaths.push(curve.rightPath);
      leftPaths.push(curve.leftPath);
      position = { ...curve.coords };
    }

    if (adjacentBatches.before?._isLonger && adjacentBatches.after?._isLonger) {
      const curve = cCurve(
        position.x,
        position.y,
        b._width,
        height,
        radius,
        adjacentBatches.after._widthDifference / widthDifferenceDivider,
        (adjacentBatches.before?._widthDifference ?? 0) / widthDifferenceDivider
      );
      rightPaths.push(curve.rightPath);
      leftPaths.push(curve.leftPath);
      position = { ...curve.coords };
    }

    if (alignment !== "center" && i === batches.length - 1) {
      rightPaths.push(
        arc(position.x - radius, position.y - radius, radius, true)
      );
    }
  });

  if (alignment === "center") {
    leftPaths = leftPaths.reverse();
  } else {
    leftPaths = [];
  }
  leftPaths.push(close());
  return rightPaths.concat(leftPaths).join(" ");
};

type BackgroundSVGForTextProps = {
  batches: Batch[];
  alignment: string;
  variant: string;
  colorInfo: ColorInformation;
};
const BackgroundSVGForText = function BackgroundSVGForText({
  batches,
  alignment,
  variant,
  colorInfo,
}: BackgroundSVGForTextProps) {
  const radius = 8;
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
        opacity: variant === "opaque-bg" ? "100%" : "50%",
        transform: alignment === "right" ? "scale(-1,1)" : "",
      }}
    >
      <path
        d={generateBackgroundPath(batches, radius, margin, alignment)}
        fill={colorInfo.color}
      />
    </svg>
  );
};

export default BackgroundSVGForText;
