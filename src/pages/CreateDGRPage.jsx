import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/general/Layout";

import StepDGRMain from "../components/dgrform/StepDGRMain";
import StepBeneficiaire from "../components/dgrform/StepBeneficiaire";
import StepNavigation from "../components/dgrform/StepNavigation";
import StepDate from "../components/dgrform/StepDate";

import { addDocument } from "../services/document.service";
import { addBeneficiaire, addPersonneLiee } from "../services/dgr.service";

// Helper function to convert string to number
const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : Math.floor(num);
};

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
      if (step > index + 1) {
        setStep(step - 1);
      } else if (step === index + 2) {
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
    updated[benefIndex].personnes_liees = updated[
      benefIndex
    ].personnes_liees.filter((_, i) => i !== plIndex);
    setFormData({ ...formData, beneficiaires: updated });
  };

const handleSubmit = async () => {
  try {
    // ✅ 1️⃣ Validate required fields
    if (!formData.date_arrete) {
      alert("Veuillez sélectionner une date d'arrêté.");
      return;
    }

    for (let i = 0; i < formData.beneficiaires.length; i++) {
      const b = formData.beneficiaires[i];

      if (!b.nomBeneficiaire || b.nomBeneficiaire.trim() === "") {
        alert(
          `Veuillez saisir le nom du bénéficiaire pour le bénéficiaire ${i + 1}.`,
        );
        return;
      }

      if (!b.adresseBeneficiaire || b.adresseBeneficiaire.trim() === "") {
        alert(
          `Veuillez saisir l'adresse du bénéficiaire pour le bénéficiaire ${i + 1}.`,
        );
        return;
      }

      if (!b.nif_nin || b.nif_nin.trim() === "") {
        alert(
          `Veuillez saisir le NIF/NIN du bénéficiaire pour le bénéficiaire ${i + 1}.`,
        );
        return;
      }
    }

    // ✅ 2️⃣ Check unique NIF/NIN for beneficiaires
    const beneficiaireNifs = formData.beneficiaires.map((b) =>
      b.nif_nin.trim(),
    );

    const uniqueBeneficiaireNifs = new Set(beneficiaireNifs);

    if (uniqueBeneficiaireNifs.size !== beneficiaireNifs.length) {
      alert("Deux bénéficiaires ne peuvent pas avoir le même NIF/NIN.");
      return;
    }

    // ✅ 3️⃣ Check unique NIF for personnes liées inside each beneficiaire
    for (let i = 0; i < formData.beneficiaires.length; i++) {
      const personnesLiees = formData.beneficiaires[i].personnes_liees;

      const plNifs = personnesLiees
        .map((pl) => (pl.pl_nif ? pl.pl_nif.trim() : ""))
        .filter((nif) => nif !== "");

      const uniquePlNifs = new Set(plNifs);

      if (uniquePlNifs.size !== plNifs.length) {
        alert(
          `Deux personnes liées du bénéficiaire ${i + 1} ne peuvent pas avoir le même NIF.`,
        );
        return;
      }
    }

    // 🚀 4️⃣ Create DGR
    const dgrPayload = {
      CodeDeclaration: formData.CodeDeclaration,
      Frequence: formData.Frequence,
      date_arrete: formData.date_arrete,
      etablissement_declarant: formData.etablissement_declarant,
      fprDateArrete: toNumber(formData.fprDateArrete),
      fprDateArretePrecedente: toNumber(formData.fprDateArretePrecedente),
      status: formData.status,
    };

    const created = await addDocument("DGR", dgrPayload);
    const dgrId = created.id;

    // 5️⃣ Create Beneficiaires
    for (let i = 0; i < formData.beneficiaires.length; i++) {
      const benef = formData.beneficiaires[i];
      const { personnes_liees, ...rest } = benef;

      const beneficiairePayload = {
        ...rest,
        codeOperateur: toNumber(benef.codeOperateur),
        montantRisquesPonderes: toNumber(benef.montantRisquesPonderes),

        montant_Brut_BPA: toNumber(benef.montant_Brut_BPA),
        montant_Garanties_BPA: toNumber(benef.montant_Garanties_BPA),
        montant_Provisions_BPA: toNumber(benef.montant_Provisions_BPA),
        montant_Risques_Ponderes_BPA: toNumber(
          benef.montant_Risques_Ponderes_BPA,
        ),

        montant_Brut_T: toNumber(benef.montant_Brut_T),
        montant_Garanties_T: toNumber(benef.montant_Garanties_T),
        montant_Provisions_T: toNumber(benef.montant_Provisions_T),
        montant_Risques_Ponderes_T: toNumber(
          benef.montant_Risques_Ponderes_T,
        ),

        montant_Brut_EF: toNumber(benef.montant_Brut_EF),
        montant_Garanties_EF: toNumber(benef.montant_Garanties_EF),
        montant_Provisions_EF: toNumber(benef.montant_Provisions_EF),
        montant_Risques_Ponderes_EF: toNumber(
          benef.montant_Risques_Ponderes_EF,
        ),

        montant_Brut_EG: toNumber(benef.montant_Brut_EG),
        montant_Garanties_EG: toNumber(benef.montant_Garanties_EG),
        montant_Provisions_EG: toNumber(benef.montant_Provisions_EG),
        montant_Risques_Ponderes_EG: toNumber(
          benef.montant_Risques_Ponderes_EG,
        ),
      };

      const createdBenef = await addBeneficiaire(dgrId, beneficiairePayload);
      const benefId = createdBenef.id;

      // 6️⃣ Create Personnes liées
      for (let j = 0; j < personnes_liees.length; j++) {
        const pl = personnes_liees[j];

        const personneLieePayload = {
          ...pl,
          capital: toNumber(pl.capital),
        };

        await addPersonneLiee(dgrId, benefId, personneLieePayload);
      }
    }

    navigate("/documents/dgr");
  } catch (err) {
    console.error("Creation failed:", err);
    alert(`Erreur lors de la création: ${err.message}`);
  }
};

  const renderStep = () => {
    // Step 0 → Date
    if (step === 0) {
      return <StepDate formData={formData} updateField={updateField} />;
    }

    // Step 1 → DGR Main
    if (step === 1) {
      return (
        <StepDGRMain
          formData={formData}
          updateField={updateField}
          addBeneficiaire={addBeneficiaireToForm}
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
        addPersonneLiee={addPersonneLieeToForm}
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

        <div className="flex justify-around">

          <button
            className="btn btn-secondary mt-6"
            onClick={() => navigate("/documents/dgr")}
          >
            Annuler
          </button>

          <button className="btn btn-primary mt-6" onClick={handleSubmit}>
            Soumettre
          </button>


        </div>
      </div>
    </Layout>
  );
}

export default CreateDGRPage;
