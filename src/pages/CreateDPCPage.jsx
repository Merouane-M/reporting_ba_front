import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/general/Layout";
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
    date_arrete: null,
    deleted_at: null,
    etablissement_declarant: "025",

    // Numeric fields
    fpn_A: 0,
    fpn_B: 0,
    fpn_C: 0,
    fpn_D: 0,
    fpn_E: 0,
    fpn_F: 0,
    fpn_G: 0,
    fpn_H: 0,
    fpn_I: 0,
    fpn_J: 0,
    fpn_K: 0,
    fpn_L: 0,
    fpn_M: 0,

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
        return <StepFondsPropres formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {

      await addDocument("DPC", formData);

      navigate("/documents/dpc");
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  return (
    <Layout>
      <div className="w-4/5 mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <div className="flex flex-row justify-between">

        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration DPC
        </h1>

        <p className="text-base font-semibold text-sofiblue"> Unité en dinars</p>
      </div>

        {renderStep()}

        <StepNavigationDPC step={step} setStep={setStep} />

        <div className="flex justify-end mt-6 gap-3">
          {step === 1 && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Soumettre
            </button>
          )}
        </div>
              <button
        className="btn btn-secondary"
        onClick={() => navigate("/documents/dpc")}
      >
        Annuler
      </button>
      </div>
    </Layout>
  );
}

export default CreateDPCPage;
