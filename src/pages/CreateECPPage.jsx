import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepDate from "../components/general/StepDate";
import StepNavigation from "../components/general/StepNavigation";
import StepECP from "../components/ecpform/StepECP";
import { addDocument } from "../services/document.service";

function CreateECPPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    CodeDeclaration: "ECP",
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
      raison_sociale: "",
      nif: "",
      nature_credit: "",
      date_autorisation: "",
      date_echeance: "",
      montant_autorise: 0,
      montant_utilise: 0,
      destination_credit: "",
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
    if (!formData.fonds_propres){
        alert("Veuillez remplir le fonds propres de base");
        return;
    }

    // 2️⃣ Validate each beneficiaire and NIF
    for (let i = 0; i < formData.beneficiaires.length; i++) {
      const b = formData.beneficiaires[i];
      if (!b.raison_sociale?.trim()) {
        alert(`La raison sociale du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
      if (!b.nif?.trim()) {
        alert(`Le NIF du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
            if (!b.date_autorisation?.trim()) {
        alert(`La date d'autorisation du bénéficiaire #${i + 1} est obligatoire.`);
        return;
      }
            if (!b.date_echeance?.trim()) {
        alert(`La date d'écheance du crédit du bénéficiaire #${i + 1} est obligatoire.`);
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
        };
      }),
    };

    // 4️⃣ Submit
    await addDocument("ECP", payload);

    // 5️⃣ Navigate back

    navigate("/documents/ecp");
  } catch (error) {
    console.error("Création échouée :", error);
    alert("Erreur lors de la création de la déclaration ECP.");
  }
};
  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} frequency="Bimensuelle" />;

      case 1:
        return (
          <StepECP
            formData={formData}
            updateField={updateField}
          //  beneficiaires={formData.beneficiaires}
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
          Nouvelle déclaration ECP
        </h1>

        <p className="text-base font-semibold text-sofiblue">
          Unité en KDA milliers de dinars
        </p>
      </div>

      {renderStep()}

        <StepNavigation step={step} setStep={setStep} steps={["Date", "ECP"]} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/ecp")}
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

export default CreateECPPage;