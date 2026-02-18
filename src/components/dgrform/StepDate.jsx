import { useState, useEffect } from "react";

function StepDate({ formData, updateField }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Parse existing date_arrete on mount or change
  useEffect(() => {
    if (formData.date_arrete) {
      const parts = formData.date_arrete.split(".");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        setSelectedYear(year);
        setSelectedMonth(month);
      }
    }
  }, [formData.date_arrete]);

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

  const generateDate = (year, month) => {
    const lastDay = new Date(year, month, 0).getDate();
    const formattedDate = `${String(lastDay).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
    updateField("date_arrete", formattedDate);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i); // From 5 years ago to 5 years ahead

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-sofiblue">Date d'arrêté</label>

        <p className="text-sm text-gray-500">
          Sélectionnez une année et un trimestre. La date sera automatiquement fixée au dernier jour du trimestre.
        </p>

        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md p-3 w-32 focus:outline-none focus:ring-2 focus:ring-sofiblue focus:border-sofiblue transition duration-200"
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
            className="border border-gray-300 rounded-md p-3 w-40 focus:outline-none focus:ring-2 focus:ring-sofiblue focus:border-sofiblue transition duration-200"
          >
            <option value="">Trimestre</option>
            <option value="03">Mars (31.03)</option>
            <option value="06">Juin (30.06)</option>
            <option value="09">Septembre (30.09)</option>
            <option value="12">Décembre (31.12)</option>
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