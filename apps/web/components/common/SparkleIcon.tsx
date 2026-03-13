const SparkleIcon = ({ className = "mt-1 size-6 shrink-0", color = "#3b82f6" }) => {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ fill: color, color: color }}
    >
      <path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z" />
    </svg>
  );
};

export default SparkleIcon;