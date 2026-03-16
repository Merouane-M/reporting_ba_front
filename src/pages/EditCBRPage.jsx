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
  const [formData, setFormData] = useState({ beneficiaires: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getDocumentById("cbr", id);
        console.log(data);

        setFormData({
          ...data,
          date_arrete: formatDate(data.date_arrete),
          beneficiaires: (data.beneficiaires || []).map((b) => ({
            ...b,
            date_octroi_credit: formatDate(b.date_octroi_credit),
            annees_declassement_credits: formatDate(
              b.annees_declassement_credits
            ),
          })),
        });
      } catch (err) {
        console.error("Failed to fetch CBR:", err);
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
      beneficiaire: "",
      nif: "",
      categorie: "C1",
      categorie_avant_reechelonnement: "C1",
      date_octroi_credit: "",
      annees_declassement_credits: "",
      encours_creance_bilan: 0,
      encours_engagements_hors_bilan: 0,
      montant_reech_gouv: 0,
      montant_reech_autres: 0,
      provision_avant_gouv: 0,
      provision_avant_autres: 0,
      provision_apres_gouv: 0,
      provision_apres_autres: 0,
      observations: "",
    };
    setFormData((prev) => ({
      ...prev,
      beneficiaires: [...prev.beneficiaires, newBeneficiaire],
    }));
  };

  const updateBeneficiaire = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.beneficiaires];
      updated[index][field] = value;
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
      // 1️⃣ Validate root date_arrete
      if (!formData.date_arrete?.trim()) {
        alert("Veuillez sélectionner une date d'arrêté.");
        setSubmitting(false);
        return;
      }

      // 2️⃣ Validate each beneficiary
      for (let i = 0; i < formData.beneficiaires.length; i++) {
        const b = formData.beneficiaires[i];
        if (!b.beneficiaire?.trim()) {
          alert(`Le nom du bénéficiaire #${i + 1} est obligatoire.`);
          setSubmitting(false);
          return;
        }
        if (!b.nif?.trim()) {
          alert(`Le NIF du bénéficiaire #${i + 1} est obligatoire.`);
          setSubmitting(false);
          return;
        }
        if (!b.date_octroi_credit?.trim()) {
          alert(
            `La date d'octroi du crédit du bénéficiaire #${i + 1} est obligatoire.`
          );
          setSubmitting(false);
          return;
        }
        if (!b.annees_declassement_credits?.trim()) {
          alert(
            `L'année de déclassement du crédit du bénéficiaire #${
              i + 1
            } est obligatoire.`
          );
          setSubmitting(false);
          return;
        }
      }

      // 3️⃣ Prepare payload
      const payload = {
        ...formData,
        date_arrete: new Date(formData.date_arrete).toISOString().split("T")[0],
        beneficiaires: formData.beneficiaires.map((b) => {

          const { created_at,id ,updated_at, deleted_at, is_deleted, ...cleanB } =
            b;
          return {
            ...cleanB,
            date_octroi_credit: b.date_octroi_credit
              ? new Date(b.date_octroi_credit).toISOString().split("T")[0]
              : "",
            annees_declassement_credits: b.annees_declassement_credits
              ? new Date(b.annees_declassement_credits).toISOString().split("T")[0]
              : "",
          };
        }),
      };

      // 4️⃣ Remove root audit fields
      
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.deleted_at;
      delete payload.is_deleted;


      // 5️⃣ Submit
      await editDocument("cbr", id, payload);

      alert("Déclaration CBR mise à jour avec succès !");
      navigate("/documents/cbr");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Erreur lors de la mise à jour de la déclaration CBR.");
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