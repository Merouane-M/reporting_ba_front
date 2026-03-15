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
      categorie: "",
      categorie_avant_reechelonnement: "",
      date_octroi_credit: "",
      annees_declassement_credits: "",
      encours_creance_bilan: "0",
      encours_engagements_hors_bilan: "0",
      montant_reech_gouv: "0",
      montant_reech_autres: "0",
      provision_avant_gouv: "0",
      provision_avant_autres: "0",
      provision_apres_gouv: "0",
      provision_apres_autres: "0",
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
      if (!formData.date_arrete) {
        alert("Veuillez sélectionner une date d'arrêté.");
        return;
      }

      const payload = {
        ...formData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await addDocument("CBR", payload);

      navigate("/documents/cbr");
    } catch (error) {
      console.error("Creation failed:", error);
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