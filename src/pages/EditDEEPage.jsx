import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { editDocument, getDocumentById } from "../services/document.service";
import { useDocument } from "../context/DocumentContext"; // Add this import
import { documentTypes } from "../constants/documents";
import StepDate from "../components/deeform/StepDate";
import StepM100 from "../components/deeform/StepM100";
import StepC33 from "../components/deeform/StepC33";
import StepFondsPropres from "../components/deeform/StepFondsPropres";
import StepNavigation from "../components/deeform/StepNavigation";

function EditDEEPage() {
  const { id } = useParams(); // Only get id from params
  const navigate = useNavigate();
  const { document } = useDocument(); // Get type from context
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const upperType = document; // Context already has uppercase (e.g., "DEE")
  const lowerType = document?.toLowerCase(); // For backend API
  const docType = documentTypes.find((d) => d.abbr === upperType);

  // Fetch document data for editing
  useEffect(() => {
    const fetchDocument = async () => {
      if (!lowerType || !id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getDocumentById(lowerType, id);
        if (data && typeof data === "object") {
          setFormData(data);
        } else {
          setError("Données invalides reçues du serveur.");
        }
      } catch (err) {
        console.error("Failed to fetch document:", err);
        setError(
          "Erreur lors du chargement des données. Vérifiez la console pour plus de détails.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [lowerType, id]);

  if (!docType) {
    return (
      < >
        <p className="p-6 text-center text-red-600 font-semibold">
          Document type introuvable
        </p>
      </ >
    );
  }

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Clone formData to avoid mutating state
      const payload = { ...formData };

      // Set updated_at to the current datetime (full timestamp for the DB)
      payload.updated_at = new Date();

      // Convert other date fields to Date objects for SQLAlchemy/SQL Server compatibility
      const dateFields = ["date_arrete", "created_at"]; // Exclude updated_at since we set it above
      dateFields.forEach((field) => {
        if (payload[field]) {
          // If it's a string, parse to Date; if already a Date, use as-is
          const dateValue =
            typeof payload[field] === "string"
              ? new Date(payload[field])
              : payload[field];
          if (dateValue instanceof Date && !isNaN(dateValue)) {
            payload[field] = dateValue;
          } else {
            console.warn(`Invalid date for ${field}:`, payload[field]);
          }
        }
      });

      // Send to backend
      await editDocument(lowerType, id, payload);

      navigate(`/documents/${upperType}`);
    } catch (err) {
      console.error("Failed to update document:", err);
      setError(
        "Erreur lors de la mise à jour. Vérifiez la console pour plus de détails.",
      );
    } finally {
      setSubmitting(false);
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
        return (
          <StepFondsPropres formData={formData} updateField={updateField} />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      < >
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofiblue"></div>
          <span className="ml-2 text-sofiblue font-bold">
            Chargement des données…
          </span>
        </div>
      </ >
    );
  }

  if (error) {
    return (
      < >
        <div className="p-6 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => navigate(`/documents/${upperType}`)}
          >
            Retour à la liste
          </button>
        </div>
      </ >
    );
  }

  return (
    < >
      <div className="p-6">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-sofiblue mb-6">
            Modifier la Declaration DEE
          </h1>
          <p className="text-base font-semibold text-sofiblue">
            
            Unité en KDA milliers de dinars
          </p>
        </div>

        {renderStep()}

        <StepNavigation step={step} setStep={setStep} maxStep={3} />

        <div className="flex justify-end mt-6 gap-3">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/documents/${upperType}`)}
          >
            Annuler
          </button>

          {step === 3 && (
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
    </ >
  );
}

export default EditDEEPage;
