const fields = [
  "C331_DEPOTS",
  "C331_SIGNATURE",
  "C332_DEPOTS",
  "C332_SIGNATURE",
  "C333_DEPOTS",
  "C333_SIGNATURE",
  "C334_DEPOTS",
  "C334_SIGNATURE",
  "C335_DEPOTS",
  "C335_SIGNATURE",
];

function StepC33({ formData, updateField }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-sofiblue">
        Section C33
      </h3>

      <div className="grid grid-cols-2 gap-4">
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

export default StepC33;
