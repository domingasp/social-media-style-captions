import Batch from "../../classes/Batch";
import IsShorter from "../../types/IsShorter";
import { LabelDimensions } from "../../types/LabelWidth";

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

export const getLabelDimensionsInDiv = function getLabelDimensionsInDiv(
  wrapperDiv: HTMLDivElement,
  textDiv: HTMLDivElement,
  text: string
) {
  if (textDiv) {
    textDiv.innerText = text;
    const labelDimensions = wrapperDiv.getBoundingClientRect();

    return { width: labelDimensions.width, height: labelDimensions.height };
  }
  return { width: 0, height: 0 };
};

export const differenceInWidth = function differenceInWidth(
  a: number,
  b: number
) {
  return Math.abs(a - b);
};

const getLongestTextAfterCurrent = function getLongestTextAfterCurrent(
  array: LabelDimensions[],
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

const splitIntoSubset = function splitIntoSubset(text: string, limit: number) {
  const splitRegex = new RegExp(`.{1,${limit}}`, "g");
  return text.match(splitRegex)! as string[];
};

export const batchLines = function batchLines(
  lines: string[],
  wrapperDiv: HTMLDivElement,
  textDiv: HTMLDivElement,
  lineLengthLimit: number
) {
  const acceptableSizeSimilarity = 40;

  const labelDimensions: LabelDimensions[] = [];
  lines.forEach((line) => {
    let toAppend = [];
    if (line.length > lineLengthLimit) {
      toAppend.push(...splitIntoSubset(line, lineLengthLimit));
    } else {
      toAppend.push(line);
    }

    labelDimensions.push(
      ...toAppend.map((x) => ({
        label: x,
        ...getLabelDimensionsInDiv(wrapperDiv, textDiv, x),
      }))
    );
  });

  const batched: Batch[] = [];
  let batch = 0;
  for (let i = 0; i < labelDimensions.length; i += 1) {
    const curr = labelDimensions[i];

    if (curr.label.length === 0) {
      batch += 2;
      batched.push(new Batch([]));
    } else if (i === 0 || !batched[batch]) {
      batched.push(new Batch([curr]));
    } else {
      const longestInFuture = getLongestTextAfterCurrent(
        labelDimensions,
        i + 1,
        curr.width,
        acceptableSizeSimilarity
      );

      if (
        differenceInWidth(longestInFuture, batched[batch]._width) <
          acceptableSizeSimilarity ||
        differenceInWidth(curr.width, batched[batch]._width) <
          acceptableSizeSimilarity
      ) {
        batched[batch].addLabel(curr);
        if (batched[batch]._width < curr.width) {
          batched[batch]._width = curr.width;
        } else if (batched[batch]._width === 0) {
          batched[batch]._width = curr.width;
        }
      } else {
        batch += 1;
        batched.push(new Batch([curr]));
      }
    }
  }

  return batched;
};

export const longestStringInArray = function longestStringInArray(
  arr: LabelDimensions[]
) {
  return arr.reduce((a, b) => (a.label.length > b.label.length ? a : b));
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
