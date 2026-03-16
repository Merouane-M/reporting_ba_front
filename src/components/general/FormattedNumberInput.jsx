import React, { useState, useEffect, useRef } from "react";

function formatNumber(value) {
  if (!value || Number(value) === 0) return "";

  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function sanitizeValue(value) {
  // allow only digits and decimal point
  let cleaned = value.replace(/[^\d.]/g, "");

  const parts = cleaned.split(".");

  // allow only one decimal point
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  // limit decimals to 2
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
  const inputRef = useRef(null);

  const normalize = (v) => {
    if (v === null || v === undefined || Number(v) === 0) return "";
    return String(v);
  };

  const [rawValue, setRawValue] = useState(normalize(value));
  const [displayValue, setDisplayValue] = useState(formatNumber(normalize(value)));

  // Sync external changes
  useEffect(() => {
    const newRaw = normalize(value);
    setRawValue(newRaw);
    setDisplayValue(formatNumber(newRaw));
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

    // treat zero as empty
    if (Number(raw) === 0) raw = "";

    setRawValue(raw);
    setDisplayValue(raw);
  };

  const handleBlur = () => {
    if (readOnly) return;

    let numValue = rawValue !== "" ? parseFloat(rawValue) : null;

    // treat zero as empty
    if (numValue === 0) numValue = null;

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