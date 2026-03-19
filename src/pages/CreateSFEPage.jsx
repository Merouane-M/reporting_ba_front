import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepSFE from "../components/sfeform/StepSFE";
import StepDate from "../components/sfeform/StepDate";
import StepNavigation from "../components/sfeform/StepNavigation";
import { addDocument } from "../services/document.service";

function CreateSFEPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    CodeDeclaration: "SFE",
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
      entreprise_name: "",
      nif: "",
      group: "",
      Encours_Credits: 0,
      MontantCeancesClassees: 0,
      CategorieCreancesClassees: "C1",
      DateCreditsReechelonnes: "",
      MontantsCreditsReechelonnes: 0,
      InteretsReservesAnnules: 0,
      
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

    // 2️⃣ Ensure at least one beneficiaire
    if (formData.beneficiaires.length === 0) {
      alert("Ajoutez au moins un bénéficiaire.");
      return;
    }

    // 3️⃣ Validate each beneficiaire
    for (let i = 0; i < formData.beneficiaires.length; i++) {
      const b = formData.beneficiaires[i];

      if (!b.entreprise_name?.trim()) {
        alert(`Le nom de l'entreprise #${i + 1} est obligatoire.`);
        return;
      }

      if (!b.nif?.trim()) {
        alert(`Le NIF du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }

      if (!b.DateCreditsReechelonnes) {
        alert(`La date de rééchelonnement #${i + 1} est obligatoire.`);
        return;
      }
    }

    // 4️⃣ Prepare payload (same pattern as CBR)
    const payload = {
      ...formData,
      date_arrete: new Date(formData.date_arrete)
        .toISOString()
        .split("T")[0],
      created_at: new Date(),
      updated_at: new Date(),

      beneficiaires: formData.beneficiaires.map((b) => {
        const { created_at, updated_at, deleted_at, is_deleted, ...cleanB } = b;

        return {
          ...cleanB,
          DateCreditsReechelonnes: b.DateCreditsReechelonnes
            ? new Date(b.DateCreditsReechelonnes)
                .toISOString()
                .split("T")[0]
            : "",
        };
      }),
    };

    // 5️⃣ Submit
    await addDocument("SFE", payload);

    // 6️⃣ Navigate
    navigate("/documents/sfe");
  } catch (error) {
    console.error("Création échouée :", error);
    alert("Erreur lors de la création de la déclaration SFE.");
  }
};
  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} />;

      case 1:
        return (
            <StepSFE
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
          Nouvelle déclaration SFE
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
          onClick={() => navigate("/documents/sfe")}
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

export default CreateSFEPage;