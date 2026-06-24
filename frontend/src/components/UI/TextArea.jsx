import React from "react";

const TextArea = ({
  label,
  id,
  placeholder = "",
  value,
  onChange,
  rows = 4,
  required = false,
  error = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-brand-dark/75">
          {label} {required && <span className="text-brand-orange">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white text-brand-dark transition-colors duration-200 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-brand-dark/10"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default TextArea;
