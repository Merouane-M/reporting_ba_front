import React from "react";
import { C33_ROWS } from "../../constants/c33Rows";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function StepC33({ formData, updateField }) {
  const getSignature = (code) =>
    Number(formData[`C${code}_SIGNATURE`] || 0);

  const getDepot = (code) =>
    Number(formData[`C${code}_DEPOTS`] || 0);

  const totalSignature = C33_ROWS.reduce(
    (sum, row) => sum + getSignature(row.code),
    0
  );

  const totalDepots = C33_ROWS.reduce(
    (sum, row) => sum + getDepot(row.code),
    0
  );

  const totalNet = C33_ROWS.reduce(
    (sum, row) => sum + (getSignature(row.code) - getDepot(row.code)),
    0
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-sofiblue text-white font-bold text-lg">
          <tr className="">
            <th className="p-3 text-left">Libellé</th>
            <th className="p-3 text-center">Code</th>
            <th className="p-3 text-right">
              Engagements par signature donnés (montants brut)
            </th>
            <th className="p-3 text-right">
              Dépôts de garantie reçus
            </th>
            <th className="p-3 text-right">
              Total engagements par signature donnés
            </th>
          </tr>
        </thead>

        <tbody>
          {C33_ROWS.map((row) => {
            const signature = getSignature(row.code);
            const depot = getDepot(row.code);
            const net = signature - depot;

            return (
              <tr key={row.code} className="border-b">
                <td className="p-3  text-xl">{row.label}</td>
                <td className="p-3 text-center font-bold text-xl">
                  {row.code}
                </td>

                <td className="p-3 text-right">
                  <FormattedNumberInputKDA
                    value={formData[`C${row.code}_SIGNATURE`]}
                    onChange={(val) =>
                      updateField(`C${row.code}_SIGNATURE`, val)
                    }
                  />
                </td>

                <td className="p-3 text-right">
                  <FormattedNumberInputKDA
                    value={formData[`C${row.code}_DEPOTS`]}
                    onChange={(val) =>
                      updateField(`C${row.code}_DEPOTS`, val)
                    }
                  />
                </td>

                <td className="p-3 text-right font-bold text-lg">
                  {net.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            );
          })}

          {/* TOTAL ROW */}
          <tr className="bg-sofiblue text-white font-bold text-lg">
            <td className="p-3">TOTAL</td>
            <td className="p-3 text-center">-</td>

            <td className="p-3 text-right">
              {totalSignature.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>

            <td className="p-3 text-right">
              {totalDepots.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>

            <td className="p-3 text-right">
              {totalNet.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StepC33;
