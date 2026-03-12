import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import { S2000_reference } from "../../constants/S2000";

function StepS2000A({ formData, updateField }) {
  const getValue = (key) => Number(formData[key] || 0);

  let totalMB = 0;
  let totalGA = 0;
  let totalNet = 0;

  const row2014 = S2000_reference.find((row) => row.code === 2014);
  const rows = S2000_reference.filter(
    (row) => row.code >= 2020 && row.code <= 2033
  );

  const renderRow = (row) => {
    const prefix = row.code === 2014 ? "A" : "Y";

    const gaKey = `${prefix}${row.code}_ga`;
    const mbKey = `${prefix}${row.code}_mb`;

    const ga = getValue(gaKey);
    const mb = getValue(mbKey);
    const result = Math.round(mb - ga);

    if (row.code >= 2020 && row.code <= 2033) {
      totalMB += mb;
      totalGA += ga;
      totalNet += result;
    }

    return (
      <tr key={row.code} className={`border-b ${row.code==2014 ? "border-b-10 border-sofiblue" : ""}`}>
        <td className="p-3 w-3/5 text-left text-lg">{row.title}</td>

        <td className="p-3 text-center font-bold text-lg">{row.code}</td>

        <td className="p-3 text-right">
          <FormattedNumberInputKDA
            value={formData[mbKey]}
            onChange={(val) => updateField(mbKey, val)}
          />
        </td>

        <td className="p-3 text-right">
          <FormattedNumberInputKDA
            value={formData[gaKey]}
            onChange={(val) => updateField(gaKey, val)}
          />
        </td>

        <td className="p-3 text-right font-bold text-lg">
          {result.toLocaleString()}
        </td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-left">Désignation</th>
            <th className="p-3 text-center">Code</th>
            <th className="p-3 text-right">Montant Brut</th>
            <th className="p-3 text-right">GarantieAdmise</th>
            <th className="p-3 text-right">MontantNet</th>
          </tr>
        </thead>

        <tbody>
          {/* 2014 alone */}
          {row2014 && renderRow(row2014)}

          {/* Rows 2020 → 2033 */}
          {rows.map((row) => renderRow(row))}

          {/* TOTAL ROW */}
          <tr className="bg-sofiblue text-white font-bold text-lg">
            <td className="p-3">SOUS TOTAL 2</td>
            <td className="p-3 text-center">2034</td>
            <td className="p-3 text-right">
              {Math.round(totalMB).toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {Math.round(totalGA).toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {Math.round(totalNet).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StepS2000A;