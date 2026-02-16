import FormattedNumberInput from "../general/FormattedNumberInput";

function StepDGRMain({ formData, updateField, addBeneficiaire }) {
  const fpr25 = formData.fprDateArrete * 0.25;
  const fpr10 = formData.fprDateArrete * 0.1;
  const fpr8 = formData.fprDateArrete * 8;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Informations générales</h2>
      <div className="flex flex-row gap-1">
           <div className="flex flex-col w-1/4">
        <label className="text-base font-semibold mb-2">
          FPR à la date d'arreté précédente
        </label>
        <FormattedNumberInput
          value={formData.fprDateArretePrecedente}
          onChange={(val) => updateField("fprDateArretePrecedente", val)}
          />
          </div>
        <div className="flex flex-col w-1/4">
          <label className="text-base font-semibold mb-2">
            FPR à la date d'arreté{" "}
          </label>
          <FormattedNumberInput
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
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="flex flex-col w-1/5">
          <label className="text-base font-semibold mb-2">
            Seuil des 10% des FPR
          </label>
          <div className="bg-sofiblue text-white rounded p-2 text-right font-bold text-lg">
            {fpr10.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="flex flex-col w-1/5">
          <label className="text-base font-semibold mb-2">
            Octuple des FPR
          </label>
          <div className="bg-sofiblue text-white rounded p-2 text-right font-bold text-lg">
            {fpr8.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      <h3 className="mt-6 font-semibold">Table des bénéficiaires</h3>

      <table className="w-full text-sm border-collapse">
        <thead className="bg-sofiblue text-white">
          <tr>
            <th className="p-3 text-lg text-left">Nom</th>
            <th className="p-3 text-lg text-left">Risques pondérés</th>
          </tr>
        </thead>
        <tbody>
          {formData.beneficiaires.map((b, i) => (
            <tr key={i}>
              <td>{b.nomBeneficiaire}</td>
              <td>{b.montantRisquesPonderes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-secondary mt-4" onClick={addBeneficiaire}>
        Ajouter bénéficiaire
      </button>
    </div>
  );
}

export default StepDGRMain;
