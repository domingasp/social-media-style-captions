import { Box } from "@mantine/core";
import { LabelWidth } from "./types/LabelWidth";
import IsShorter from "./types/IsShorter";

const getTextWidthOnCanvas = function getTextOnWidth(text: string) {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context!.font = "600 Nunito Sans sans-serif";
  const metrics = context!.measureText(text);
  return metrics.width;
};

export const isShorter = function isShorter(
  text: string,
  textToCompare: string
) {
  return getTextWidthOnCanvas(text) < getTextWidthOnCanvas(textToCompare);
};

export const getTextWidthInDiv = function getTextWidthInDiv(
  wrapperDiv: HTMLDivElement,
  textDiv: HTMLDivElement,
  text: string
) {
  if (textDiv) {
    textDiv.innerText = text;
    const textSize = wrapperDiv.getBoundingClientRect().width;

    return textSize ?? 0;
  }
  return 0;
};

export const differenceInWidth = function differenceInWidth(
  a: number,
  b: number
) {
  return Math.abs(a - b);
};

export const createOuterCurveDiv = function createOuterCurveDiv(
  radiusPos: string = "full-left",
  position: "left" | "right" = "left",
  radius: string,
  color: string
) {
  let topLeft, topRight, bottomLeft, bottomRight;
  topLeft = topRight = bottomLeft = bottomRight = "0px";

  let clipPath = "";

  if (radiusPos === "full-left") {
    topLeft = bottomLeft = radius;
    clipPath = "polygon(-1% 0%, 50% 0%, 50% 100%, -1% 100%)";
  }
  if (radiusPos === "full-right") {
    topRight = bottomRight = radius;
    clipPath = "polygon(50% 0%, 101% 0%, 101% 100%, 50% 100%)";
  }
  if (radiusPos === "top-left") {
    topLeft = radius;
    clipPath = "polygon(-1% 0%, 50% 0%, 50% 25%, -1% 25%)";
  }
  if (radiusPos === "top-right") {
    topRight = radius;
    clipPath = "polygon(50% 0%, 101% 0%, 101% 25%, 50% 25%)";
  }
  if (radiusPos === "bottom-left") {
    bottomLeft = radius;
    clipPath = "polygon(-1% 75%, 50% 75%, 50% 100%, -1% 100%)";
  }
  if (radiusPos === "bottom-right") {
    bottomRight = radius;
    clipPath = "polygon(50% 100%, 101% 100%, 101% 75%, 50% 75%)";
  }

  return (
    <Box
      sx={{
        outline: `solid 10px ${color}`,
        backgroundColor: "transparent",
        position: "absolute",
        width: "20px",
        top: "25%",
        height: "50%",
        clipPath: clipPath,
        left: position === "left" ? "-20px" : "unset",
        right: position === "right" ? "-20px" : "unset",
        borderRadius: `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`,
      }}
    />
  );
};

export const getFullOuterRadius = function getFullOuterRadius(
  position: "top" | "bottom" | "full",
  radius: string,
  color: string = "red"
) {
  return (
    <>
      {createOuterCurveDiv(`${position}-right`, "left", radius, color)}
      {createOuterCurveDiv(`${position}-left`, "right", radius, color)}
    </>
  );
};

const getLongestTextAfterCurrent = function getLongestTextAfterCurrent(
  array: LabelWidth[],
  startIdx: number,
  widthToCompareTo: number,
  acceptableSizeSimilarity: number
) {
  let longestInFuture = 0;
  for (let i = startIdx; i < array.length; i += 1) {
    if (
      differenceInWidth(widthToCompareTo, array[i].width) >
      acceptableSizeSimilarity
    ) {
      break;
    }

    if (longestInFuture < array[i].width) {
      longestInFuture = array[i].width;
    }
  }

  return longestInFuture;
};

