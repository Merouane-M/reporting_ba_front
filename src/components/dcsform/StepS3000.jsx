import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function StepS3000({ formData, updateField }) {
  const getValue = (key) => Number(formData[key] || 0);

  const v3001 = getValue("X3001");
  const v3002 = getValue("X3002");
  const v3003 = getValue("X3003");

const v3004 = Math.round((v3001 + v3002 + v3003) / 3);
const v3005 = Math.round(v3004 * 0.15);
const v3006 = Math.round(v3005 * 12.5);

  const rows = [
    { code: 3001, label: "Produit net bancaire positif de la dernière année", input: true, key: "X3001" },
    { code: 3002, label: "Produit net bancaire positif de l'année", input: true, key: "X3002" },
    { code: 3003, label: "Produit net bancaire positif de l'année", input: true, key: "X3003" },
    { code: 3004, label: "Moyenne des produits nets bancaires positifs", calculated: true, value: v3004 },
    { code: 3005, label: "Exigence en fonds propres", calculated: true, value: v3005 },
    { code: 3006, label: "EXPOSITION PONDEREE AU TITRE DU RISQUE OPERATIONNEL", calculated: true, value: v3006 },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-lg text-left">Désignation</th>
            <th className="p-3 text-lg text-center">Code</th>
            <th className="p-3 text-lg text-right">Montant</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.code}
              className={`border-b ${row.calculated ? "border-white" : ""}`}
            >
              <td
                className={`p-3 w-3/5 text-left text-lg ${
                  row.calculated ? "bg-sofiblue text-white font-bold" : ""
                }`}
              >
                {row.label}
              </td>

              <td
                className={`p-3 text-center font-bold text-lg ${
                  row.calculated ? "bg-sofiblue text-white" : ""
                }`}
              >
                {row.code}
              </td>

              <td
                className={`p-3 text-right ${
                  row.calculated
                    ? "bg-sofiblue text-white font-bold text-center text-xl"
                    : ""
                }`}
              >
                {row.input ? (
                  <FormattedNumberInputKDA
                    value={formData[row.key]}
                    onChange={(val) => updateField(row.key, val)}
                  />
                ) : (
                  row.value.toLocaleString()
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StepS3000;