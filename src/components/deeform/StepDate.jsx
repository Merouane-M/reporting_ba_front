function StepDate({ formData, updateField }) {
  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-").map(Number);

    // Get last day of month
    const lastDay = new Date(year, month, 0).getDate();

    // Build YYYY-MM-DD manually 
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      lastDay,
    ).padStart(2, "0")}`;

    updateField("date_arrete", formattedDate);
  };

  const currentMonthValue = formData.date_arrete
    ? formData.date_arrete.slice(0, 7)
    : "";

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-sofiblue">Date d'arrêté</label>

        <p className="text-sm text-gray-500">
          Sélectionnez un mois. La date sera automatiquement fixée au dernier
          jour du mois.
        </p>

        <input
          type="month"
          className="border border-gray-300 rounded-md p-3 w-64 
                     focus:outline-none focus:ring-2 
                     focus:ring-sofiblue focus:border-sofiblue
                     transition duration-200"
          value={currentMonthValue}
          onChange={handleMonthChange}
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
