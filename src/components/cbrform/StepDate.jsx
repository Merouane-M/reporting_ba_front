import { useState, useEffect } from "react";

function StepDate({ formData, updateField }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Parse existing date_arrete (YYYY-MM-DD)
  useEffect(() => {
    if (formData.date_arrete) {
      const parts = formData.date_arrete.split("-");
      if (parts.length === 3) {
        const [year, month] = parts;
        setSelectedYear(year);

        if (month === "06") setSelectedSemester("S1");
        if (month === "12") setSelectedSemester("S2");
      }
    }
  }, [formData.date_arrete]);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (selectedSemester) {
      generateDate(year, selectedSemester);
    }
  };

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setSelectedSemester(semester);

    if (selectedYear) {
      generateDate(selectedYear, semester);
    }
  };

  const generateDate = (year, semester) => {
    let formattedDate = "";

    if (semester === "S1") {
      formattedDate = `${year}-06-30`;
    }

    if (semester === "S2") {
      formattedDate = `${year}-12-31`;
    }

    updateField("date_arrete", formattedDate);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-3">

        <label className="text-xl font-bold text-sofiblue">
          Date d'arrêté
        </label>

        <p className="text-sm text-gray-500">
          Sélectionnez une année et un semestre.
        </p>

        <div className="flex gap-3">

          {/* Year */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md p-3 w-32 focus:outline-none focus:ring-2 focus:ring-sofiblue"
          >
            <option value="">Année</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Semester */}
          <select
            value={selectedSemester}
            onChange={handleSemesterChange}
            className="border border-gray-300 rounded-md p-3 w-40 focus:outline-none focus:ring-2 focus:ring-sofiblue"
          >
            <option value="">Semestre</option>
            <option value="S1">1er Semestre (30 Juin)</option>
            <option value="S2">2ème Semestre (31 Décembre)</option>
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