export const batchLines = function batchLines(
  lines: string[],
  wrapperDiv: HTMLDivElement,
  textDiv: HTMLDivElement
) {
  const acceptableSizeSimilarity = 36;

  const textWithWidths: { label: string; width: number }[] = lines.map(
    (line) => ({
      label: line,
      width: getTextWidthInDiv(wrapperDiv, textDiv, line),
    })
  );

  const batched: { label: string; width: number }[][] = [[]];
  let batch = 0;
  for (let i = 0; i < textWithWidths.length; i += 1) {
    const curr = textWithWidths[i];

    if (curr.label.length === 0) {
      batch += 2;
      batched.push([{ label: "", width: 0 }], []);
    } else if (i === 0 || batched[batch].length === 0) {
      batched[batch].push(curr);
    } else {
      const longestInCurrBatch = Math.max(
        ...batched[batch].map((x) => x.width)
      );

      const longestInFuture = getLongestTextAfterCurrent(
        textWithWidths,
        i + 1,
        curr.width,
        acceptableSizeSimilarity
      );

      if (
        differenceInWidth(longestInFuture, longestInCurrBatch) <
          acceptableSizeSimilarity ||
        differenceInWidth(curr.width, longestInCurrBatch) <
          acceptableSizeSimilarity
      ) {
        batched[batch].push(curr);
      } else {
        batch += 1;
        batched.push([]);
        batched[batch].push(curr);
      }
    }
  }

  return batched.map((x) => x.map((y) => y.label));
};

export const longestStringInArray = function longestStringInArray(
  arr: string[]
) {
  return arr.reduce((a, b) => (a.length > b.length ? a : b));
};

export const isTextShorterThanSurroundingText =
  function isTextShorterThanSurroundingText(
    longestInCurrBatch: string,
    longestInPrevBatch: string | undefined,
    longestInNextBatch: string | undefined
  ): IsShorter {
    let thanAbove = false;
    let thanBelow = false;

    if (longestInPrevBatch || longestInNextBatch) {
      if (!longestInPrevBatch && longestInNextBatch) {
        thanBelow = isShorter(longestInCurrBatch, longestInNextBatch);
      }
      if (!longestInNextBatch && longestInPrevBatch) {
        thanAbove = isShorter(longestInCurrBatch, longestInPrevBatch);
      }
      if (longestInPrevBatch && longestInNextBatch) {
        thanBelow = isShorter(longestInCurrBatch, longestInNextBatch);
        thanAbove = isShorter(longestInCurrBatch, longestInPrevBatch);
      }
    }

    return { thanAbove, thanBelow };
  };

export const getTextDivRadii = function getTextDivRadii(
  isShorter: IsShorter,
  radius: string
) {
  let topLeft, topRight, bottomLeft, bottomRight;
  topLeft = topRight = bottomLeft = bottomRight = "0px";

  if (isShorter.thanAbove) {
    bottomLeft = bottomRight = radius;
  }
  if (isShorter.thanBelow) {
    topLeft = topRight = radius;
  }
  if (!isShorter.thanAbove && !isShorter.thanBelow) {
    topLeft = topRight = bottomLeft = bottomRight = radius;
  }

  return { topLeft, topRight, bottomLeft, bottomRight };
};

export const getTextDivOuterCurves = function getTextDivOuterCurves(
  isFirstBatch: boolean,
  isLastBatch: boolean,
  isFirst: boolean,
  isLast: boolean,
  isShorter: IsShorter,
  radius: string
) {
  let outerCurves = <></>;

  if (
    (isFirstBatch && isLast) ||
    (isLastBatch && isFirst) ||
    (!isFirstBatch &&
      !isLastBatch &&
      ((isFirst && isShorter.thanAbove) || (isLast && isShorter.thanBelow)))
  ) {
    if (isShorter.thanAbove && isShorter.thanBelow) {
      outerCurves = getFullOuterRadius("full", radius);
    } else if (isShorter.thanAbove) {
      outerCurves = getFullOuterRadius("top", radius);
    } else if (isShorter.thanBelow) {
      outerCurves = getFullOuterRadius("bottom", radius);
    }
  }

  return outerCurves;
};
