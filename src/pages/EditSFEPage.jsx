import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StepDate from "../components/sfeform/StepDate";
import StepNavigation from "../components/sfeform/StepNavigation";
import StepSFE from "../components/sfeform/StepSFE";

import { editDocument, getDocumentById } from "../services/document.service";

function EditSFEPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ beneficiaires: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d) ? "" : d.toISOString().slice(0, 10);
  };

  // Fetch SFE document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getDocumentById("sfe", id);

        setFormData({
          ...data,
          date_arrete: formatDate(data.date_arrete),
          beneficiaires: (data.beneficiaires || []).map((b) => ({
            ...b,
            DateCreditsReechelonnes: formatDate(
              b.DateCreditsReechelonnes
            ),
          })),
        });
      } catch (err) {
        console.error("Failed to fetch SFE:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addBeneficiaire = () => {
    const newBeneficiaire = {
      entreprise_name: "",
      nif: "",
      group: "",
      Encours_Credits: 0,
      MontantCeancesClassees: 0,
      CategorieCreancesClassees: "C1",
      DateCreditsReechelonnes: "",
      MontantsCreditsReechelonnes: 0,
      InteretsReservesAnnules: 0,
    };

    setFormData((prev) => ({
      ...prev,
      beneficiaires: [...prev.beneficiaires, newBeneficiaire],
    }));
  };

  // ✅ IMMUTABLE UPDATE (important)
  const updateBeneficiaire = (index, field, value) => {
    setFormData((prev) => {
      const updated = prev.beneficiaires.map((b, i) =>
        i === index ? { ...b, [field]: value } : b
      );
      return { ...prev, beneficiaires: updated };
    });
  };

  const removeBeneficiaire = (index) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaires: prev.beneficiaires.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 1️⃣ Validate date_arrete
      if (!formData.date_arrete?.trim()) {
        alert("Veuillez sélectionner une date d'arrêté.");
        setSubmitting(false);
        return;
      }

      // 2️⃣ Validate beneficiaires
      for (let i = 0; i < formData.beneficiaires.length; i++) {
        const b = formData.beneficiaires[i];

        if (!b.entreprise_name?.trim()) {
          alert(`Le nom de l'entreprise #${i + 1} est obligatoire.`);
          setSubmitting(false);
          return;
        }

        if (!b.nif?.trim()) {
          alert(`Le NIF #${i + 1} est obligatoire.`);
          setSubmitting(false);
          return;
        }

        if (!b.DateCreditsReechelonnes) {
          alert(
            `La date de rééchelonnement #${i + 1} est obligatoire.`
          );
          setSubmitting(false);
          return;
        }
      }

      // 3️⃣ Prepare payload
      const payload = {
        ...formData,
        date_arrete: new Date(formData.date_arrete)
          .toISOString()
          .split("T")[0],

        beneficiaires: formData.beneficiaires.map((b) => {
          const {
            created_at,
            id,
            updated_at,
            deleted_at,
            is_deleted,
            ...cleanB
          } = b;

          return {
            ...cleanB,
            DateCreditsReechelonnes: b.DateCreditsReechelonnes
              ? new Date(b.DateCreditsReechelonnes)
                  .toISOString()
                  .split("T")[0]
              : "",
          };
        }),
      };

      // 4️⃣ Clean root fields
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.deleted_at;
      delete payload.is_deleted;

      // 5️⃣ Submit
      await editDocument("sfe", id, payload);

      navigate("/documents/sfe");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Erreur lors de la mise à jour de la déclaration SFE.");
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
          <StepSFE
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
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Modifier la déclaration SFE
        </h1>

        <p className="text-base font-semibold text-sofiblue">
          Unité en KDA milliers de dinars
        </p>
      </div>

      {renderStep()}

      <StepNavigation step={step} setStep={setStep} maxStep={1} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/sfe")}
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

export default EditSFEPage;