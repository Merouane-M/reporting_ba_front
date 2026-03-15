function StepDate({ formData, updateField }) {
  const handleYearChange = (e) => {
    const year = Number(e.target.value);

    if (!year) return;

    // Last day of the year
    const formattedDate = `${year}-12-31`;

    updateField("date_arrete", formattedDate);
  };

  const currentYearValue = formData.date_arrete
    ? formData.date_arrete.slice(0, 4)
    : "";

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-sofiblue">
          Date d'arrêté
        </label>

        <p className="text-sm text-gray-500">
          Sélectionnez une année. La date sera automatiquement fixée au dernier
          jour de l'année (31 décembre).
        </p>

        <input
          type="number"
          min="1900"
          max="2100"
          placeholder="YYYY"
          className="border border-gray-300 rounded-md p-3 w-64 
                     focus:outline-none focus:ring-2 
                     focus:ring-sofiblue focus:border-sofiblue
                     transition duration-200"
          value={currentYearValue}
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