import { useState } from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import Input from "../general/Input";

function StepECP({
  formData,
  updateField,
  // beneficiaires,
  addBeneficiaire,
  updateBeneficiaire,
  removeBeneficiaire,
}) {
  const [errors, setErrors] = useState({});
  const beneficiaires = formData.beneficiaires;

  // ---------- VALIDATION ----------
  const validateNom = (value) => {
    if (/\d/.test(value)) {
      return "Pas de chiffres autorisés";
    }
    return "";
  };

  const validateNif = (value) => {
    if (!/^\d{15,20}$/.test(value)) {
      return "15 à 20 chiffres requis";
    }
    return "";
  };

  const validateConstraints = (b, index) => {
    const newErrors = {};

    if (Number(b.montant_utilise) > Number(b.montant_autorise)) {
      newErrors[`${index}-montant_utilise`] = "Dépasse le montant autorisé";
    }

    if (
      b.date_autorisation &&
      b.date_echeance &&
      new Date(b.date_echeance) < new Date(b.date_autorisation)
    ) {
      newErrors[`${index}-date_echeance`] = "Doit être ≥ date autorisation";
    }

    return newErrors;
  };

  const handleChange = (index, field, value) => {
    let error = "";

    if (field === "raison_sociale") error = validateNom(value);
    if (field === "nif") error = validateNif(value);

    const updated = {
      ...beneficiaires[index],
      [field]: value,
    };

    const constraintErrors = validateConstraints(updated, index);

    setErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: error,
      ...constraintErrors,
    }));

    updateBeneficiaire(index, field, value);
  };

  // ---------- TABLE ----------
  return (
    <div className="space-y-4">
      {/* FONDS PROPRES */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-6">
        <label className="text-lg font-bold text-sofiblue">
          Fonds propres de base
        </label>

        <div className="w-64">
          <FormattedNumberInputKDA
            value={formData?.fonds_propres || ""}
            onChange={(val) => updateField("fonds_propres", val)}
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-sofiblue">
          Engagements par Crédit
        </h3>

        <button
          type="button"
          className="btn btn-primary"
          onClick={addBeneficiaire}
        >
          + Ajouter bénéficiaires
        </button>

        {/* TABLE HERE */}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-sofiblue text-base text-white">
            <tr>
              <th className="p-3">Raison sociale</th>
              <th className="p-3">NIF</th>
              <th className="p-3">Nature</th>
              <th className="p-3">Date autorisation</th>
              <th className="p-3">Date échéance</th>
              <th className="p-3">Montant autorisé</th>
              <th className="p-3">Montant utilisé</th>
              <th className="p-3">Destination</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {beneficiaires.map((b, index) => (
              <tr key={index} className="border-b ">
                {/* RAISON SOCIALE */}
                <td className="p-2">
                  <Input
                    value={b.raison_sociale || ""}
                    onChange={(val) =>
                      handleChange(index, "raison_sociale", val)
                    }
                    error={errors[`${index}-raison_sociale`]}
                  />
                </td>

                {/* NIF */}
                <td className="p-2">
                  <Input
                    value={b.nif || ""}
                    onChange={(val) => handleChange(index, "nif", val)}
                    error={errors[`${index}-nif`]}
                  />
                </td>

                {/* NATURE */}
                
                  <td className="p-2">
                    <select
                      className="input border rounded p-2 w-full"
                      value={b.nature_credit ?? ""}
                      onChange={(e) =>
                        handleChange(index, "nature_credit", e.target.value)
                      }
                    >
                      <option value="">-- Choisir --</option>
                      <option value="Leasing">Leasing</option>
                      <option value="CMLT">CMLT</option>
                    </select>
                  </td>
                

                {/* DATE AUTORISATION */}
                <td className="p-2">
                  <input
                    type="date"
                    className="input border rounded p-2 w-full"
                    value={b.date_autorisation || ""}
                    onChange={(e) =>
                      handleChange(index, "date_autorisation", e.target.value)
                    }
                  />
                </td>

                {/* DATE ECHEANCE */}
                <td className="p-2">
                  <input
                    type="date"
                    className="input border rounded p-2 w-full"
                    value={b.date_echeance || ""}
                    onChange={(e) =>
                      handleChange(index, "date_echeance", e.target.value)
                    }
                  />
                  {errors[`${index}-date_echeance`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`${index}-date_echeance`]}
                    </p>
                  )}
                </td>

                {/* MONTANT AUTORISE */}
                <td className="p-2">
                  <FormattedNumberInputKDA
                    value={b.montant_autorise ?? 0}
                    onChange={(val) =>
                      handleChange(index, "montant_autorise", val)
                    }
                  />
                </td>

                {/* MONTANT UTILISE */}
                <td className="p-2">
                  <FormattedNumberInputKDA
                    value={b.montant_utilise ?? 0}
                    onChange={(val) =>
                      handleChange(index, "montant_utilise", val)
                    }
                  />
                  {errors[`${index}-montant_utilise`] && (
                    <p className="text-red-500 text-xs">
                      {errors[`${index}-montant_utilise`]}
                    </p>
                  )}
                </td>

                {/* DESTINATION */}
                <td className="p-2">
                  <Input
                    value={b.destination_credit || ""}
                    onChange={(val) =>
                      handleChange(index, "destination_credit", val)
                    }
                  />
                </td>

                {/* ACTION */}
                <td className="p-2 text-center">
                  <button
                    type="button"
                    className="btn btn-danger text-xs"
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
    </div>
  );
}

export default StepECP;
