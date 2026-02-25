import React, { useState, useEffect, useRef } from "react";

//=================================================================================
//            this component is used when the file specifies kilo dinars (DEE, DGR)
//=================================================================================

function formatNumber(value) {
  if (!value && value !== 0) return "";

  // Custom formatting: add three spaces between thousands (no decimals)
  const numStr = Math.floor(Number(value)).toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, "  ");
}

function sanitizeValue(value) {
  // Remove everything except digits
  return value.replace(/[^\d]/g, "");
}

function FormattedNumberInputKDA({
  value,
  onChange,
  onBlur,
  readOnly = false,
}) {
  const [displayValue, setDisplayValue] = useState(
    formatNumber(value ?? "")
  );
  const [rawValue, setRawValue] = useState(value ?? "");
  const inputRef = useRef(null);

  // Sync with external value changes
  useEffect(() => {
    const newRaw = value ?? "";
    setRawValue(newRaw);
    setDisplayValue(formatNumber(newRaw));
  }, [value]);

  const handleChange = (e) => {
    if (readOnly) return;

    let raw = sanitizeValue(e.target.value);

    // Limit to 17 digits
    if (raw.length > 17) {
      raw = raw.slice(0, 17);
    }

    setRawValue(raw);
    setDisplayValue(formatNumber(raw));
  };

  const handleBlur = () => {
    if (readOnly) return;

    const numValue = rawValue ? parseInt(rawValue, 10) : null;
    if (onChange) onChange(numValue);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    if (readOnly) return;

    // Show raw value for easier editing
    setDisplayValue(rawValue);
  };

  return (
    <input
      ref={inputRef}
      placeholder="0"
      type="text"
      inputMode="numeric"
      readOnly={readOnly}
      className={`border rounded p-2 w-3/4 text-right ${
        readOnly
          ? "bg-gray-100 cursor-not-allowed text-gray-700"
          : ""
      }`}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

export default FormattedNumberInputKDA;