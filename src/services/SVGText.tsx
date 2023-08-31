type SVGTextProps = {
  content: string;
  color?: string;
  strokeColor?: string;
  style?: React.CSSProperties | undefined;
  className?: string;
};

const SVGText = function SVGText({
  content,
  color = "white",
  strokeColor = "black",
  style,
  className,
}: SVGTextProps) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text
        className={className}
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
          ...style,
        }}
      >
        {content}
      </text>
    </svg>
  );
};

export default SVGText;
