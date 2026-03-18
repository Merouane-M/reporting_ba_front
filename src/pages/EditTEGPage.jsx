import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StepDate from "../components/general/StepDate";
import StepNavigation from "../components/general/StepNavigation";
import MoyTeg from "../components/tegform/MoyTeg";
import Loading from "../components/general/Loading";

import { editDocument, getDocumentById } from "../services/document.service";

function EditTEGPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing TEG
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getDocumentById("teg", id);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch TEG:", err);
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

    await editDocument("teg", id, payload);

    navigate("/documents/teg");
  } catch (error) {
    console.error("Update failed:", error);
  } finally {
    setSubmitting(false);
  }
};

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} frequency="Semestrielle" />;
      case 1:
        return <MoyTeg formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">

        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Modifier la déclaration TEG
          </h1>

          <p className="text-base font-semibold text-sofiblue">
            Unité en %
          </p>
        </div>

        {renderStep()}

        <StepNavigation step={step} setStep={setStep} steps={["Date", "TEG Moyen"]} />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/documents/teg")}
          >
            Annuler
          </button>

          {step === 1 && (
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
    </>
  );
}

export default EditTEGPage;