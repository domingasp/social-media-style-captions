const BackgroundSVGForText = function BackgroundSVGForText() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" fill="white" />
    </svg>
  );
};

export default BackgroundSVGForText;
