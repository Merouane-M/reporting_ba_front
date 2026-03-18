import { useState } from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import Input from "../general/Input";

function StepCPD({
  clients,
  addClient,
  updateClient,
  removeClient,
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

    if (field === "beneficiaire") error = validateNom(value);
    if (field === "nif") error = validateNif(value);

    setErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: error,
    }));

    updateClient(index, field, value);
  };

  const NumericField = ({ label, value, onChange }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">
        {label}
      </label>
      <FormattedNumberInputKDA value={value} onChange={onChange} />
    </div>
  );

  const FinancialGroup = ({ title, children }) => (
    <div className="border border-sofiblue/30 rounded-lg p-4 bg-white shadow-sm">
      <h6 className="text-sm font-bold text-sofiblue mb-3 border-b pb-1">
        {title}
      </h6>
      <div className="grid grid-cols-2 gap-6">{children}</div>
    </div>
  );

  return (
    <div className="space-y-8 bg-white rounded-xl shadow-lg p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-2xl font-bold text-sofiblue">
          Clients douteux
        </h3>

        <button
          type="button"
          className="btn btn-primary"
          onClick={addClient}
        >
          + Ajouter client
        </button>
      </div>

      {clients.map((c, index) => (
        <div
          key={index}
          className="border border-sofiblue rounded-xl p-6 bg-sofigrey/40 space-y-6 shadow-xl"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-sofiblue">
              Client #{index + 1}
            </h4>

            <button
              type="button"
              className="btn btn-danger text-sm"
              onClick={() => removeClient(index)}
            >
              Supprimer
            </button>
          </div>

          <h5 className="text-sm font-bold text-white bg-sofiblue p-1 rounded">
            Informations Client
          </h5>

          {/* BASIC INFO */}
          <div className="grid grid-cols-6 gap-5">
            <Input
              label="Bénéficiaire"
              value={c.beneficiaire || ""}
              onChange={(val) =>
                handleChange(index, "beneficiaire", val)
              }
              error={errors[`${index}-beneficiaire`]}
            />

            <Input
              label="NIF"
              value={c.nif || ""}
              onChange={(val) =>
                handleChange(index, "nif", val)
              }
              error={errors[`${index}-nif`]}
            />

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Catégorie
              </label>
              <select
                className="input border rounded p-2 w-3/4"
                value={c.categorie ?? "C1"}
                onChange={(e) =>
                  updateClient(index, "categorie", e.target.value)
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
                className="input border rounded p-2 w-3/4"
                value={formatDate(c.date_octroi_credit)}
                onChange={(e) =>
                  updateClient(
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
                className="input border rounded p-2 w-3/4"
                value={extractYear(c.annees_declassement_credits)}
                onChange={(e) => {
                  const year = e.target.value;
                  updateClient(
                    index,
                    "annees_declassement_credits",
                    year ? `${year}-01-01` : ""
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

          {/* FINANCIAL */}
          <div className="border-t pt-4">
            <h5 className="text-sm font-bold text-white bg-sofiblue p-1 rounded mb-4">
              Informations financières
            </h5>

            <div className="grid grid-cols-2 gap-6">

              <FinancialGroup title="Encours">
                <NumericField
                  label="Créances Bilan"
                  value={c.montant_creance_bilan || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_creance_bilan", val)
                  }
                />

                <NumericField
                  label="Engagements Hors Bilan"
                  value={c.montant_engagement_hors_bilan || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_engagement_hors_bilan", val)
                  }
                />
              </FinancialGroup>

              <FinancialGroup title="Garanties obtenues">
                <NumericField
                  label="Hypothèques"
                  value={c.montant_garanties_obtenues_hypotheques || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_garanties_obtenues_hypotheques", val)
                  }
                />

                <NumericField
                  label="Financières"
                  value={c.montant_garanties_obtenues_financieres || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_garanties_obtenues_financieres", val)
                  }
                />

                <NumericField
                  label="Autres"
                  value={c.montant_garanties_obtenues_autre || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_garanties_obtenues_autre", val)
                  }
                />
              </FinancialGroup>

              <FinancialGroup title="Garanties réalisées">
                <NumericField
                  label="Montant réalisé"
                  value={c.montant_garanties_realisees || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_garanties_realisees", val)
                  }
                />
              </FinancialGroup>

              <FinancialGroup title="Provisions">
                <NumericField
                  label="Montant provisions"
                  value={c.montant_provisions_constituees || ""}
                  onChange={(val) =>
                    updateClient(index, "montant_provisions_constituees", val)
                  }
                />
              </FinancialGroup>

            </div>
          </div>

          {/* OBS */}
          <Input
            label="Observations"
            value={c.observations || ""}
            onChange={(val) =>
              updateClient(index, "observations", val)
            }
          />
        </div>
      ))}
    </div>
  );
}

export default StepCPD;