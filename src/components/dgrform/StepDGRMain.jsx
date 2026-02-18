import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function StepDGRMain({ formData, updateField, addBeneficiaire, deleteBeneficiaire }) {  // Added deleteBeneficiaire prop
  const fpr25 = formData.fprDateArrete * 0.25;
  const fpr10 = formData.fprDateArrete * 0.1;
  const fpr8 = formData.fprDateArrete * 8;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Informations générales</h2>
      <div className="flex flex-row gap-1">
        <div className="flex flex-col w-1/4">
          <label className="text-base font-semibold mb-2">
            FPR à la date d'arreté précédente{" "}
          </label>
          <FormattedNumberInputKDA
            value={formData.fprDateArretePrecedente}
            onChange={(val) => updateField("fprDateArretePrecedente", val)}
          />
        </div>
        <div className="flex flex-col w-1/4">
          <label className="text-base font-semibold mb-2">
            FPR à la date d'arreté{" "}
          </label>
          <FormattedNumberInputKDA
            value={formData.fprDateArrete}
            onChange={(val) => updateField("fprDateArrete", val)}
          />
        </div>

        <div className="flex flex-col w-1/5">
          <label className="text-base font-semibold mb-2">
            Seuil des 25% des FPR
          </label>
          <div className="bg-sofiblue text-white rounded p-2 text-right font-bold text-lg">
            {fpr25.toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        <div className="flex flex-col w-1/5">
          <label className="text-base font-semibold mb-2">
            Seuil des 10% des FPR
          </label>
          <div className="bg-sofiblue text-white rounded p-2 text-right font-bold text-lg">
            {fpr10.toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        <div className="flex flex-col w-1/5">
          <label className="text-base font-semibold mb-2">
            Octuple des FPR
          </label>
          <div className="bg-sofiblue text-white rounded p-2 text-right font-bold text-lg">
            {fpr8.toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      </div>

      <div className="m-2 flex justify-between">
      <h3 className="mt-6 font-semibold">Table des bénéficiaires</h3>
        <button className="btn btn-secondary mt-4" onClick={addBeneficiaire}>
          + Ajouter bénéficiaire
        </button>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-lg text-left">Nom des bénéficiaires</th>
            <th className="p-3 text-lg text-center">Risques pondérés</th>
            <th className="p-3 text-lg text-center">Risques pondérés/FPR %</th>
            <th className="p-3 text-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {formData.beneficiaires.map((b, i) => (
            <tr className="border-b" key={i}>
              <td className="p-3 w-2/5 text-left text-lg">{b.nomBeneficiaire}</td>
              <td className="p-3 w-1/5 text-center text-lg">{b.montantRisquesPonderes}</td>
              <td className="p-3 w-2/5 text-center text-lg">
                {Number.isFinite(b.montantRisquesPonderes / formData.fprDateArrete)
                  ? (b.montantRisquesPonderes / formData.fprDateArrete).toFixed(2)
                  : "0"} %
              </td>
              <td className="p-3 text-center">
                <button
                  className="btn btn-danger text-sm"
                  onClick={() => deleteBeneficiaire(i)}
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

export default StepDGRMain;