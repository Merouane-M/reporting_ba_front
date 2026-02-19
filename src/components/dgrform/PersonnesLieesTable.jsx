import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function PersonnesLieesTable({
  index,
  data,
  addPersonneLiee,
  updatePersonneLiee,
  deletePersonneLiee,
}) {
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
            <tr key={plIndex} className="border-b">
              <td className="p-3">
                <input
                  className="border p-2 w-full"
                  value={pl.pl_nom || ""}
                  onChange={(e) =>
                    updatePersonneLiee(
                      index,
                      plIndex,
                      "pl_nom",
                      e.target.value
                    )
                  }
                />
              </td>

              <td className="p-3">
                <input
                  className="border p-2 w-full"
                  value={pl.pl_nif || ""}
                  onChange={(e) =>
                    updatePersonneLiee(
                      index,
                      plIndex,
                      "pl_nif",
                      e.target.value
                    )
                  }
                />
              </td>

              <td className="p-3 text-right">
                <FormattedNumberInputKDA
                  value={pl.capital || "0"}
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

              <td className="p-3 text-center">
                <button
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
