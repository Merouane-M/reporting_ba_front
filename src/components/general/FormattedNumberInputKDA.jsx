import React, { useState, useEffect, useRef } from "react";

//=================================================================================
//            this component is used when the file specifies kilo dinars (DEE, DGR)
//=================================================================================

function formatNumber(value) {
  if (!value || Number(value) === 0) return "";

  const numStr = Math.floor(Number(value)).toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, "  ");
}

function sanitizeValue(value) {
  // Only allow digits (no minus sign)
  return value.replace(/[^\d]/g, "");
}

function FormattedNumberInputKDA({
  value,
  onChange,
  onBlur,
  readOnly = false,
}) {
  const inputRef = useRef(null);

  const normalize = (v) => {
    if (v === 0 || v === "0" || v == null) return "";
    return String(v);
  };

  const [rawValue, setRawValue] = useState(normalize(value));
  const [displayValue, setDisplayValue] = useState(
    formatNumber(normalize(value))
  );

  // Sync external value
  useEffect(() => {
    const newRaw = normalize(value);
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

    // Treat 0 as empty
    if (raw === "0") raw = "";

    setRawValue(raw);
    setDisplayValue(raw);
  };

  const handleBlur = () => {
    if (readOnly) return;

    const numValue = rawValue ? parseInt(rawValue, 10) : null;

    if (onChange) onChange(numValue);
    if (onBlur) onBlur();

    setDisplayValue(formatNumber(rawValue));
  };

  const handleFocus = () => {
    if (readOnly) return;

    // If value is 0 treat as empty
    const raw = rawValue === "0" ? "" : rawValue;

    setRawValue(raw);
    setDisplayValue(raw);
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