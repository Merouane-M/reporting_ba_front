import React from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";

function StepFondsPropres({ formData, updateField }) {
  const getValue = (field) => Number(formData[field] || 0);

  const accroissement = getValue("ACCROISSEMENT_FONDS_PROPRES_DATE_ARRETE");
  const precedente = getValue("FONDS_PROPRES_DATE_ARRETE_PRECEDENTE");
  const diminution = getValue("DIMINUTION_FONDS_PROPRES_DATE_ARRETE");

  const fondsPropresReglementaires =
    accroissement + precedente - diminution;

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-bold mb-6 text-sofiblue">
        Fonds Propres
      </h3>

      <div className="flex flex-wrap gap-3">
        


        {/* PRECEDENTE */}
        <div className="flex flex-col w-1/4">
          <label className="text-base font-semibold mb-2">
            Fonds propres à la date d'arrêté <br/> précédente
          </label>
          <FormattedNumberInputKDA
            value={formData.FONDS_PROPRES_DATE_ARRETE_PRECEDENTE}
            onChange={(val) =>
              updateField(
                "FONDS_PROPRES_DATE_ARRETE_PRECEDENTE",
                val
              )
            }
          />
        </div>
        

                {/* ACCROISSEMENT */}
        <div className="flex flex-col w-1/4">
          <label className="text-base font-semibold mb-2">
            Accroissement des fonds propres à la date d'arrêté
          </label>
          <FormattedNumberInputKDA
            value={formData.ACCROISSEMENT_FONDS_PROPRES_DATE_ARRETE}
            onChange={(val) =>
              updateField(
                "ACCROISSEMENT_FONDS_PROPRES_DATE_ARRETE",
                val
              )
            }
          />
        </div>

        {/* DIMINUTION */}
        <div className="flex flex-col w-1/4">
          <label className="text-base font-semibold mb-2">
            Diminution des fonds propres à la date d'arrêté
          </label>
          <FormattedNumberInputKDA
            value={formData.DIMINUTION_FONDS_PROPRES_DATE_ARRETE}
            onChange={(val) =>
              updateField(
                "DIMINUTION_FONDS_PROPRES_DATE_ARRETE",
                val
              )
            }
          />
        </div>

        {/* CALCULATED FIELD */}
        <div className="flex flex-col w-1/5">
          <label className="text-base font-semibold mb-2">
            Fonds propres réglementaires à la date d'arrêté
          </label>
          <div className="bg-sofiblue text-white rounded p-2 text-right font-bold text-lg">
            {fondsPropresReglementaires.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StepFondsPropres;
