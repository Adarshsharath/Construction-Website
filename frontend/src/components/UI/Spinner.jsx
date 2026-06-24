import React from "react";

const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    large: "w-12 h-12 border-4",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`animate-spin rounded-full border-t-brand-orange border-r-transparent border-b-brand-orange border-l-transparent ${selectedSize} ${className}`}
      style={{ borderStyle: "solid", borderLeftColor: "transparent", borderRightColor: "transparent" }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
