import { useState } from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import Input from "../general/Input";

function StepCBR({
  beneficiaires,
  addBeneficiaire,
  updateBeneficiaire,
  removeBeneficiaire,
}) {
  const [errors, setErrors] = useState({});

  const validateNom = (value) => {
    if (/\d/.test(value)) {
      return "Le nom ne doit pas contenir de chiffres.";
    }
    return "";
  };

  const validateNif = (value) => {
    if (!/^\d{15,20}$/.test(value)) {
      return "Le NIF doit contenir entre 15 et 20 chiffres.";
    }
    return "";
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const extractYear = (date) => {
    if (!date) return "";
    try {
      return new Date(date).getFullYear().toString();
    } catch {
      return "";
    }
  };

  const handleChange = (index, field, value) => {
    let error = "";

    if (field === "beneficiaire") {
      error = validateNom(value);
    }

    if (field === "nif") {
      error = validateNif(value);
    }

    setErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: error,
    }));

    updateBeneficiaire(index, field, value);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-xl font-bold text-sofiblue">Bénéficiaires</h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={addBeneficiaire}
        >
          + Ajouter bénéficiaire
        </button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-left">Bénéficiaire</th>
            <th className="p-3 text-left">NIF</th>
            <th className="p-3 text-center">Catégorie</th>
            <th className="p-3 text-center">Catégorie avant</th>
            <th className="p-3 text-left">Date octroi</th>
            <th className="p-3 text-left">Année déclassement</th>
            <th className="p-3 text-right">Encours Creance bilan</th>
            <th className="p-3 text-right">Encours Engagements Hors bilan</th>
            <th className="p-3 text-right">Rééchel. Gouv</th>
            <th className="p-3 text-right">Rééchel. Autres</th>
            <th className="p-3 text-right">Prov. avant Gouv</th>
            <th className="p-3 text-right">Prov. avant Autres</th>
            <th className="p-3 text-right">Prov. après Gouv</th>
            <th className="p-3 text-right">Prov. après Autres</th>
            <th className="p-3 text-left">Observations</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {beneficiaires.map((b, index) => (
            <tr key={index} className="border-b align-top">

              {/* BENEFICIAIRE */}
              <td className="p-3">
                <Input
                  value={b.beneficiaire || ""}
                  onChange={(val) => handleChange(index, "beneficiaire", val)}
                  error={errors[`${index}-beneficiaire`]}
                />
              </td>

              {/* NIF */}
              <td className="p-3">
                <Input
                  value={b.nif || ""}
                  onChange={(val) => handleChange(index, "nif", val)}
                  error={errors[`${index}-nif`]}
                />
              </td>

              {/* CATEGORIE */}
              <td className="p-3">
                <select
                  className="input"
                  value={b.categorie ?? "C1"}
                  onChange={(e) =>
                    updateBeneficiaire(index, "categorie", e.target.value)
                  }
                >
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="C3">C3</option>
                </select>
              </td>

              {/* CATEGORIE AVANT */}
              <td className="p-3">
                <select
                  className="input"
                  value={b.categorie_avant_reechelonnement ?? "C1"}
                  onChange={(e) =>
                    updateBeneficiaire(
                      index,
                      "categorie_avant_reechelonnement",
                      e.target.value
                    )
                  }
                >
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="C3">C3</option>
                </select>
              </td>

              {/* DATE OCTROI */}
              <td className="p-3">
                <input
                  type="date"
                  className="input"
                  value={formatDate(b.date_octroi_credit)}
                  onChange={(e) =>
                    updateBeneficiaire(
                      index,
                      "date_octroi_credit",
                      e.target.value
                    )
                  }
                />
              </td>

              {/* ANNEE DECLASSEMENT */}
              <td className="p-3">
                <select
                  className="input"
                  value={extractYear(b.annees_declassement_credits)}
onChange={(e) => {
  const year = e.target.value;

  const formattedDate = year ? `${year}-01-01` : "";

  updateBeneficiaire(
    index,
    "annees_declassement_credits",
    formattedDate
  );
}}
                >
                  <option value="">-- Année --</option>

                  {Array.from({ length: 20 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </td>

              {/* NUMERIC FIELDS */}
              {[
                "encours_creance_bilan",
                "encours_engagements_hors_bilan",
                "montant_reech_gouv",
                "montant_reech_autres",
                "provision_avant_gouv",
                "provision_avant_autres",
                "provision_apres_gouv",
                "provision_apres_autres",
              ].map((field) => (
                <td key={field} className="p-3 text-right">
                  <FormattedNumberInputKDA
                    value={b[field] || ""}
                    onChange={(val) => updateBeneficiaire(index, field, val)}
                  />
                </td>
              ))}

              {/* OBSERVATIONS */}
              <td className="p-3">
                <Input
                  value={b.observations || ""}
                  onChange={(val) =>
                    updateBeneficiaire(index, "observations", val)
                  }
                />
              </td>

              {/* DELETE */}
              <td className="p-3 text-center">
                <button
                  type="button"
                  className="btn btn-danger text-sm"
                  onClick={() => removeBeneficiaire(index)}
                >
                  Supprimer
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StepCBR;