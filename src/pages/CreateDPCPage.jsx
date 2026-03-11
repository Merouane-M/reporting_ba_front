import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepDate from "../components/dpcform/StepDate";
import StepFondsPropres from "../components/dpcform/StepPositionChange";
import StepNavigationDPC from "../components/dpcform/StepNavigationDPC";
import { addDocument } from "../services/document.service";

function CreateDPCPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CodeDeclaration: "DPC",
    Frequence: "Monthly",

    status: "IN_PROCESS",
    is_deleted: false,
  });

  const updateField = (key, value) => {
    let newValue = value;

    // Ensure numeric fields are numbers
    if (key.startsWith("fpn_")) {
      newValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} />;
      case 1:
        return (
          <StepFondsPropres formData={formData} updateField={updateField} />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.date_arrete) {
        alert("Veuillez sélectionner une date d'arrêté.");
        return;
      }

      await addDocument("DPC", formData);

      navigate("/documents/dpc");
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  return (
    <>
      <div className="w-4/5 mx-auto mt-10 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Nouvelle déclaration DPC
          </h1>

          <p className="text-base font-semibold text-sofiblue">
            {" "}
            Unité en dinars
          </p>
        </div>

        {renderStep()}

        <StepNavigationDPC step={step} setStep={setStep} />

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Soumettre
          </button>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/dpc")}
        >
          Annuler
        </button>
      </div>
    </>
  );
}

export default CreateDPCPage;
