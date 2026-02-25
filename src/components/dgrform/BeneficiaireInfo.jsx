import { useState } from "react";
import Input from "../general/Input";

// first part of MOD G 2000

function BeneficiaireInfo({ index, data, updateBeneficiaire }) {
  const [errors, setErrors] = useState({});

  const validateNom = (value) => {
    if (/\d/.test(value)) {
      return "Le nom ne doit pas contenir de chiffres.";
    }
    return "";
  };

  const validateNif = (value) => {
    if (!/^\d{15,20}$/.test(value)) {
      return "Le NIF/NIN doit contenir entre 15 et 20 chiffres.";
    }
    return "";
  };

  const handleChange = (field, value) => {
    let error = "";

    if (field === "nomBeneficiaire") {
      error = validateNom(value);
    }

    if (field === "nif_nin") {
      error = validateNif(value);
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    updateBeneficiaire(index, field, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-sofiblue">
        Bénéficiaire {index + 1}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* ================= NOM ================= */}
        <Input
          id={`nomBeneficiaire-${index}`}
          label="Nom bénéficiaire"
          value={data.nomBeneficiaire || ""}
          onChange={(val) =>
            handleChange("nomBeneficiaire", val)
          }
          error={errors.nomBeneficiaire}
        />

        {/* ================= ADRESSE ================= */}
        <Input
          id={`adresseBeneficiaire-${index}`}
          label="Adresse"
          value={data.adresseBeneficiaire || ""}
          onChange={(val) =>
            updateBeneficiaire(index, "adresseBeneficiaire", val)
          }
        />

        {/* ================= TYPE ================= */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Type opérateur
          </label>
          <select
            className="border p-2 w-full"
            value={data.typeOperateur || ""}
            onChange={(e) =>
              updateBeneficiaire(index, "typeOperateur", e.target.value)
            }
          >
            <option value="">Type opérateur</option>
            <option value="personne morale">Personne morale</option>
            <option value="personne physique">Personne physique</option>
          </select>
        </div>

        {/* ================= NIF ================= */}
        <Input
          id={`nif_nin-${index}`}
          label="NIF / NIN"
          value={data.nif_nin || ""}
          onChange={(val) =>
            handleChange("nif_nin", val)
          }
          error={errors.nif_nin}
        />

        {/* ================= NOTATION INTERNE ================= */}
        <Input
          id={`notationInterne-${index}`}
          label="Notation interne"
          value={data.notationInterne || ""}
          onChange={(val) =>
            updateBeneficiaire(index, "notationInterne", val)
          }
        />

        {/* ================= NOTATION EXTERNE ================= */}
        <Input
          id={`notationExterne-${index}`}
          label="Notation externe"
          value={data.notationExterne || ""}
          onChange={(val) =>
            updateBeneficiaire(index, "notationExterne", val)
          }
        />
      </div>
    </div>
  );
}

/* =========================
   Reusable Input Component
========================= */



export default BeneficiaireInfo;
