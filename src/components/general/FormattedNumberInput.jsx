import React, { useState, useEffect } from "react";


//=================================================================================
//            this component is used when the file specifies dinars (DPC)
//=================================================================================

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

  // Sync with external value changes (e.g., when prop updates)
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
      let raw = integerPart.slice(0, maxIntegerDigits) + (decimalPart ? "." + decimalPart : "");
    }

    setInputValue(raw); // Update local state for smooth typing (no parent update yet)
  };

  const handleBlur = () => {
    // On blur, send the raw value to parent and format for display
    const formatted = inputValue ? formatNumber(inputValue) : "";
    setInputValue(formatted); // Show formatted value
    onChange(inputValue); // Send raw value to parent
    if (onBlur) onBlur(); // Call parent's onBlur if provided
  };

  const handleFocus = () => {
    // On focus, show raw value for editing
    setInputValue(value || "0");
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