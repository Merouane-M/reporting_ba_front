import FormattedNumberInput from "../general/FormattedNumberInput";

function StepBeneficiaire({
  index,
  data,
  updateBeneficiaire,
  addPersonneLiee,
  updatePersonneLiee,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Bénéficiaire {index + 1}
      </h2>

      <input
        placeholder="Nom"
        value={data.nomBeneficiaire}
        onChange={(e) =>
          updateBeneficiaire(index, "nomBeneficiaire", e.target.value)
        }
        className="border p-2 mb-3"
      />

      <FormattedNumberInput
        value={data.montantRisquesPonderes}
        onChange={(val) =>
          updateBeneficiaire(index, "montantRisquesPonderes", val)
        }
      />

      <h3 className="mt-4 font-semibold">Personnes liées</h3>

      {data.personnes_liees.map((pl, plIndex) => (
        <div key={plIndex} className="border p-3 mt-2">
          <input
            placeholder="Nom"
            value={pl.pl_nom}
            onChange={(e) =>
              updatePersonneLiee(
                index,
                plIndex,
                "pl_nom",
                e.target.value
              )
            }
            className="border p-2 mb-2"
          />

          <input
            placeholder="NIF"
            value={pl.pl_nif}
            onChange={(e) =>
              updatePersonneLiee(
                index,
                plIndex,
                "pl_nif",
                e.target.value
              )
            }
            className="border p-2 mb-2"
          />

          <FormattedNumberInput
            value={pl.capital}
            onChange={(val) =>
              updatePersonneLiee(
                index,
                plIndex,
                "capital",
                val
              )
            }
          />
        </div>
      ))}

      <button
        className="btn btn-secondary mt-3"
        onClick={() => addPersonneLiee(index)}
      >
        Ajouter personne liée
      </button>
    </div>
  );
}

export default StepBeneficiaire;
