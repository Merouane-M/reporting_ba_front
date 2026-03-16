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
const FinancialGroup = ({ title, children }) => (
  <div className="border border-sofiblue/30 rounded-lg p-4 bg-white shadow-sm">
    <h6 className="text-sm font-bold text-sofiblue mb-3 border-b pb-1">
      {title}
    </h6>

    <div className="grid grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);
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

    if (field === "beneficiaire") error = validateNom(value);
    if (field === "nif") error = validateNif(value);

    setErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: error,
    }));

    updateBeneficiaire(index, field, value);
  };

  const NumericField = ({ label, value, onChange }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <FormattedNumberInputKDA value={value} onChange={onChange} />
    </div>
  );

  return (
    <div className="space-y-8 bg-white rounded-xl shadow-lg p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-2xl font-bold text-sofiblue">
          Bénéficiaires
        </h3>

        <button
          type="button"
          className="btn btn-primary"
          onClick={addBeneficiaire}
        >
          + Ajouter bénéficiaire
        </button>
      </div>

      {beneficiaires.map((b, index) => (
        <div
          key={index}
          className="border border-sofiblue rounded-xl p-6 bg-sofigrey/40 space-y-6 shadow-xl"
        >

          {/* CARD HEADER */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-sofiblue">
              Bénéficiaire #{index + 1}
            </h4>

            <button
              type="button"
              className="btn btn-danger text-sm"
              onClick={() => removeBeneficiaire(index)}
            >
              Supprimer
            </button>
          </div>
                      <h5 className="text-sm font-bold text-white bg-sofiblue p-1 rounded">
              Informations Bénéficiaire
            </h5>

          {/* BASIC INFO */}
          <div className="grid grid-cols-6 gap-5">

            <Input
              label="Bénéficiaire"
              value={b.beneficiaire || ""}
              onChange={(val) =>
                handleChange(index, "beneficiaire", val)
              }
              error={errors[`${index}-beneficiaire`]}
            />

            <Input
              label="NIF"
              value={b.nif || ""}
              onChange={(val) => handleChange(index, "nif", val)}
              error={errors[`${index}-nif`]}
            />

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Catégorie
              </label>
              <select
                className="input border rounded p-2 w-3/4 text-right"
                value={b.categorie ?? "C1"}
                onChange={(e) =>
                  updateBeneficiaire(index, "categorie", e.target.value)
                }
              >
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="C3">C3</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Catégorie avant
              </label>
              <select
                className="input border rounded p-2 w-3/4 text-right"
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
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Date octroi
              </label>
              <input
                type="date"
                className="input border rounded p-2 w-3/4 text-right"
                value={formatDate(b.date_octroi_credit)}
                onChange={(e) =>
                  updateBeneficiaire(
                    index,
                    "date_octroi_credit",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Année déclassement
              </label>
              <select
                className="input border rounded p-2 w-3/4 text-right"
                value={extractYear(b.annees_declassement_credits)}
                onChange={(e) => {
                  const year = e.target.value;
                  const formattedDate = year
                    ? `${year}-01-01`
                    : "";
                  updateBeneficiaire(
                    index,
                    "annees_declassement_credits",
                    formattedDate
                  );
                }}
              >
                <option value="">-- Année --</option>
                {Array.from({ length: 20 }, (_, i) => {
                  const year =
                    new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>

          {/* FINANCIAL SECTION */}
          <div className="border-t pt-4">

  <h5 className="text-sm font-bold text-white bg-sofiblue p-1 rounded mb-4">
    Informations financières
  </h5>

  <div className="grid grid-cols-2 gap-6">

    <FinancialGroup title="Encours">
      <NumericField
        label="Créances Bilan"
        value={b.encours_creance_bilan || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "encours_creance_bilan", val)
        }
      />

      <NumericField
        label="Engagements Hors Bilan"
        value={b.encours_engagements_hors_bilan || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "encours_engagements_hors_bilan", val)
        }
      />
    </FinancialGroup>

    <FinancialGroup title="Montants rééchelonnés">
      <NumericField
        label="Dispositif Gouvernemental"
        value={b.montant_reech_gouv || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "montant_reech_gouv", val)
        }
      />

      <NumericField
        label="Autres"
        value={b.montant_reech_autres || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "montant_reech_autres", val)
        }
      />
    </FinancialGroup>

    <FinancialGroup title="Provision avant rééchelonnement">
      <NumericField
        label="Dispositif Gouvernemental"
        value={b.provision_avant_gouv || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "provision_avant_gouv", val)
        }
      />

      <NumericField
        label="Autres"
        value={b.provision_avant_autres || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "provision_avant_autres", val)
        }
      />
    </FinancialGroup>

    <FinancialGroup title="Provision après rééchelonnement">
      <NumericField
        label="Dispositif Gouvernemental"
        value={b.provision_apres_gouv || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "provision_apres_gouv", val)
        }
      />

      <NumericField
        label="Autres"
        value={b.provision_apres_autres || ""}
        onChange={(val) =>
          updateBeneficiaire(index, "provision_apres_autres", val)
        }
      />
    </FinancialGroup>

  </div>

</div>

          {/* OBSERVATIONS */}
          <Input
            label="Observations"
            value={b.observations || ""}
            onChange={(val) =>
              updateBeneficiaire(index, "observations", val)
            }
          />

        </div>
      ))}
    </div>
  );
}

export default StepCBR;