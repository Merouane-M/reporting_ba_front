import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import { S2000_reference } from "../../constants/S2000";

function StepS2000C({ formData, updateField }) {
  const getValue = (key) => Number(formData[key] || 0);

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-sofiblue text-white">
            <tr>
              <th className="p-3 text-lg text-left">Désignation</th>
              <th className="p-3 text-lg text-center">Code</th>
              <th className="p-3 text-lg text-right">Montant Brut</th>
              <th className="p-3 text-lg text-right">Provision</th>
              <th className="p-3 text-lg text-right">Montant Net</th>
            </tr>
          </thead>

          <tbody className="border-b-10 border-sofiblue">
            {S2000_reference.filter(
              (row) => row.code >= 2050 && row.code <= 2057,
            ).map((row) => {
              const prefix = "X";

              const mbKey = `${prefix}${row.code}_mb`;
              const prKey = `${prefix}${row.code}_pr`;

              const mb = getValue(mbKey);
              const pr = getValue(prKey);
              const result = mb - pr;

              return (
                <tr key={row.code} className="border-b">
                  <td className="p-3 w-3/5 text-left text-lg">{row.title}</td>

                  <td className="p-3 text-center font-bold text-lg">
                    {row.code}
                  </td>

                  <td className="p-3 text-right">
                    <FormattedNumberInputKDA
                      value={formData[mbKey]}
                      onChange={(val) => updateField(mbKey, val)}
                    />
                  </td>

                  <td className="p-3 text-right">
                    <FormattedNumberInputKDA
                      value={formData[prKey]}
                      onChange={(val) => updateField(prKey, val)}
                    />
                  </td>

                  <td className="p-3 text-right font-bold text-lg">
                    {result.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Code 2073 Section */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <span className="text-2xl font-bold text-white bg-sofiblue p-1 rounded"> S2000 D </span>
        <div className="flex items-center gap-4 my-4">
          <span className="text-lg font-bold ">2073 :</span>
          <span className="text-lg"> Entreprises installées en Algérie</span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Montant Brut</label>
            <FormattedNumberInputKDA
              value={formData["X2073_mb"]}
              onChange={(val) => updateField("X2073_mb", val)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Garanties Recues
            </label>
            <FormattedNumberInputKDA
              value={formData["X2073_gr"]}
              onChange={(val) => updateField("X2073_gr", val)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Contre Garanties Recues
            </label>
            <FormattedNumberInputKDA
              value={formData["X2073_cgr"]}
              onChange={(val) => updateField("X2073_cgr", val)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Provisions pour Risque et Charges
            </label>
            <FormattedNumberInputKDA
              value={formData["X2073_prc"]}
              onChange={(val) => updateField("X2073_prc", val)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default StepS2000C;
