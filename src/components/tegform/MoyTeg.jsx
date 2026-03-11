import React from "react";

import FormattedNumberInput from "../general/FormattedNumberInput";

function MoyTeg({ formData, updateField }) {
    const getValue = (taux) => Number(formData[taux] || 0);

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm border-collapse">
                <thead className="bg-sofiblue text-white w-full ">
                    <tr className="  ">
                        <th className="p-3 text-lg text-left">CATEGORIE DE CONCOURS</th>
                        <th className="p-3 text-lg text-right">TEG MOYEN</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="p-3 text-lg">LEASING</td>

                        <td className="p-3 flex items-center justify-end text-right">

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                className="border rounded p-2 pr-8 w-1/2 text-right"
                                value={formData.taux || ""}
                                onChange={(e) => {
                                    let value = parseFloat(e.target.value);

                                    if (isNaN(value)) value = "";
                                    else if (value > 100) value = 100;
                                    else if (value < 0) value = 0;

                                    updateField("taux", value);
                                }}
                            />

                            <span className="mx-2 font-bold text-xl">
                                %</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default MoyTeg;