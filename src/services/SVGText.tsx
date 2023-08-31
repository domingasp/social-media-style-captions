type SVGTextProps = {
  content: string;
  color?: string;
  strokeColor?: string;
};

const SVGText = function SVGText({
  content,
  color = "white",
  strokeColor = "black",
}: SVGTextProps) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="55%"
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          fill: color,
          stroke: strokeColor,
          strokeWidth: "5px",
          strokeLinejoin: "round",
          paintOrder: "stroke fill",
          textAnchor: "middle",
          alignmentBaseline: "middle",
        }}
      >
        {content}
      </text>
    </svg>
  );
};

export default SVGText;
