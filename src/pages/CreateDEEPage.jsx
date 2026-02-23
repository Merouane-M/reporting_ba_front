import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepDate from "../components/deeform/StepDate";
import StepM100 from "../components/deeform/StepM100";
import StepC33 from "../components/deeform/StepC33";
import StepFondsPropres from "../components/deeform/StepFondsPropres";
import StepNavigation from "../components/deeform/StepNavigation";
import Layout from "../components/general/Layout";
import { addDocument } from "../services/document.service"; // ✅ correct import

function CreateDEEPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    CodeDeclaration: "DEE",
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
      await addDocument("DEE", formData); // ✅ use service layer
      navigate("/documents/dee");
    } catch (error) {
      console.error("Creation failed:", error);
    }
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
    <Layout>
      <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex flex-row justify-between">

        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration DEE
        </h1>

        <p className="text-base font-semibold text-sofiblue"> Unité en KDA milliers de dinars</p>
      </div>

        {renderStep()}

        <StepNavigation
          step={step}
          setStep={setStep}
          maxStep={3}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/documents/dee")}
          >
            Annuler
          </button>

          {step === 3 && (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Soumettre
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default CreateDEEPage;
