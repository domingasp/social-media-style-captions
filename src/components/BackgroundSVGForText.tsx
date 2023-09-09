import Batch from "../classes/Batch";

const calculateBatchHeight = function calculateBatchHeight(
  batch: Batch,
  margin: number
) {
  if (batch.isEmpty) return 0;
  return batch._height - margin * (batch.labelAmount - 1);
};

type BackgroundSVGForTextProps = {
  batches: Batch[];
};
const BackgroundSVGForText = function BackgroundSVGForText({
  batches,
}: BackgroundSVGForTextProps) {
  const radius = 12;
  const margin = 14.08;

  const generateBackgroundPath = function generateBackgroundPath() {
    let paths: string[] = [];

    if (batches.length === 0) return "";

    return paths.join(" ");
  };

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
      <path d={generateBackgroundPath()} fill="green" />
    </svg>
  );
};

export default BackgroundSVGForText;
