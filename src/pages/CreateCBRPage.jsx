import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepDate from "../components/cbrform/StepDate";
import StepNavigation from "../components/cbrform/StepNavigation";
import StepCBR from "../components/cbrform/StepCBR";
import { addDocument } from "../services/document.service";

function CreateCBRPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    CodeDeclaration: "CBR",
    beneficiaires: [],
    status: "IN_PROCESS",
    is_deleted: false,
    deleted_at: null,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addBeneficiaire = () => {
    const newBeneficiaire = {
      beneficiaire: "",
      nif: "",
      categorie: "C1",
      categorie_avant_reechelonnement: "C1",
      date_octroi_credit: "",
      annees_declassement_credits: "",
      encours_creance_bilan: 0,
      encours_engagements_hors_bilan: 0,
      montant_reech_gouv: 0,
      montant_reech_autres: 0,
      provision_avant_gouv: 0,
      provision_avant_autres: 0,
      provision_apres_gouv: 0,
      provision_apres_autres: 0,
      observations: "",
    };

    setFormData((prev) => ({
      ...prev,
      beneficiaires: [...prev.beneficiaires, newBeneficiaire],
    }));
  };

  const removeBeneficiaire = (index) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaires: prev.beneficiaires.filter((_, i) => i !== index),
    }));
  };

  const updateBeneficiaire = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.beneficiaires];
      updated[index][key] = value;

      return {
        ...prev,
        beneficiaires: updated,
      };
    });
  };

const handleSubmit = async () => {
  try {
    // 1️⃣ Validate date_arrete
    if (!formData.date_arrete) {
      alert("Veuillez sélectionner une date d'arrêté.");
      return;
    }

    // 2️⃣ Validate each beneficiaire and NIF
    for (let i = 0; i < formData.beneficiaires.length; i++) {
      const b = formData.beneficiaires[i];
      if (!b.beneficiaire?.trim()) {
        alert(`Le nom du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
      if (!b.nif?.trim()) {
        alert(`Le NIF du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
            if (!b.date_octroi_credit?.trim()) {
        alert(`La date d'octroi du crédit du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
            if (!b.annees_declassement_credits?.trim()) {
        alert(`L'année de déclassement du crédit du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
    }

    // 3️⃣ Prepare payload
    const payload = {
      ...formData,
      date_arrete: new Date(formData.date_arrete).toISOString().split("T")[0],
      created_at: new Date(),
      updated_at: new Date(),
      beneficiaires: formData.beneficiaires.map((b) => {
        const { created_at, updated_at, deleted_at, is_deleted, ...cleanB } = b;
        return {
          ...cleanB,
          date_octroi_credit: b.date_octroi_credit
            ? new Date(b.date_octroi_credit).toISOString().split("T")[0]
            : "",
          annees_declassement_credits: b.annees_declassement_credits
            ? new Date(b.annees_declassement_credits).toISOString().split("T")[0]
            : "",
        };
      }),
    };

    // 4️⃣ Submit
    await addDocument("CBR", payload);

    // 5️⃣ Navigate back

    navigate("/documents/cbr");
  } catch (error) {
    console.error("Création échouée :", error);
    alert("Erreur lors de la création de la déclaration CBR.");
  }
};
  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} />;

      case 1:
        return (
          <StepCBR
            beneficiaires={formData.beneficiaires}
            addBeneficiaire={addBeneficiaire}
            removeBeneficiaire={removeBeneficiaire}
            updateBeneficiaire={updateBeneficiaire}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration CBR
        </h1>

        <p className="text-base font-semibold text-sofiblue">
          Unité en KDA milliers de dinars
        </p>
      </div>

      {renderStep()}

      <StepNavigation step={step} setStep={setStep} maxStep={2} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/cbr")}
        >
          Annuler
        </button>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Soumettre
        </button>
      </div>
    </div>
  );
}

export default CreateCBRPage;