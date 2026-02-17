import { useState } from "react"; // Add useState import
import FormattedNumberInput from "../general/FormattedNumberInput";

function StepBeneficiaire({
  index,
  data,
  updateBeneficiaire,
  addPersonneLiee,
  updatePersonneLiee,
}) {
  const [blurTrigger, setBlurTrigger] = useState(0); // State to force re-render on blur

  const num = (v) => Number(v) || 0;
  const get = (field) => num(data[field]);

  const calcNet = (brut, gar, prov) => brut - gar - prov;

  const InputCell = ({ field }) => (
    <FormattedNumberInput
      key={blurTrigger} // Force re-render on blur
      value={data[field]}
      onChange={(val) => updateBeneficiaire(index, field, val)}
      onBlur={() => setBlurTrigger((prev) => prev + 1)} // Increment to trigger re-render
    />
  );

  /* =========================
     CALCULATIONS (DISPLAY ONLY)
  ========================== */

  const bilanBrut = get("montant_Brut_BPA") + get("montant_Brut_T");
  const bilanGar = get("montant_Garanties_BPA") + get("montant_Garanties_T");
  const bilanProv = get("montant_Provisions_BPA") + get("montant_Provisions_T");
  const bilanPond = get("montant_Risques_Ponderes_BPA") + get("montant_Risques_Ponderes_T");

  const horsBrut = get("montant_Brut_EF") + get("montant_Brut_EG");
  const horsGar = get("montant_Garanties_EF") + get("montant_Garanties_EG");
  const horsProv = get("montant_Provisions_EF") + get("montant_Provisions_EG");
  const horsPond = get("montant_Risques_Ponderes_EF") + get("montant_Risques_Ponderes_EG");

  const totalBrut = bilanBrut + horsBrut;
  const totalGar = bilanGar + horsGar;
  const totalProv = bilanProv + horsProv;
  const totalPond = bilanPond + horsPond;

  return (
    <div className="space-y-8">
      {/* =========================
         1️⃣ BENEFICIAIRE INFO
      ========================== */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-sofiblue">
          Bénéficiaire {index + 1}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-2"
            placeholder="Nom bénéficiaire"
            value={data.nomBeneficiaire || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "nomBeneficiaire", e.target.value)
            }
          />

          <input
            className="border p-2"
            placeholder="Adresse"
            value={data.adresseBeneficiaire || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "adresseBeneficiaire", e.target.value)
            }
          />

          <select
            className="border p-2"
            value={data.typeOperateur || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "typeOperateur", e.target.value)
            }
          >
            <option value="">Type opérateur</option>
            <option value="personne morale">Personne morale</option>
            <option value="personne physique">Personne physique</option>
          </select>

          <input
            className="border p-2"
            placeholder="NIF / NIN"
            value={data.nif_nin || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "nif_nin", e.target.value)
            }
          />

          <input
            className="border p-2"
            placeholder="Notation interne"
            value={data.notationInterne || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "notationInterne", e.target.value)
            }
          />

          <input
            className="border p-2"
            placeholder="Notation externe"
            value={data.notationExterne || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "notationExterne", e.target.value)
            }
          />
        </div>
      </div>

      {/* =========================
         2️⃣ FINANCIAL TABLE
      ========================== */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-sofiblue text-white">
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
            <tr className="bg-sofiblue text-white font-bold">
              <td className="p-3 text-base">Bilan</td>
              <td className="p-3 text-right">{bilanBrut.toLocaleString()}</td>
              <td className="p-3 text-right">{bilanGar.toLocaleString()}</td>
              <td className="p-3 text-right">{bilanProv.toLocaleString()}</td>
              <td className="p-3 text-right">
                {calcNet(bilanBrut, bilanGar, bilanProv).toLocaleString()}
              </td>
              <td className="p-3 text-right">{bilanPond.toLocaleString()}</td>
            </tr>

            {["BPA", "T", "EF", "EG"].map((code) => (
              <tr key={code} className="border-b">
                <td className="p-3 font-semibold text-base pl-6">
                  {code === "BPA"
                    ? "Prêts et assimilés"
                    : code === "T"
                    ? "Titres"
                    : code === "EF"
                    ? "Engagements de financement"
                    : "Engagements de garantie"}
                </td>

                <td className="p-3 text-right">
                  <InputCell field={`montant_Brut_${code}`} />
                </td>
                <td className="p-3 text-right">
                  <InputCell field={`montant_Garanties_${code}`} />
                </td>
                <td className="p-3 text-right">
                  <InputCell field={`montant_Provisions_${code}`} />
                </td>
                <td className="p-3 bg-sofiblue text-white font-bold text-base text-right">
                  {calcNet(
                    get(`montant_Brut_${code}`),
                    get(`montant_Garanties_${code}`),
                    get(`montant_Provisions_${code}`)
                  ).toLocaleString()}
                </td>
                <td className="p-3 text-right">
                  <InputCell field={`montant_Risques_Ponderes_${code}`} />
                </td>
              </tr>
            ))}

            {/* ================= TOTAL ================= */}
            <tr className="bg-sofiblue text-white font-bold text-lg">
              <td className="p-3">TOTAL</td>
              <td className="p-3 text-right">{totalBrut.toLocaleString()}</td>
              <td className="p-3 text-right">{totalGar.toLocaleString()}</td>
              <td className="p-3 text-right">{totalProv.toLocaleString()}</td>
              <td className="p-3 text-right">
                {calcNet(totalBrut, totalGar, totalProv).toLocaleString()}
              </td>
              <td className="p-3 text-right">{totalPond.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =========================
         3️⃣ PERSONNES LIEES TABLE
      ========================== */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-xl font-bold text-sofiblue">Personnes liées</h3>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => addPersonneLiee(index)}
          >
            + Ajouter personne liée
          </button>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-sofiblue text-white">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">NIF</th>
              <th className="p-3 text-right">Capital</th>
            </tr>
          </thead>

          <tbody>
            {data.personnes_liees?.map((pl, plIndex) => (
              <tr key={plIndex} className="border-b">
                <td className="p-3">
                  <input
                    className="border p-2 w-full"
                    value={pl.pl_nom || ""}
                    onChange={(e) =>
                      updatePersonneLiee(index, plIndex, "pl_nom", e.target.value)
                    }
                  />
                </td>

                <td className="p-3">
                  <input
                    className="border p-2 w-full"
                    value={pl.pl_nif || ""}
                    onChange={(e) =>
                      updatePersonneLiee(index, plIndex, "pl_nif", e.target.value)
                    }
                  />
                </td>

                <td className="p-3 text-right">
                  <FormattedNumberInput
                    value={pl.capital}
                    onChange={(val) =>
                      updatePersonneLiee(index, plIndex, "capital", val)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StepBeneficiaire;