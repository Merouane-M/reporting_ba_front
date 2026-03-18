import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StepDate from "../components/general/StepDate";
import StepNavigation from "../components/general/StepNavigation";
import StepCPD from "../components/cpdform/StepCPD";
import Loading from "../components/general/Loading";

import { editDocument, getDocumentById } from "../services/document.service";

function EditCPDPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ clients_douteux: [] });
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
      const data = await getDocumentById("cpd", id);

      setFormData({
        ...data,
        date_arrete: formatDate(data.date_arrete),

        clients_douteux: (data.clients_douteux || []).map((c) => ({
          ...c,
          date_octroi_credit: formatDate(c.date_octroi_credit),
          annees_declassement_credits: formatDate(
            c.annees_declassement_credits
          ),
        })),
      });
    } catch (err) {
      console.error("Failed to fetch CPD:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDocument();
}, [id]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

 const addClient = () => {
  const newClient = {
    beneficiaire: "",
    nif: "",
    categorie: "C1",
    date_octroi_credit: "",
    annees_declassement_credits: "",

    montant_creance_bilan: 0,
    montant_engagement_hors_bilan: 0,

    montant_garanties_obtenues_hypotheques: 0,
    montant_garanties_obtenues_financieres: 0,
    montant_garanties_obtenues_autre: 0,

    montant_garanties_realisees: 0,
    montant_provisions_constituees: 0,

    observations: "",
  };

  setFormData((prev) => ({
    ...prev,
    clients_douteux: [...prev.clients_douteux, newClient],
  }));
};

const updateClient = (index, field, value) => {
  setFormData((prev) => {
    const updated = [...prev.clients_douteux];
    updated[index][field] = value;
    return { ...prev, clients_douteux: updated };
  });
};

const removeClient = (index) => {
  setFormData((prev) => ({
    ...prev,
    clients_douteux: prev.clients_douteux.filter((_, i) => i !== index),
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

for (let i = 0; i < formData.clients_douteux.length; i++) {
  const c = formData.clients_douteux[i];

  if (!c.beneficiaire?.trim()) {
    alert(`Le nom du client #${i + 1} est obligatoire.`);
    setSubmitting(false);
    return;
  }

  if (!c.nif?.trim()) {
    alert(`Le NIF du client #${i + 1} est obligatoire.`);
    setSubmitting(false);
    return;
  }

  if (!c.date_octroi_credit) {
    alert(`La date d'octroi du client #${i + 1} est obligatoire.`);
    setSubmitting(false);
    return;
  }

  if (!c.annees_declassement_credits) {
    alert(`L'année de déclassement du client #${i + 1} est obligatoire.`);
    setSubmitting(false);
    return;
  }
}

const payload = {
  ...formData,
  date_arrete: new Date(formData.date_arrete)
    .toISOString()
    .split("T")[0],

  clients_douteux: formData.clients_douteux.map((c) => {
    const {
      id,
      created_at,
      updated_at,
      deleted_at,
      is_deleted,
      ...clean
    } = c;

    return {
      ...clean,
      date_octroi_credit: c.date_octroi_credit
        ? new Date(c.date_octroi_credit).toISOString().split("T")[0]
        : "",
      annees_declassement_credits: c.annees_declassement_credits
        ? new Date(c.annees_declassement_credits)
            .toISOString()
            .split("T")[0]
        : "",
    };
  }),
};

// remove root audit fields
delete payload.created_at;
delete payload.updated_at;
delete payload.deleted_at;
delete payload.is_deleted;


      // 5️⃣ Submit
      await editDocument("cpd", id, payload);

      navigate("/documents/cpd");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Erreur lors de la mise à jour de la déclaration CPD.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDate formData={formData} updateField={updateField} frequency="Semestrielle" />;
      case 1:
        return (
<StepCPD
  clients={formData.clients_douteux}
  addClient={addClient}
  updateClient={updateClient}
  removeClient={removeClient}
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
          Modifier la déclaration CPD
        </h1>
        <p className="text-base font-semibold text-sofiblue">
          Unité en KDA milliers de dinars
        </p>
      </div>

      {renderStep()}

      <StepNavigation step={step} setStep={setStep} steps={["Date", "CPD"]} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/documents/cpd")}
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

export default EditCPDPage;