import React, { useState, useEffect, useRef } from "react";

function formatNumber(value) {
  if (value === 0 || value === "0" || value === null || value === "") return "";
  const numStr = Math.floor(Number(value)).toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, "  ");
}

function sanitizeValue(value) {
  return value.replace(/[^\d]/g, "");
}

function FormattedNumberInputKDA({ value, onChange, onBlur, readOnly = false }) {
  const inputRef = useRef(null);

  const normalize = (v) => {
    if (v === 0 || v === "0" || v == null) return "";
    return String(v);
  };

  const [rawValue, setRawValue] = useState(normalize(value));
  const [displayValue, setDisplayValue] = useState(formatNumber(normalize(value)));

  // Sync external value
  useEffect(() => {
    const newRaw = normalize(value);
    setRawValue(newRaw);
    setDisplayValue(formatNumber(newRaw));
  }, [value]);

  const handleChange = (e) => {
    if (readOnly) return;

    let raw = sanitizeValue(e.target.value);
    if (raw.length > 17) raw = raw.slice(0, 17);

    // Allow the field to look empty
    setRawValue(raw);
    setDisplayValue(raw);
  };

  const handleBlur = () => {
    if (readOnly) return;

    // Send 0 if the field is empty
    const numValue = rawValue ? parseInt(rawValue, 10) : 0;

    if (onChange) onChange(numValue);
    if (onBlur) onBlur();

    // Format display
    setDisplayValue(formatNumber(numValue));
    setRawValue(numValue === 0 ? "" : numValue);
  };

  const handleFocus = () => {
    if (readOnly) return;

    // Show raw digits for editing
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
        readOnly ? "bg-gray-100 cursor-not-allowed text-gray-700" : ""
      }`}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

export default FormattedNumberInputKDA;