import { LabelDimensions } from "../types/LabelWidth";

class Batch {
  _width: number;
  _height: number;
  _labels: LabelDimensions[];

  constructor(labels: LabelDimensions[]) {
    this._labels = labels;
    this._width = Math.max(...labels.map((x) => x.width));
    this._height = labels.reduce(
      (acc: number, obj: LabelDimensions) => (acc += obj.height),
      0
    );
  }

  get isEmpty() {
    return this._labels.length === 0;
  }

  get labelAmount() {
    return this._labels.length;
  }

  addLabel(label: LabelDimensions) {
    this._labels.push(label);
  }
}

export default Batch;
