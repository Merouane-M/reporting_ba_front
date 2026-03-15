import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import { RCC_ROWS } from "../../constants/rccRows";

function StepRCC({ formData, updateField, sector }) {
    // Helper to build the correct field name
    const field = (code, type) => {
        // Use MB2 for compromised rows only
        if ((code === "CB_CC" || code === "CHB_CC") && type === "MB") {
            return `${code}_MB2_${sector}`;
        }
        return `${code}_${type}_${sector}`;
    };

    // Safely get numeric value from formData
    const getValue = (code, type) => Number(formData[field(code, type)] || 0);

    // Net calculation
    const net = (mb, ga, p) => mb - ga - p;

    // Get row values
    const getRowValues = (code) => {
        const mb = getValue(code, "MB");
        const ga = getValue(code, "GA");
        const p = getValue(code, "P");
        return { mb, ga, p, net: net(mb, ga, p) };
    };

    // Sum multiple rows (for totals)
    const sumRows = (codes) => {
        let mb = 0, ga = 0, p = 0;
        codes.forEach((code) => {
            const row = getRowValues(code);
            mb += row.mb;
            ga += row.ga;
            p += row.p;
        });
        return { mb, ga, p, net: net(mb, ga, p) };
    };

    // Calculated totals (display only)
    const CB_TOTAL = sumRows(["CB_CPP", "CB_CTR", "CB_CC"]);
    const CHB_TOTAL = sumRows(["CHB_CPP", "CHB_CTR", "CHB_CC"]);
    const calculatedValues = { CB_TOTAL, CHB_TOTAL };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
  <table className="w-full text-sm border-collapse">
    <thead className="bg-sofiblue text-white">
      <tr>
        <th className="p-3 text-left">Désignation</th>
        {/* Removed Code column */}
        <th className="p-3 text-right">Montant Brut</th>
        <th className="p-3 text-right">Garanties Admises</th>
        <th className="p-3 text-right">Provisions</th>
        <th className="p-3 text-right">Montant  Net</th>
      </tr>
    </thead>
    <tbody>
      {RCC_ROWS.map((row, index) => {
        const key = `${row.code || "section"}-${index}`;

        // Section row
        if (!row.code) {
          const sectionCodes =
            row.label.includes("bilan")
              ? ["CB_CPP", "CB_CTR", "CB_CC"]
              : ["CHB_CPP", "CHB_CTR", "CHB_CC"];

          let mb = null,
            ga = null,
            p = null;
          sectionCodes.forEach((code) => {
            const mbField = code.includes("CC") ? "MB2" : "MB";
            mb += getValue(code, mbField);
            ga += getValue(code, "GA");
            p += getValue(code, "P");
          });
          const net = mb - ga - p;

          return (
            <tr key={key} className="bg-gray-200 font-bold">
              <td className="p-3" colSpan={1}>
                {row.label}
              </td>
              <td className="p-3 text-right">{mb.toLocaleString()}</td>
              <td className="p-3 text-right">{ga.toLocaleString()}</td>
              <td className="p-3 text-right">{p.toLocaleString()}</td>
              <td className="p-3 text-right">{net.toLocaleString()}</td>
            </tr>
          );
        }

        // Individual editable rows
        const mbField = row.code.includes("CC") ? "MB2" : "MB";
        const mb = getValue(row.code, mbField);
        const ga = getValue(row.code, "GA");
        const p = getValue(row.code, "P");
        const net = mb - ga - p;

        return (
          <tr key={key} className="border-b">
            <td className="p-3 text-left">{row.label}</td>
            {/* Removed Code cell */}
            <td className="p-3 text-right">
              <FormattedNumberInputKDA
                value={mb}
                onChange={(val) => updateField(field(row.code, mbField), val)}
              />
            </td>
            <td className="p-3 text-right">
              <FormattedNumberInputKDA
                value={ga}
                onChange={(val) => updateField(field(row.code, "GA"), val)}
              />
            </td>
            <td className="p-3 text-right">
              <FormattedNumberInputKDA
                value={p}
                onChange={(val) => updateField(field(row.code, "P"), val)}
              />
            </td>
            <td className="p-3 text-right font-bold bg-sofiblue text-white">
              {net.toLocaleString()}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
    );
}

export default StepRCC;