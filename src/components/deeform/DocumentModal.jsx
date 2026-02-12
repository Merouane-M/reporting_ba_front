import { useState } from "react";
import StepDate from "./StepDate";
import StepM100 from "./StepM100";
import StepC33 from "./StepC33";
import StepFondsPropres from "./StepFondsPropres";
import StepNavigation from "./StepNavigation";

function DocumentModal({ isOpen, onClose, documentType }) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    CodeDeclaration: documentType,
    Frequence: "MONTHLY",
  });

  if (!isOpen) return null;

  const updateField = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} />;
      case 1:
        return <StepM100 formData={formData} updateField={updateField} />;
      case 2:
        return <StepC33 formData={formData} updateField={updateField} />;
      case 3:
        return <StepFondsPropres formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-4/5 max-h-[90vh] overflow-y-auto rounded-lg p-8 shadow-xl relative">

        <h2 className="text-2xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration {documentType}
        </h2>

        {renderStep()}

        <StepNavigation
          step={step}
          setStep={setStep}
          maxStep={3}
        />

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>

          {step === 3 && (
            <button
              className="btn btn-primary"
              onClick={() => console.log(formData)}
            >
              Soumettre
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default DocumentModal;
