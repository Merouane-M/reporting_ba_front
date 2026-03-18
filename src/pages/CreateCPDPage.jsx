import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepDate from "../components/general/StepDate";
import StepNavigation from "../components/general/StepNavigation";
import StepCPD from "../components/cpdform/StepCPD";
import { addDocument } from "../services/document.service";

function CreateCPDPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    CodeDeclaration: "CPD",
    clients_douteux: [],
    status: "IN_PROCESS",
    is_deleted: false,
    deleted_at: null,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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

const removeClient = (index) => {
  setFormData((prev) => ({
    ...prev,
    clients_douteux: prev.clients_douteux.filter((_, i) => i !== index),
  }));
};

const updateClient = (index, key, value) => {
  setFormData((prev) => {
    const updated = [...prev.clients_douteux];
    updated[index][key] = value;

    return {
      ...prev,
      clients_douteux: updated,
    };
  });
};
const handleSubmit = async () => {
  try {
    // 1️⃣ Validate date_arrete
    if (!formData.date_arrete) {
      alert("Veuillez sélectionner une date d'arrêté.");
      return;
    }

for (let i = 0; i < formData.clients_douteux.length; i++) {
  const c = formData.clients_douteux[i];

  if (!c.beneficiaire?.trim()) {
    alert(`Le nom du client #${i + 1} est obligatoire.`);
    return;
  }

  if (!c.nif?.trim()) {
    alert(`Le NIF du client #${i + 1} est obligatoire.`);
    return;
  }

  if (!c.date_octroi_credit) {
    alert(`La date d'octroi du client #${i + 1} est obligatoire.`);
    return;
  }

  if (!c.annees_declassement_credits) {
    alert(`L'année de déclassement du client #${i + 1} est obligatoire.`);
    return;
  }
}

const payload = {
  ...formData,
  date_arrete: new Date(formData.date_arrete)
    .toISOString()
    .split("T")[0],

  created_at: new Date(),
  updated_at: new Date(),

  clients_douteux: formData.clients_douteux.map((c) => {
    const { created_at, updated_at, deleted_at, is_deleted, ...clean } = c;

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

    // 4️⃣ Submit
    await addDocument("CPD", payload);

    // 5️⃣ Navigate back

    navigate("/documents/cpd");
  } catch (error) {
    console.error("Création échouée :", error);
    alert("Erreur lors de la création de la déclaration CPD.");
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
  removeClient={removeClient}
  updateClient={updateClient}
/>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration CPD
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

        <button className="btn btn-primary" onClick={handleSubmit}>
          Soumettre
        </button>
      </div>
    </div>
  );
}

export default CreateCPDPage;