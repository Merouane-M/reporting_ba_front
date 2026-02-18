import React, { useState, useEffect, useRef } from "react";

//=================================================================================
//            this component is used when the file specifies kilo dinars (DEE, DGR)
//=================================================================================
function formatNumber(value) {
  if (!value && value !== 0) return "";

  // Custom formatting: add three spaces between thousands (no decimals)
  const numStr = Math.floor(Number(value)).toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '  '); // Inserts three spaces
}

function sanitizeValue(value) {
  // Remove everything except digits (no dots allowed since no decimals)
  let cleaned = value.replace(/[^\d]/g, "");

  return cleaned;
}

function FormattedNumberInputKDA({ value, onChange, onBlur }) {
  const [displayValue, setDisplayValue] = useState(formatNumber(value || ""));
  const [rawValue, setRawValue] = useState(value || "");
  const inputRef = useRef(null);

  // Sync with external value changes
  useEffect(() => {
    const newRaw = value || "";
    setRawValue(newRaw);
    setDisplayValue(formatNumber(newRaw));
  }, [value]);

  const handleChange = (e) => {
    let raw = sanitizeValue(e.target.value); // Changed to 'let' to allow reassignment

    // Limit to 17 digits total (no decimals)
    if (raw.length > 17) {
      raw = raw.slice(0, 17);
    }

    setRawValue(raw);
    setDisplayValue(formatNumber(raw)); // Show formatted value with extra spaces during typing
  };

  const handleBlur = () => {
    // Send raw value to parent
    onChange(rawValue);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    // On focus, show raw value for easier editing
    setDisplayValue(rawValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      className="border rounded p-2 w-3/4 text-right"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

export default FormattedNumberInputKDA;