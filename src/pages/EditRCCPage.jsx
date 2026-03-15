import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StepDate from "../components/rccform/StepDate";
import StepNavigation from "../components/rccform/StepNavigation";
import StepRCC from "../components/rccform/StepRCC";

import { editDocument, getDocumentById } from "../services/document.service";

function EditRCCPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing RCC
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getDocumentById("rcc", id);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch RCC:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = { ...formData };

      if (payload.date_arrete) {
        payload.date_arrete = new Date(payload.date_arrete)
          .toISOString()
          .split("T")[0];
      }

      delete payload.created_at;
      delete payload.updated_at;

      await editDocument("rcc", id, payload);

      navigate("/documents/rcc");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofiblue"></div>
        <span className="ml-2 text-sofiblue font-bold">
          Chargement des données…
        </span>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Modifier la déclaration RCC
        </h1>
        <p className="text-base font-semibold text-sofiblue">
          Montants en KDA
        </p>
      </div>

      {renderStep()}

      <StepNavigation step={step} setStep={setStep} maxStep={2} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/rcc")}
        >
          Annuler
        </button>

        {step > 0 && (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Mise à jour…" : "Mettre à jour"}
          </button>
        )}
      </div>
    </div>
  );
}

export default EditRCCPage;