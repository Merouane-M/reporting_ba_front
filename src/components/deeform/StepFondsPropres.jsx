const fields = [
  "ACCROISSEMENT_FONDS_PROPRES_DATE_ARRETE",
  "FONDS_PROPRES_DATE_ARRETE_PRECEDENTE",
  "DIMINUTION_FONDS_PROPRES_DATE_ARRETE",
];

function StepFondsPropres({ formData, updateField }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-sofiblue">
        Fonds Propres
      </h3>

      <div className="grid grid-cols-1 gap-4 w-1/2">
        {fields.map((field) => (
          <div key={field}>
            <label className="text-sm font-medium">{field}</label>
            <input
              type="number"
              step="0.01"
              className="border rounded p-2 w-full"
              value={formData[field] || ""}
              onChange={(e) => updateField(field, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepFondsPropres;
