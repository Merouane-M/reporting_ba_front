import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StepDate from "../components/cbrform/StepDate";
import StepNavigation from "../components/cbrform/StepNavigation";
import StepCBR from "../components/cbrform/StepCBR";

import { editDocument, getDocumentById } from "../services/document.service";

function EditCBRPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    beneficiaires: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getDocumentById("cbr", id);

        setFormData({
          ...data,
          beneficiaires: data.beneficiaires || [],
        });
      } catch (err) {
        console.error("Failed to fetch CBR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Update root field
  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Add beneficiary
  const addBeneficiaire = () => {
    const newBeneficiaire = {
      beneficiaire: "",
      nif: "",
      categorie: "",
      categorie_avant_reechelonnement: "",
      date_octroi_credit: "",
      annees_declassement_credits: "",
      encours_creance_bilan: "",
      encours_engagements_hors_bilan: "",
      montant_reech_gouv: "",
      montant_reech_autres: "",
      provision_avant_gouv: "",
      provision_avant_autres: "",
      provision_apres_gouv: "",
      provision_apres_autres: "",
      observations: "",
    };

    setFormData((prev) => ({
      ...prev,
      beneficiaires: [...prev.beneficiaires, newBeneficiaire],
    }));
  };

  // Update beneficiary
  const updateBeneficiaire = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.beneficiaires];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        beneficiaires: updated,
      };
    });
  };

  // Delete beneficiary
  const removeBeneficiaire = (index) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaires: prev.beneficiaires.filter((_, i) => i !== index),
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

      await editDocument("cbr", id, payload);

      navigate("/documents/cbr");
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
          <StepCBR
            beneficiaires={formData.beneficiaires}
            addBeneficiaire={addBeneficiaire}
            updateBeneficiaire={updateBeneficiaire}
            removeBeneficiaire={removeBeneficiaire}
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
          Modifier la déclaration CBR
        </h1>

        <p className="text-base font-semibold text-sofiblue">
          Unité en KDA milliers de dinars
        </p>
      </div>

      {renderStep()}

      <StepNavigation step={step} setStep={setStep} maxStep={2} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/cbr")}
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
  );
}

export default EditCBRPage;