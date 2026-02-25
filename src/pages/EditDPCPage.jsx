import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/general/Layout";
import StepDate from "../components/dpcform/StepDate";
import StepFondsPropres from "../components/dpcform/StepPositionChange";
import StepNavigationDPC from "../components/dpcform/StepNavigationDPC";
import { getDocumentById, editDocument } from "../services/document.service";

function EditDPCPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Fetch existing DPC data
    const fetchDPC = async () => {
      try {
        const data = await getDocumentById("DPC", id);
        setFormData({
          ...data,
          // Ensure numeric fields are numbers
          fpn_A: Number(data.fpn_A) || 0,
          fpn_B: Number(data.fpn_B) || 0,
          fpn_C: Number(data.fpn_C) || 0,
          fpn_D: Number(data.fpn_D) || 0,
          fpn_E: Number(data.fpn_E) || 0,
          fpn_F: Number(data.fpn_F) || 0,
          fpn_G: Number(data.fpn_G) || 0,
          fpn_H: Number(data.fpn_H) || 0,
          fpn_I: Number(data.fpn_I) || 0,
          fpn_J: Number(data.fpn_J) || 0,
          fpn_K: Number(data.fpn_K) || 0,
          fpn_L: Number(data.fpn_L) || 0,
          fpn_M: Number(data.fpn_M) || 0,
        });
      } catch (error) {
        console.error("Failed to fetch DPC:", error);
      }
    };

    fetchDPC();
  }, [id]);

  const updateField = (key, value) => {
    let newValue = value;

    if (key.startsWith("fpn_")) {
      newValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const renderStep = () => {
    if (!formData) return <div>Chargement...</div>;

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
      if (!formData) return;

      // Convert dates to Date objects for SQLAlchemy/SQL Server compatibility
      const payload = {
        ...formData,
        date_arrete: new Date(formData.date_arrete), // Parse string to Date
        created_at: new Date(formData.created_at), // Parse existing string to Date
        updated_at: new Date(), // Set to current datetime as Date object
      };

      await editDocument("DPC", id, payload);
      navigate("/documents/dpc");
    } catch (error) {
      // Show backend error
      const message = error.response?.data?.error || "Failed to update DPC";
      alert(`Error: ${message}`);
      console.error("Update failed:", error);
    }
  };

  if (!formData) return <Layout>Loading DPC...</Layout>;

  return (
    <Layout>
      <div className="w-4/5 mx-auto mt-10 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Modifier la Declaration DPC 
          </h1>
          <p className="text-base font-semibold text-sofiblue">
            
            Unité en dinars
          </p>
        </div>

        {renderStep()}

        <StepNavigationDPC step={step} setStep={setStep} />

<div className="flex justify-end mt-6 gap-3">
  {step === 1 && (
    <>


      <button className="btn btn-primary" onClick={handleSubmit}>
        Mettre à jour
      </button>
    </>
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

export default EditDPCPage;