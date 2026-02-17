import React, { useState, useEffect } from "react";

function formatNumber(value) {
  if (!value && value !== 0) return "";

  // Format with French locale: spaces for thousands, exactly 2 decimal places
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function sanitizeValue(value) {
  // Remove everything except digits and dot
  let cleaned = value.replace(/[^\d.]/g, "");

  // Prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join(""); // Keep only the first dot
  }

  // If there's a decimal part, limit to 2 digits after the dot
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + "." + parts[1].slice(0, 2);
  }

  return cleaned;
}

function FormattedNumberInput({ value, onChange, onBlur }) {
  const [inputValue, setInputValue] = useState(value || "");

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChange = (e) => {
    const raw = sanitizeValue(e.target.value);

    // Limit to 17 digits total (excluding dot and decimals)
    const [integerPart, decimalPart] = raw.split(".");
    const totalDigits = integerPart.length + (decimalPart ? decimalPart.length : 0);
    if (totalDigits > 17) {
      // Trim from the end to fit within 17 digits
      const maxIntegerDigits = decimalPart ? 17 - decimalPart.length : 17;
      raw = integerPart.slice(0, maxIntegerDigits) + (decimalPart ? "." + decimalPart : "");
    }

    setInputValue(raw); // Update local state for smooth typing
    onChange(raw); // Send raw value to parent
  };

  const handleBlur = () => {
    // On blur, ensure the value is properly formatted and synced
    const formatted = inputValue ? formatNumber(inputValue) : "";
    setInputValue(formatted); // Show formatted value
    if (onBlur) onBlur(); // Call parent's onBlur to trigger re-render
  };

  const handleFocus = () => {
    // On focus, show raw value for editing
    setInputValue(value || "");
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      className="border rounded p-2 w-3/4 text-right"
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

export default FormattedNumberInput;