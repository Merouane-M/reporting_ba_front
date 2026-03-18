import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StepDate from "../components/general/StepDate";
import StepNavigation from "../components/general/StepNavigation";
import StepECP from "../components/ecpform/StepECP";
import Loading from "../components/general/Loading";

import { editDocument, getDocumentById } from "../services/document.service";

function EditECPPage() {
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
        const data = await getDocumentById("ecp", id);

        setFormData({
          ...data,
          date_arrete: formatDate(data.date_arrete),
          beneficiaires: (data.beneficiaires || []).map((b) => ({
            ...b,
            date_autorisation: formatDate(b.date_autorisation),
            date_echeance: formatDate(b.date_echeance ),
          })),
        });
      } catch (err) {
        console.error("Failed to fetch ECP:", err);
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
      raison_sociale: "",
      nif: "",
      nature_credit: "",
      date_autorisation: "",
      date_echeance: "",
      montant_autorise: 0,
      montant_utilise: 0,
      destination_credit: "",
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
    if (!formData.fonds_propres){
        alert("Veuillez remplir le fonds propres de base");
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
          };
        }),
      };

      // 4️⃣ Remove root audit fields
      
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.deleted_at;
      delete payload.is_deleted;


      // 5️⃣ Submit
      await editDocument("ecp", id, payload);

      navigate("/documents/ecp");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Erreur lors de la mise à jour de la déclaration ECP.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} frequency="Bimensuelle" />;
      case 1:
        return (
          <StepECP
            formData={formData}
            updateField={updateField}
            //beneficiaires={formData.beneficiaires}
            addBeneficiaire={addBeneficiaire}
            removeBeneficiaire={removeBeneficiaire}
            updateBeneficiaire={updateBeneficiaire}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Modifier la déclaration ECP
        </h1>
        <p className="text-base font-semibold text-sofiblue">
          Unité en KDA milliers de dinars
        </p>
      </div>

      {renderStep()}

         <StepNavigation step={step} setStep={setStep} steps={["Date", "ECP"]} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/ecp")}
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

export default EditECPPage;