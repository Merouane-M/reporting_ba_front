function StepDate({ formData, updateField }) {

  const handleDateChange = (e) => {
    const value = e.target.value;
    const date = new Date(value);

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    if (date.getDate() !== lastDay.getDate()) {
      alert("La date doit être la fin du mois.");
      return;
    }

    updateField("date_arrete", value);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">
        Date d'arrêté (fin du mois uniquement)
      </label>

      <input
        type="date"
        className="border rounded p-2 w-1/3"
        value={formData.date_arrete || ""}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default StepDate;
