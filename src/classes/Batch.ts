import { LabelDimensions } from "../types/LabelWidth";

class Batch {
  _width: number;
  _height: number;
  _labels: LabelDimensions[];

  constructor(labels: LabelDimensions[]) {
    this._labels = labels;
    this._width = Math.max(...labels.map((x) => x.width));
    this._height = this.calculateHeight(labels);
  }

  get isEmpty() {
    return this._labels.length === 0;
  }

  get labelAmount() {
    return this._labels.length;
  }

  private calculateHeight(labels: LabelDimensions[]) {
    return labels.reduce(
      (acc: number, { height }: LabelDimensions) => acc + height,
      0
    );
  }

  addLabel(label: LabelDimensions) {
    this._labels.push(label);
    this._height = this.calculateHeight(this._labels);
  }

  heightIncludingMargin(margin: number, isShorter: boolean) {
    return (
      this._height -
      margin * (isShorter ? this._labels.length : this._labels.length - 1)
    );
  }

  isShorterThan(batch: Batch) {
    return this._width < batch._width;
  }
}

export default Batch;
