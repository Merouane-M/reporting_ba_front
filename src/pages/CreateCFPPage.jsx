import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepDate from "../components/cfpform/StepDate";
import StepNavigation from "../components/cfpform/StepNavigation";
import Step4001 from "../components/cfpform/Step4001";
import Step4002 from "../components/cfpform/Step4002";
import { addDocument } from "../services/document.service";

function CreateCFPPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    CodeDeclaration: "CFP",
    Frequence: "MONTHLY",
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.date_arrete) {
        alert("Veuillez sélectionner une date d'arrêté.");
        return;
      }
      formData.created_at = new Date();
      formData.updated_at = new Date();

      await addDocument("CFP", formData);
      navigate("/documents/cfp");
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} />;
      case 1:
        return <Step4001 formData={formData} updateField={updateField} />;
      case 2:
        return <Step4002 formData={formData} updateField={updateField} />;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Nouvelle déclaration CFP
          </h1>

          <p className="text-base font-semibold text-sofiblue">
            {" "}
            Unité en KDA milliers de dinars
          </p>
        </div>

        {renderStep()}

        <StepNavigation step={step} setStep={setStep} maxStep={3} />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/documents/cfp")}
          >
            Annuler
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Soumettre
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateCFPPage;
