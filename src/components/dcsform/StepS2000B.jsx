import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import { S2000_reference } from "../../constants/S2000";

function StepS2000B({ formData, updateField }) {
  const getValue = (key) => Number(formData[key] || 0);

  const groups = {
    2040: [50, 100],
    2041: [50, 100, 150],
  };

  const getTitle = (code) =>
    S2000_reference.find((r) => r.code === code)?.title || "";

  let totalAB = 0;
  let totalGA = 0;
  let totalPC = 0;
  let totalNet = 0;
  let totalRisk = 0;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue border-b-2 border-white text-white">
          <tr>
            <th className="p-3 text-lg text-left">Nature des créances classées</th>
            <th className="p-3 text-lg text-center">Code</th>
            <th className="p-3 text-lg text-right">Encourus Brut</th>
            <th className="p-3 text-lg text-right">Provisions Constituées</th>
            <th className="p-3 text-lg text-right">Garantie Admises</th>
            <th className="p-3 text-lg text-right">Montant Net</th>
            <th className="p-3 text-lg text-center">Pondération </th>
            <th className="p-3 text-lg text-right">Risque Net Pondéré</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(groups).map(([code, ponds]) => (
            <React.Fragment key={code}>
              
              {/* Section title row */}
              <tr className="bg-sofiblue text-white font-bold">
                <td className="p-3 text-lg">{getTitle(Number(code))}</td>
                <td className="p-3 text-center text-lg">{code}</td>
                <td colSpan="6"></td>
              </tr>

              {ponds.map((pond) => {
                const abKey = `X${code}_ab_${pond}`;
                const gaKey = `X${code}_ga_${pond}`;
                const pcKey = `X${code}_pc_${pond}`;

                const ab = getValue(abKey);
                const ga = getValue(gaKey);
                const pc = getValue(pcKey);

                const net = Math.round(ab - ga - pc);
                const risk = Math.round(net * (pond / 100));

                totalAB += ab;
                totalGA += ga;
                totalPC += pc;
                totalNet += net;
                totalRisk += risk;

                return (
                  <tr key={`${code}-${pond}`} className="border-b">
                    <td></td>
                    <td className="p-3 text-center font-bold">{code}</td>

                    <td className="p-3 text-right">
                      <FormattedNumberInputKDA
                        value={formData[abKey]}
                        onChange={(val) => updateField(abKey, val)}
                      />
                    </td>
                    <td className="p-3 text-right">
                      <FormattedNumberInputKDA
                        value={formData[pcKey]}
                        onChange={(val) => updateField(pcKey, val)}
                      />
                    </td>
                    <td className="p-3 text-right">
                      <FormattedNumberInputKDA
                        value={formData[gaKey]}
                        onChange={(val) => updateField(gaKey, val)}
                      />
                    </td>



                    <td className="p-3 text-right font-bold">
                      {net.toLocaleString()}
                    </td>

                    <td className="p-3 text-center font-bold">
                      {pond}%
                    </td>

                    <td className="p-3 text-right font-bold">
                      {risk.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}

          {/* TOTAL ROW 2042 */}
          <tr className="bg-sofiblue text-white font-bold text-lg">
            <td className="p-3">TOTAL CREANCES CLASSEES</td>
            <td className="p-3 text-center">2042</td>
            <td className="p-3 text-right">{Math.round(totalAB).toLocaleString()}</td>
            <td className="p-3 text-right">{Math.round(totalGA).toLocaleString()}</td>
            <td className="p-3 text-right">{Math.round(totalPC).toLocaleString()}</td>
            <td className="p-3 text-right">{Math.round(totalNet).toLocaleString()}</td>
            <td></td>
            <td className="p-3 text-right">{Math.round(totalRisk).toLocaleString()}</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}

export default StepS2000B;