import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/general/Layout";

import StepDGRMain from "../components/dgrform/StepDGRMain";
import StepBeneficiaire from "../components/dgrform/StepBeneficiaire";
import StepNavigation from "../components/dgrform/StepNavigation";
import StepDate from "../components/dgrform/StepDate";

import { addDocument } from "../services/document.service";
import { addBeneficiaire, addPersonneLiee } from "../services/dgr.service";

function CreateDGRPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CodeDeclaration: "DGR",
    Frequence: "monthly",
    date_arrete: null,
    etablissement_declarant: "025",
    fprDateArrete: 0,
    fprDateArretePrecedente: 0,
    status: "IN_PROCESS",
    beneficiaires: [],
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

const addBeneficiaire = () => {
  setFormData((prev) => {
    const newBeneficiaires = [
      ...prev.beneficiaires,
      {
        nomBeneficiaire: "",
        montantRisquesPonderes: 0,
        personnes_liees: [],
      },
    ];

    // Step structure:
    // 0 = Date
    // 1 = DGR Main
    // 2 = Benef 1
    // 3 = Benef 2
    // So new step index = newBeneficiaires.length + 1

    setStep(newBeneficiaires.length + 1);

    return {
      ...prev,
      beneficiaires: newBeneficiaires,
    };
  });
};



  const updateBeneficiaire = (index, key, value) => {
    const updated = [...formData.beneficiaires];
    updated[index][key] = value;
    setFormData({ ...formData, beneficiaires: updated });
  };

  const addPersonneLiee = (benefIndex) => {
    const updated = [...formData.beneficiaires];
    updated[benefIndex].personnes_liees.push({
      pl_nom: "",
      pl_nif: "",
      capital: 0,
    });
    setFormData({ ...formData, beneficiaires: updated });
  };

  const updatePersonneLiee = (benefIndex, plIndex, key, value) => {
    const updated = [...formData.beneficiaires];
    updated[benefIndex].personnes_liees[plIndex][key] = value;
    setFormData({ ...formData, beneficiaires: updated });
  };

const handleSubmit = async () => {
  try {
    // 1️⃣ Create DGR
    const created = await addDocument("DGR", {
      CodeDeclaration: formData.CodeDeclaration,
      Frequence: formData.Frequence,
      date_arrete: formData.date_arrete,
      etablissement_declarant: formData.etablissement_declarant,
      fprDateArrete: formData.fprDateArrete,
      fprDateArretePrecedente: formData.fprDateArretePrecedente,
      status: formData.status,
    });

    const dgrId = created.id;

    // 2️⃣ Create Beneficiaires
    for (const benef of formData.beneficiaires) {
      const { personnes_liees, ...beneficiairePayload } = benef;

      const createdBenef = await addBeneficiaire(
        dgrId,
        beneficiairePayload
      );

      // 3️⃣ Create Personnes liées
      for (const pl of personnes_liees) {
        await addPersonneLiee(dgrId, createdBenef.id, pl);
      }
    }

    navigate("/documents/dgr");
  } catch (err) {
    console.error("Creation failed:", err);
  }
};

 const renderStep = () => {
  // Step 0 → Date
  if (step === 0) {
    return (
      <StepDate
        formData={formData}
        updateField={updateField}
      />
    );
  }

  // Step 1 → DGR Main
  if (step === 1) {
    return (
      <StepDGRMain
        formData={formData}
        updateField={updateField}
        addBeneficiaire={addBeneficiaire}
      />
    );
  }

  // Step 2+ → Beneficiaires
  return (
    <StepBeneficiaire
      index={step - 2}
      data={formData.beneficiaires[step - 2]}
      updateBeneficiaire={updateBeneficiaire}
      addPersonneLiee={addPersonneLiee}
      updatePersonneLiee={updatePersonneLiee}
    />
  );
};


  return (
    <Layout>
      <div className="w-4/5 mx-auto mt-10 bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration DGR
        </h1>

        {renderStep()}

<StepNavigation
  step={step}
  setStep={setStep}
  beneficiairesCount={formData.beneficiaires.length}
/>


        <button className="btn btn-primary mt-6" onClick={handleSubmit}>
          Soumettre
        </button>
      </div>
    </Layout>
  );
}

export default CreateDGRPage;
