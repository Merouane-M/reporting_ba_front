import React from "react";
import FormattedNumberInput from "../general/FormattedNumberInput";
import { M100_ROWS } from "../../constants/m100Rows";

function StepM100({ formData, updateField }) {
  const getValue = (code) => Number(formData[`M_${code}`] || 0);

  const sum = (codes) =>
    codes.reduce((total, code) => total + getValue(code), 0);

  // Calculations
  const total1008 = sum([1001, 1002, 1003, 1004, 1005, 1006, 1007]);
  const total1017 = sum([1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016]);
  const total1018 = total1008 - total1017;
  const total1025 = sum([1019, 1020, 1021, 1022, 1023, 1024]);
  const total1028 = total1025 - getValue(1026) - getValue(1027);
  const total1029 = Math.min(total1018, total1028);
  const total1030 = total1029 + total1018;

  const calculatedValues = {
    1008: total1008,
    1017: total1017,
    1018: total1018,
    1025: total1025,
    1028: total1028,
    1029: total1029,
    1030: total1030,
  };

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
          {M100_ROWS.map((row) => (
            <tr
              key={row.code}
              className={`border-b ${row.calculated ? "border-white" : ""}`}
            >
              <td
                className={`p-3 w-3/5 text-left text-lg ${
                  row.calculated
                    ? "bg-sofiblue text-white font-bold text-lg"
                    : ""
                }`}
              >
                {row.label}
              </td>
              <td
                className={`p-3 text-center font-bold text-lg ${
                  row.calculated
                    ? "bg-sofiblue text-white  text-center text-lg"
                    : ""
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
                {row.calculated ? (
                  calculatedValues[row.code]?.toLocaleString() || 0
                ) : (
                  <FormattedNumberInput
                    value={formData[`M_${row.code}`]}
                    onChange={(val) => updateField(`M_${row.code}`, val)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StepM100;
