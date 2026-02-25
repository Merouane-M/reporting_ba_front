import { useState } from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import Input from "../general/Input";

//third part of MOD G 2000

function PersonnesLieesTable({
  index,
  data,
  addPersonneLiee,
  updatePersonneLiee,
  deletePersonneLiee,
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

  const handleChange = (plIndex, field, value) => {
    let error = "";

    if (field === "pl_nom") {
      error = validateNom(value);
    }

    if (field === "pl_nif") {
      error = validateNif(value);
    }

    setErrors((prev) => ({
      ...prev,
      [`${plIndex}-${field}`]: error,
    }));

    updatePersonneLiee(index, plIndex, field, value);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-xl font-bold text-sofiblue">
          Personnes liées
        </h3>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addPersonneLiee(index)}
        >
          + Ajouter personne liée
        </button>
      </div>

      <table className="w-full text-base border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">NIF</th>
            <th className="p-3 text-right">Capital</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.personnes_liees?.map((pl, plIndex) => (
            <tr key={plIndex} className="border-b align-top">
              {/* ================= NOM ================= */}
              <td className="p-3">
                <Input
                  id={`pl_nom-${index}-${plIndex}`}
                  value={pl.pl_nom || ""}
                  onChange={(val) =>
                    handleChange(plIndex, "pl_nom", val)
                  }
                  error={errors[`${plIndex}-pl_nom`]}
                />
              </td>

              {/* ================= NIF ================= */}
              <td className="p-3">
                <Input
                  id={`pl_nif-${index}-${plIndex}`}
                  value={pl.pl_nif || ""}
                  onChange={(val) =>
                    handleChange(plIndex, "pl_nif", val)
                  }
                  error={errors[`${plIndex}-pl_nif`]}
                />
              </td>

              {/* ================= CAPITAL ================= */}
              <td className="p-3 text-right">
                <FormattedNumberInputKDA
                  value={pl.capital || ""}
                  onChange={(val) =>
                    updatePersonneLiee(
                      index,
                      plIndex,
                      "capital",
                      val
                    )
                  }
                />
              </td>

              {/* ================= ACTIONS ================= */}
              <td className="p-3 text-center">
                <button
                  type="button"
                  className="btn btn-danger text-sm"
                  onClick={() =>
                    deletePersonneLiee(index, plIndex)
                  }
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

export default PersonnesLieesTable;