import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import { S2000_reference } from "../../constants/S2000";

function StepS2000A({ formData, updateField }) {
  const getValue = (key) => Number(formData[key] || 0);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-lg text-left">Désignation</th>
            <th className="p-3 text-lg text-center">Code</th>
            <th className="p-3 text-lg text-right">Montant Brut</th>
            <th className="p-3 text-lg text-right">Garantie Admise</th>
            <th className="p-3 text-lg text-right">Montant Net</th>
          </tr>
        </thead>

        <tbody>
          {S2000_reference
            .filter((row) => row.code >= 2014 && row.code <= 2033)
            .map((row) => {
              const prefix = row.code === 2014 ? "A" : "Y";

              const gaKey = `${prefix}${row.code}_ga`;
              const mbKey = `${prefix}${row.code}_mb`;

              const ga = getValue(gaKey);
              const mb = getValue(mbKey);
              const result =  mb- ga;

              return (
                <tr key={row.code} className="border-b">
                  <td className="p-3 w-3/5 text-left text-lg">
                    {row.title}
                  </td>

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
                      value={formData[gaKey]}
                      onChange={(val) => updateField(gaKey, val)}
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
  );
}

export default StepS2000A;