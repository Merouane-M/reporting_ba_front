import React from "react";
import FormattedNumberInput from "../general/FormattedNumberInput";
import { FONDS_PROPRES_REFERENCES } from "../../constants/PositionChange";

function StepPositionChange({ formData, updateField }) {
  // Helper to get numeric value
  const getValue = (code) => parseFloat(formData[`fpn_${code}`] || 0);

  // Calculate totals
  const totalAH = FONDS_PROPRES_REFERENCES.slice(0, 8).reduce(
    (sum, item) => sum + getValue(item.code),
    0
  ); // A → H

  const totalIL = FONDS_PROPRES_REFERENCES.slice(8, 12).reduce(
    (sum, item) => sum + getValue(item.code),
    0
  ); // I → L

  const difference = totalAH - totalIL;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold text-sofiblue mb-4">Position de change II</h3>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-sofiblue text-white font-bold text-lg">
          <tr>
            <th className="p-3 text-left">Fonds Propres nets</th>
            <th className="p-3 text-center">Montant</th>
          </tr>
        </thead>

        <tbody>
          {FONDS_PROPRES_REFERENCES.map((item, index) => (
            <React.Fragment key={item.code}>
              {/* Regular editable row */}
              <tr className="border-b">
                <td className="p-3 text-xl">{`${item.code} - ${item.designation}`}</td>
                <td className="p-3 text-right">
                  <FormattedNumberInput
                    value={formData[`fpn_${item.code}`]}
                    onChange={(value) => updateField(`fpn_${item.code}`, value)}
                  />
                </td>
              </tr>

              {/* Insert first calculated row after H (index 7) */}
              {index === 7 && (
                <tr className="bg-sofiblue text-white font-bold text-lg">
                  <td className="p-3">Total A à H</td>
                  <td className="p-3 text-right">
                    {totalAH.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              )}

              {/* Insert second calculated row after L (index 11) */}
              {index === 11 && (
                <>
                  <tr className="bg-sofiblue text-white font-bold text-lg">
                    <td className="p-3">Total I à L</td>
                    <td className="p-3 text-right">
                      {totalIL.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="bg-sofiblue text-white font-bold text-lg">
                    <td className="p-3">Fonds propres nets (A-B)</td>
                    <td className="p-3 text-right">
                      {difference.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StepPositionChange;
