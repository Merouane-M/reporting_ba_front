import React, { useState, useEffect } from "react";

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

function FormattedNumberInput({ value, onChange, onBlur }) {
  const [rawValue, setRawValue] = useState("");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setRawValue(String(value));
    } else {
      setRawValue("");
    }
  }, [value]);

  const handleChange = (e) => {
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
  };

  const handleBlur = () => {
    const numValue =
      rawValue !== "" ? parseFloat(rawValue) : null;

    if (onChange) onChange(numValue);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    // keep raw for editing
  };

  const displayValue =
    document.activeElement?.type === "text"
      ? rawValue
      : formatNumber(rawValue);

  return (
    <input
      type="text"
      inputMode="decimal"
      className="border rounded p-2 w-3/4 text-right"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

export default FormattedNumberInput;