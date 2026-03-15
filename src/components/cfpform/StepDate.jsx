import { useState, useEffect } from "react";

function StepDate({ formData, updateField }) {
  const [year, setYear] = useState("");

  useEffect(() => {
    if (formData.date_arrete) {
      setYear(formData.date_arrete.slice(0, 4));
    }
  }, [formData.date_arrete]);

  const handleYearChange = (e) => {
    const value = e.target.value;

    // allow typing freely
    setYear(value);

    // only update final date when 4 digits are entered
    if (value.length === 4) {
      const formattedDate = `${value}-12-31`;
      updateField("date_arrete", formattedDate);
    }
  };

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-sofiblue">
          Date d'arrêté
        </label>

        <p className="text-sm text-gray-500">
          Sélectionnez une année. La date sera automatiquement fixée au
          31 décembre.
        </p>

        <input
          type="number"
          placeholder="YYYY"
          className="border border-gray-300 rounded-md p-3 w-64 
                     focus:outline-none focus:ring-2 
                     focus:ring-sofiblue focus:border-sofiblue
                     transition duration-200"
          value={year}
          onChange={handleYearChange}
        />

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