import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepDate from "../components/tegform/StepDate";
import StepNavigation from "../components/tegform/StepNavigation";
import MoyTeg from "../components/tegform/MoyTeg";
import { addDocument } from "../services/document.service";

function CreateTEGPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    CodeDeclaration: "TEG",
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
      formData.created_at = new Date()
      formData.updated_at = new Date()


      await addDocument("TEG", formData);
      navigate("/documents/teg");
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} />;
      case 1:
        return <MoyTeg formData={formData} updateField={updateField} />;

      default:
        return null;
    }
  };

  return (
    < >
      <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between">

          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Nouvelle déclaration TEG
          </h1>

          <p className="text-base font-semibold text-sofiblue"> Unité en KDA milliers de dinars</p>
        </div>

        {renderStep()}

        <StepNavigation
          step={step}
          setStep={setStep}
          maxStep={1}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/documents/teg")}
          >
            Annuler
          </button>


          <button
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Soumettre
          </button>

        </div>
      </div>
    </ >
  );
}

export default CreateTEGPage;
