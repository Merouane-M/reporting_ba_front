import { useState, useEffect } from "react";

function StepDate({ formData, updateField }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Parse existing ISO date (YYYY-MM-DD)
  useEffect(() => {
    if (formData.date_arrete) {
      const parts = formData.date_arrete.split("-");
      if (parts.length === 3) {
        const [year, month] = parts;
        setSelectedYear(year);
        setSelectedMonth(month);
      }
    }
  }, [formData.date_arrete]);

  const isLeapYear = (year) => {
    year = Number(year);
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const generateDate = (year, month) => {
    let day = "30";

    if (month === "02") {
      day = isLeapYear(year) ? "29" : "28";
    } else if (["10", "12"].includes(month)) {
      day = "31";
    } else if (["04", "06", "08"].includes(month)) {
      day = "30";
    }

    const formattedDate = `${year}-${month}-${day}`;
    updateField("date_arrete", formattedDate);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (selectedMonth) {
      generateDate(year, selectedMonth);
    }
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    if (selectedYear) {
      generateDate(selectedYear, month);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-sofiblue">
          Date d'arrêté
        </label>

        <p className="text-sm text-gray-500">
          Sélectionnez une année et un mois autorisé. Format généré : YYYY-MM-DD
        </p>

        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md p-3 w-32"
          >
            <option value="">Année</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md p-3 w-40"
          >
            <option value="">Mois </option>
            <option value="02">Février (28/29)</option>
            <option value="04">Avril (30)</option>
            <option value="06">Juin (30)</option>
            <option value="08">Août (30)</option>
            <option value="10">Octobre (31)</option>
            <option value="12">Décembre (31)</option>
          </select>
        </div>

        {formData.date_arrete && (
          <div className="mt-3 bg-sofiblue text-white rounded-md px-4 py-2 text-sm font-semibold w-fit">
            Date générée : {formData.date_arrete}
          </div>
        )}
      </div>
    </div>
  );
}

export default StepDate;