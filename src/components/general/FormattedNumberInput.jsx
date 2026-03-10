import React, { useState, useEffect, useRef } from "react";

function formatNumber(value) {
  if (value === "" || value === null || value === undefined) return "";

  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function sanitizeValue(value) {
  let cleaned = value.replace(/[^\d.]/g, "");

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  if (parts[1]?.length > 2) {
    cleaned = parts[0] + "." + parts[1].slice(0, 2);
  }

  return cleaned;
}

function FormattedNumberInput({
  value,
  onChange,
  onBlur,
  readOnly = false,
}) {
  const [displayValue, setDisplayValue] = useState(formatNumber(value ?? ""));
  const [rawValue, setRawValue] = useState(value ?? "");
  const inputRef = useRef(null);

  // Sync external changes
useEffect(() => {
  if (value === null || value === undefined || value === 0) {
    setRawValue("");
    setDisplayValue("");
  } else {
    const newRaw = String(value);
    setRawValue(newRaw);
    setDisplayValue(formatNumber(newRaw));
  }
}, [value]);

  const handleChange = (e) => {
    if (readOnly) return;

    let raw = sanitizeValue(e.target.value);

    const [integerPart = "", decimalPart = ""] = raw.split(".");
    const totalDigits = integerPart.length + decimalPart.length;

    if (totalDigits > 17) {
      const allowedInteger = 17 - decimalPart.length;
      raw =
        integerPart.slice(0, allowedInteger) +
        (decimalPart ? "." + decimalPart : "");
    }

    setRawValue(raw);
    setDisplayValue(raw);
  };

  const handleBlur = () => {
    if (readOnly) return;

    const numValue = rawValue !== "" ? parseFloat(rawValue) : null;

    if (onChange) onChange(numValue);
    if (onBlur) onBlur();

    setDisplayValue(formatNumber(rawValue));
  };

const handleFocus = () => {
  if (readOnly) return;

  setDisplayValue(rawValue || "");
};

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      placeholder="0.00"
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

export default FormattedNumberInput;