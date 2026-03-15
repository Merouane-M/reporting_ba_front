import React from "react";
import { m4000 } from "../../constants/m4000";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function Step4001({ formData, updateField }) {

  const getValue = (field) => Number(formData[field] || 0);

  // ---- Display helpers ----

  const getDisplayCode = (code) => {
    if (code === 1021) return "102 a";
    if (code === 1022) return "102 b";
    if (code === 1023) return "102 c";
    return Math.floor(code / 10);
  };

  const getFieldName = (code) => {
    if (code === 1021) return "M_102a";
    if (code === 1022) return "M_102b";
    if (code === 1023) return "M_102c";
    return `M_${Math.floor(code / 10)}`;
  };

  // ---- Calculations ----

  const total102 =
    getValue("M_102a") +
    getValue("M_102b") +
    getValue("M_102c");

  const total107 =
    getValue("M_101") +
    total102 +
    getValue("M_103") +
    getValue("M_104") +
    getValue("M_105") +
    getValue("M_106");

  const total113 =
    getValue("M_108") +
    getValue("M_109") +
    getValue("M_110") +
    getValue("M_111") +
    getValue("M_112");

  const total114 = total107 - total113;

  const total122 =
    getValue("M_115") +
    getValue("M_116") +
    getValue("M_117") +
    getValue("M_118") +
    getValue("M_119") +
    getValue("M_120") +
    getValue("M_121");

  const total123 = total114 + total122;

  const calculatedValues = {
    102: total102,
    107: total107,
    113: total113,
    114: total114,
    122: total122,
    123: total123,
  };

  const calculatedRows = [1020, 1070, 1130, 1140, 1220, 1230];

  // ---- rows 101 → 123 ----

  const rows = m4000.filter((row) => {
    const realCode = Math.floor(row.code / 10);
    return realCode >= 101 && realCode <= 123;
  });

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

          {/* Section Title */}
          <tr className="bg-gray-100 border-b-2 border-sofiblue font-bold text-lg">
            <td className="p-3">Ressources Stables</td>
            <td></td>
            <td></td>
          </tr>

          <tr className="bg-gray-50 border-b-2 border-sofiblue font-semibold">
            <td className="p-3">1 - Fonds Propres</td>
            <td></td>
            <td></td>
          </tr>

          {rows.map((row) => {

            const realCode = Math.floor(row.code / 10);
            const field = getFieldName(row.code);
            const isCalculated = calculatedRows.includes(row.code);
            const isSubRow = [1021, 1022, 1023].includes(row.code);

            return (
              <React.Fragment key={row.code}>

                <tr className="border-b">

                  <td
                    className={`p-3 ${
                      isCalculated
                        ? "bg-sofiblue text-white font-bold text-lg"
                        : isSubRow
                        ? "text-sm pl-8 text-gray-700"
                        : "text-lg"
                    }`}
                  >
                    {row.title}
                  </td>

                  <td
                    className={`p-3 text-center font-bold ${
                      isCalculated
                        ? "bg-sofiblue text-white text-lg"
                        : isSubRow
                        ? "text-sm"
                        : "text-lg"
                    }`}
                  >
                    {getDisplayCode(row.code)}
                  </td>

                  <td
                    className={`p-3 text-right ${
                      isCalculated
                        ? "bg-sofiblue text-white font-bold text-xl"
                        : ""
                    }`}
                  >
                    {isCalculated ? (
                      calculatedValues[realCode]?.toLocaleString() || 0
                    ) : (
                      <FormattedNumberInputKDA
                        value={formData[field]}
                        onChange={(val) => updateField(field, val)}
                      />
                    )}
                  </td>

                </tr>

                {/* Section Break */}
                {row.code === 1140 && (
                  <tr className="bg-gray-50 border-b-2 border-sofiblue font-semibold">
                    <td className="p-3">2 - Ressources permanentes</td>
                    <td></td>
                    <td></td>
                  </tr>
                )}

              </React.Fragment>
            );
          })}

        </tbody>
      </table>
    </div>
  );
}

export default Step4001;