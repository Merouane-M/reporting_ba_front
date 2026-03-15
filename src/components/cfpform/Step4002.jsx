import { m4000 } from "../../constants/m4000";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function Step4002({ formData, updateField }) {

  const getValue = (field) => Number(formData[field] || 0);

  // ---- Step4001 totals recalculated ----
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

  const total123 = total114 + total122; // <-- Step4001 total

  // ---- Calculations for Step4002 ----
  const total134 =
    getValue("M_124") +
    getValue("M_125") +
    getValue("M_126") +
    getValue("M_127") +
    getValue("M_128") +
    getValue("M_129") +
    getValue("M_130") +
    getValue("M_131") +
    getValue("M_132") +
    getValue("M_133");

  const ratio135 = total134 !== 0
    ? (total123 / total134).toFixed(2)
    : 0;

  const calculatedValues = {
    134: total134,
    135: ratio135,
  };

  const calculatedRows = [1340, 1350];

  // ---- rows 124 → 135 ----
  const rows = m4000.filter((row) => {
    const realCode = Math.floor(row.code / 10);
    return realCode >= 124 && realCode <= 135;
  });

  const getFieldName = (code) => `M_${Math.floor(code / 10)}`;

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
          {rows.map((row) => {
            const realCode = Math.floor(row.code / 10);
            const field = getFieldName(row.code);
            const isCalculated = calculatedRows.includes(row.code);

            return (
              <tr key={row.code} className="border-b">
                <td
                  className={`p-3 w-3/5 text-left ${
                    isCalculated ? "bg-sofiblue text-white font-bold text-lg" : "text-lg"
                  }`}
                >
                  {row.title}
                </td>
                <td
                  className={`p-3 text-center font-bold ${
                    isCalculated ? "bg-sofiblue text-white text-lg" : "text-lg"
                  }`}
                >
                  {realCode}
                </td>
                <td
                  className={`p-3 text-right ${
                    isCalculated ? "bg-sofiblue text-white font-bold text-xl" : ""
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Step4002;