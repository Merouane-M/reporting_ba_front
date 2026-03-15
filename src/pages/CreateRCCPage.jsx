import { useState } from "react";
import { useNavigate } from "react-router-dom";


import StepDate from "../components/rccform/StepDate"
import StepNavigation from "../components/rccform/StepNavigation";
import StepRCC from "../components/rccform/StepRCC";
import { addDocument } from "../services/document.service";

function CreateRCCPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    CodeDeclaration: "RCC",
    Frequence: "Trimestrielle",
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
      await addDocument("RCC", formData);
      navigate("/documents/rcc");
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
        <StepRCC
          sector="PUB"
          formData={formData}
          updateField={updateField}
        />
      );

    case 2:
      return (
        <StepRCC
          sector="PRV"
          formData={formData}
          updateField={updateField}
        />
      );

    default:
      return null;
  }
};

  return (
    <>
      <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Nouvelle déclaration RCC
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
            onClick={() => navigate("/documents/rcc")}
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

export default CreateRCCPage;
