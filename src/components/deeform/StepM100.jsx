const fields = [
  "M_1001", "M_1002", "M_1003", "M_1004",
  "M_1005", "M_1006", "M_1007",
  "M_1009", "M_1010", "M_1011",
  "M_1012", "M_1013", "M_1014",
  "M_1015", "M_1016", "M_1019",
  "M_1020", "M_1021", "M_1022",
  "M_1023", "M_1024", "M_1026",
  "M_1027"
];

function StepM100({ formData, updateField }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {fields.map(field => (
        <div key={field}>
          <label className="text-sm">{field}</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={formData[field] || ""}
            onChange={(e) => updateField(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default StepM100;
