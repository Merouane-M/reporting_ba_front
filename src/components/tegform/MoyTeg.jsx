import React from "react";


function StepM100({ formData, updateField }) {
  const getValue = (taux) => Number(formData[taux] || 0);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-lg text-left">CATEGORIE DE CONCOURS</th>
            <th className="p-3 text-lg text-right">TEG MOYEN</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-3 text-lg">LEASING</td>

            <td className="p-3 text-right">
              <input
                type="number"
                step="0.01"
                value={getValue("taux")}
                onChange={(e) => updateField("taux", e.target.value)}
                className="border rounded px-2 py-1 w-32 text-right"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MoyTeg;