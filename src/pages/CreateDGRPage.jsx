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
    Frequence: "quarterly",
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

  // Renamed to avoid confusion with API call
  const addBeneficiaireToForm = () => {
    setFormData((prev) => {
      const newBeneficiaires = [
        ...prev.beneficiaires,
        {
          nomBeneficiaire: "",
          adresseBeneficiaire: "",
          nif_nin: "",
          codeOperateur: "007",  
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

  const deleteBeneficiaire = (index) => {
    setFormData((prev) => {
      const newBeneficiaires = prev.beneficiaires.filter((_, i) => i !== index);
      // Adjust step if the deleted beneficiaire was the current one or later
      if (step > index + 1) {
        setStep(step - 1);
      } else if (step === index + 2) {
        // If deleting the current beneficiaire, go back to DGR Main
        setStep(1);
      }
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

  // Renamed to avoid confusion with API call
  const addPersonneLieeToForm = (benefIndex) => {
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

  const deletePersonneLiee = (benefIndex, plIndex) => {
    const updated = [...formData.beneficiaires];
    updated[benefIndex].personnes_liees = updated[benefIndex].personnes_liees.filter((_, i) => i !== plIndex);
    setFormData({ ...formData, beneficiaires: updated });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.date_arrete) {
        alert("Veuillez sélectionner une date d'arrêté.");
        return;
      }
      if (formData.beneficiaires.length === 0) {
        alert("Veuillez ajouter au moins un bénéficiaire.");
        return;
      }
      for (let i = 0; i < formData.beneficiaires.length; i++) {
        const b = formData.beneficiaires[i];
        if (!b.nomBeneficiaire || b.nomBeneficiaire.trim() === "") {
          alert(`Veuillez saisir le nom du bénéficiaire pour le bénéficiaire ${i + 1}.`);
          return;
        }
        if (!b.adresseBeneficiaire || b.adresseBeneficiaire.trim() === "") {
          alert(`Veuillez saisir l'adresse du bénéficiaire pour le bénéficiaire ${i + 1}.`);
          return;
        }
        if (!b.nif_nin || b.nif_nin.trim() === "") {
          alert(`Veuillez saisir le NIF/NIN du bénéficiaire pour le bénéficiaire ${i + 1}.`);
          return;
        }
        if (b.codeOperateur !== "007") {
          alert(`Le code opérateur doit être "007" pour le bénéficiaire ${i + 1}.`);
          return;
        }
      }

      console.log("Starting DGR creation process...");

      // 1️⃣ Create DGR
      const dgrPayload = {
        CodeDeclaration: formData.CodeDeclaration,
        Frequence: formData.Frequence,
        date_arrete: formData.date_arrete,
        etablissement_declarant: formData.etablissement_declarant,
        fprDateArrete: formData.fprDateArrete,
        fprDateArretePrecedente: formData.fprDateArretePrecedente,
        status: formData.status,
      };
      console.log("Creating DGR with payload:", dgrPayload);
      const created = await addDocument("DGR", dgrPayload);
      console.log("DGR created successfully:", created);
      const dgrId = created.id;
      console.log("DGR ID:", dgrId);

      // 2️⃣ Create Beneficiaires
      console.log(`Creating ${formData.beneficiaires.length} beneficiaires...`);
      for (let i = 0; i < formData.beneficiaires.length; i++) {
        const benef = formData.beneficiaires[i];
        const { personnes_liees, ...beneficiairePayload } = benef;
        console.log(`Creating beneficiaire ${i + 1} with payload:`, beneficiairePayload);

        const createdBenef = await addBeneficiaire(dgrId, beneficiairePayload);
        console.log(`Beneficiaire ${i + 1} created:`, createdBenef);
        const benefId = createdBenef.id;
        console.log(`Beneficiaire ${i + 1} ID:`, benefId);

        // 3️⃣ Create Personnes liées
        console.log(`Creating ${personnes_liees.length} personnes liees for beneficiaire ${i + 1}...`);
        for (let j = 0; j < personnes_liees.length; j++) {
          const pl = personnes_liees[j];
          console.log(`Creating personne liee ${j + 1} for beneficiaire ${i + 1} with payload:`, pl);
          const createdPl = await addPersonneLiee(dgrId, benefId, pl);
          console.log(`Personne liee ${j + 1} for beneficiaire ${i + 1} created:`, createdPl);
        }
      }

      console.log("All creations completed successfully!");
      navigate("/documents/dgr");
    } catch (err) {
      console.error("Creation failed:", err);
      alert(`Erreur lors de la création: ${err.message}`);
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
          addBeneficiaire={addBeneficiaireToForm}  // Updated prop name
          deleteBeneficiaire={deleteBeneficiaire}
        />
      );
    }

    // Step 2+ → Beneficiaires
    return (
      <StepBeneficiaire
        index={step - 2}
        data={formData.beneficiaires[step - 2]}
        updateBeneficiaire={updateBeneficiaire}
        addPersonneLiee={addPersonneLieeToForm}  // Updated prop name
        updatePersonneLiee={updatePersonneLiee}
        deletePersonneLiee={deletePersonneLiee}
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

        <div className="flex justify-end">
          <button className="btn btn-primary mt-6" onClick={handleSubmit}>
            Soumettre
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default CreateDGRPage;