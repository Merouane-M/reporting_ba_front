import { useEffect } from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function FinancialTable({ index, data, updateBeneficiaire }) {
  const num = (v) => Number(v) || 0;
  const get = (field) => num(data[field]);
  const calcNet = (brut, gar, prov) => brut - gar - prov;

  const InputCell = ({ field }) => (
    <FormattedNumberInputKDA
      value={data[field]}
      onChange={(val) =>
        updateBeneficiaire(index, field, val)
      }
    />
  );

  /* =========================
     CALCULATIONS
  ========================== */

  const bilanBrut = get("montant_Brut_BPA") + get("montant_Brut_T");
  const bilanGar =
    get("montant_Garanties_BPA") +
    get("montant_Garanties_T");
  const bilanProv =
    get("montant_Provisions_BPA") +
    get("montant_Provisions_T");
  const bilanPond =
    get("montant_Risques_Ponderes_BPA") +
    get("montant_Risques_Ponderes_T");

  const horsBrut =
    get("montant_Brut_EF") +
    get("montant_Brut_EG");
  const horsGar =
    get("montant_Garanties_EF") +
    get("montant_Garanties_EG");
  const horsProv =
    get("montant_Provisions_EF") +
    get("montant_Provisions_EG");
  const horsPond =
    get("montant_Risques_Ponderes_EF") +
    get("montant_Risques_Ponderes_EG");

  const totalBrut = bilanBrut + horsBrut;
  const totalGar = bilanGar + horsGar;
  const totalProv = bilanProv + horsProv;
  const totalPond = bilanPond + horsPond;

  /* =========================
     UPDATE JSON
  ========================== */

  useEffect(() => {
    updateBeneficiaire(
      index,
      "montantRisquesPonderes",
      totalPond.toFixed(2)
    );
  }, [totalPond, index]);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-base text-white">
          <tr>
            <th className="p-3 text-left">Libellé</th>
            <th className="p-3 text-right">Brut</th>
            <th className="p-3 text-right">Garanties</th>
            <th className="p-3 text-right">Provisions</th>
            <th className="p-3 text-right">Risque Net</th>
            <th className="p-3 text-right">Risque Pondéré</th>
          </tr>
        </thead>

        <tbody>
          {/* ================= BILAN ================= */}
          <tr className="bg-sofiblue text-xl text-white font-bold">
            <td className="p-3">Bilan</td>
            <td className="p-3 text-right">
              {bilanBrut.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {bilanGar.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {bilanProv.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {calcNet(
                bilanBrut,
                bilanGar,
                bilanProv
              ).toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {bilanPond.toLocaleString()}
            </td>
          </tr>

          {["BPA", "T"].map((code) => (
            <tr key={code} className="border-b">
              <td className="p-3 font-semibold text-base pl-6">
                {code === "BPA"
                  ? "Prêts et assimilés"
                  : "Titres"}
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Brut_${code}`}
                />
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Garanties_${code}`}
                />
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Provisions_${code}`}
                />
              </td>

              <td className="p-3 bg-sofiblue text-white font-bold text-xl text-right">
                {calcNet(
                  get(`montant_Brut_${code}`),
                  get(`montant_Garanties_${code}`),
                  get(`montant_Provisions_${code}`)
                ).toLocaleString()}
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Risques_Ponderes_${code}`}
                />
              </td>
            </tr>
          ))}

          {/* ================= HORS BILAN ================= */}
          <tr className="bg-sofiblue text-xl text-white font-bold">
            <td className="p-3">Hors Bilan</td>
            <td className="p-3 text-right">
              {horsBrut.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {horsGar.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {horsProv.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {calcNet(
                horsBrut,
                horsGar,
                horsProv
              ).toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {horsPond.toLocaleString()}
            </td>
          </tr>

          {["EF", "EG"].map((code) => (
            <tr key={code} className="border-b">
              <td className="p-3 font-semibold text-base pl-6">
                {code === "EF"
                  ? "Engagements de financement"
                  : "Engagements de garantie"}
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Brut_${code}`}
                />
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Garanties_${code}`}
                />
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Provisions_${code}`}
                />
              </td>

              <td className="p-3 bg-sofiblue text-white font-bold text-xl text-right">
                {calcNet(
                  get(`montant_Brut_${code}`),
                  get(`montant_Garanties_${code}`),
                  get(`montant_Provisions_${code}`)
                ).toLocaleString()}
              </td>

              <td className="p-3 text-right">
                <InputCell
                  field={`montant_Risques_Ponderes_${code}`}
                />
              </td>
            </tr>
          ))}

          {/* ================= TOTAL ================= */}
          <tr className="bg-sofiblue text-white font-bold text-lg">
            <td className="p-3">TOTAL</td>
            <td className="p-3 text-right">
              {totalBrut.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {totalGar.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {totalProv.toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {calcNet(
                totalBrut,
                totalGar,
                totalProv
              ).toLocaleString()}
            </td>
            <td className="p-3 text-right">
              {totalPond.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FinancialTable;
