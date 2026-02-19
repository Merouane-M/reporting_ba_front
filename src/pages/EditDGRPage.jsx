import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/general/Layout";

import StepDGRMain from "../components/dgrform/StepDGRMain";
import StepBeneficiaire from "../components/dgrform/StepBeneficiaire";
import StepNavigation from "../components/dgrform/StepNavigation";
import StepDate from "../components/dgrform/StepDate";

import { getDocumentById, editDocument } from "../services/document.service";
import { getBeneficiaires, getBeneficiaire, editBeneficiaire, addBeneficiaire, removeBeneficiaire } from "../services/dgr.service";
import { getPersonnesLiees, addPersonneLiee, editPersonneLiee, removePersonneLiee } from "../services/dgr.service";

// Helper function to convert string to number
const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : Math.floor(num);
};

function EditDGRPage() {
  const { id } = useParams(); // Get DGR ID from URL
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Load existing DGR data on mount
  useEffect(() => {
    const loadDGR = async () => {
      try {
        setLoading(true);
        
        // Fetch DGR document
        const dgrData = await getDocumentById("DGR", id);
        
        // Fetch beneficiaires list first (to get IDs)
        const beneficiairesList = await getBeneficiaires(id);
        
        // Fetch each beneficiaire individually with their personnes liees
        const beneficiairesWithDetails = await Promise.all(
          beneficiairesList.map(async (b) => {
            try {
              // Fetch full beneficiaire details
              const benefDetails = await getBeneficiaire(id, b.id);
              
              // Fetch personnes liees for this beneficiaire
              const personnesLiees = await getPersonnesLiees(id, b.id);
              
              return {
                ...benefDetails,
                personnes_liees: personnesLiees || [],
              };
            } catch (err) {
              return {
                ...b,
                personnes_liees: [],
              };
            }
          })
        );
        
        
        // Build form data
        setFormData({
          CodeDeclaration: dgrData.CodeDeclaration || "DGR",
          Frequence: dgrData.Frequence || "quarterly",
          date_arrete: dgrData.date_arrete,
          etablissement_declarant: dgrData.etablissement_declarant || "025",
          fprDateArrete: dgrData.fprDateArrete || 0,
          fprDateArretePrecedente: dgrData.fprDateArretePrecedente || 0,
          status: dgrData.status || "IN_PROCESS",
          beneficiaires: beneficiairesWithDetails.map(b => ({
            id: b.id,
            nomBeneficiaire: b.nomBeneficiaire || "",
            adresseBeneficiaire: b.adresseBeneficiaire || "",
            nif_nin: b.nif_nin || "",
            codeOperateur: b.codeOperateur || "000",
            montantRisquesPonderes: b.montantRisquesPonderes || 0,
            
            // MOD G2000 fields
            codeREB: b.codeREB || "A",
            sousCodeBPA: b.sousCodeBPA || "1",
            montant_Brut_BPA: b.montant_Brut_BPA || null,
            montant_Garanties_BPA: b.montant_Garanties_BPA || null,
            montant_Provisions_BPA: b.montant_Provisions_BPA || null,
            montant_Risques_Ponderes_BPA: b.montant_Risques_Ponderes_BPA || null,
            
            sousCodeT: b.sousCodeT || "2",
            montant_Brut_T: b.montant_Brut_T || null,
            montant_Garanties_T: b.montant_Garanties_T || null,
            montant_Provisions_T: b.montant_Provisions_T || null,
            montant_Risques_Ponderes_T: b.montant_Risques_Ponderes_T || null,
            
            codeREHB: b.codeREHB || "B",
            sousCodeEF: b.sousCodeEF || "1",
            montant_Brut_EF: b.montant_Brut_EF || null,
            montant_Garanties_EF: b.montant_Garanties_EF || null,
            montant_Provisions_EF: b.montant_Provisions_EF || null,
            montant_Risques_Ponderes_EF: b.montant_Risques_Ponderes_EF || null,
            
            sousCodeEG: b.sousCodeEG || "2",
            montant_Brut_EG: b.montant_Brut_EG || null,
            montant_Garanties_EG: b.montant_Garanties_EG || null,
            montant_Provisions_EG: b.montant_Provisions_EG || null,
            montant_Risques_Ponderes_EG: b.montant_Risques_Ponderes_EG || null,
            
            personnes_liees: (b.personnes_liees || []).map(pl => ({
              id: pl.id,
              pl_nom: pl.pl_nom || "",
              pl_nif: pl.pl_nif || "",
              capital: pl.capital || 0,
            })),
          })),
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading DGR:", err);
        alert("Erreur lors du chargement des données DGR");
        setLoading(false);
      }
    };

    if (id) {
      loadDGR();
    }
  }, [id]);

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
          codeOperateur: "000",
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

  const deleteBeneficiaire = async (index) => {
    const benef = formData.beneficiaires[index];
    
    // If it's an existing beneficiaire (has ID), delete from API
    if (benef.id) {
      try {
        await removeBeneficiaire(id, benef.id);
      } catch (err) {
        console.error("Error deleting beneficiaire:", err);
      }
    }
    
    // Remove from form
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

  const deletePersonneLiee = async (benefIndex, plIndex) => {
    const pl = formData.beneficiaires[benefIndex].personnes_liees[plIndex];
    const benef = formData.beneficiaires[benefIndex];
    
    // If it's an existing personne liee (has ID), delete from API
    if (pl.id) {
      try {
        await removePersonneLiee(id, benef.id, pl.id);
      } catch (err) {
        console.error("Error deleting personne liee:", err);
      }
    }
    
    // Remove from form
    const updated = [...formData.beneficiaires];
    updated[benefIndex].personnes_liees = updated[benefIndex].personnes_liees.filter((_, i) => i !== plIndex);
    setFormData({ ...formData, beneficiaires: updated });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!formData.date_arrete) {
        alert("Veuillez sélectionner une date d'arrêté.");
        setSaving(false);
        return;
      }
      for (let i = 0; i < formData.beneficiaires.length; i++) {
        const b = formData.beneficiaires[i];
        if (!b.nomBeneficiaire || b.nomBeneficiaire.trim() === "") {
          alert(`Veuillez saisir le nom du bénéficiaire pour le beneficiary ${i + 1}.`);
          setSaving(false);
          return;
        }
      }


      // 1️⃣ Update DGR
      const dgrPayload = {
        CodeDeclaration: formData.CodeDeclaration,
        Frequence: formData.Frequence,
        date_arrete: formData.date_arrete,
        etablissement_declarant: formData.etablissement_declarant,
        fprDateArrete: toNumber(formData.fprDateArrete),
        fprDateArretePrecedente: toNumber(formData.fprDateArretePrecedente),
        status: formData.status,
      };
      await editDocument("DGR", id, dgrPayload);

      // 2️⃣ Update/Create Beneficiaires
      for (let i = 0; i < formData.beneficiaires.length; i++) {
        const benef = formData.beneficiaires[i];
        const { personnes_liees, ...rest } = benef;
        
        // Convert to actual numbers
        const beneficiairePayload = {
          ...rest,
          codeOperateur: toNumber(benef.codeOperateur),
          montantRisquesPonderes: toNumber(benef.montantRisquesPonderes),
          
          // MOD G2000 fields
          montant_Brut_BPA: toNumber(benef.montant_Brut_BPA),
          montant_Garanties_BPA: toNumber(benef.montant_Garanties_BPA),
          montant_Provisions_BPA: toNumber(benef.montant_Provisions_BPA),
          montant_Risques_Ponderes_BPA: toNumber(benef.montant_Risques_Ponderes_BPA),
          
          montant_Brut_T: toNumber(benef.montant_Brut_T),
          montant_Garanties_T: toNumber(benef.montant_Garanties_T),
          montant_Provisions_T: toNumber(benef.montant_Provisions_T),
          montant_Risques_Ponderes_T: toNumber(benef.montant_Risques_Ponderes_T),
          
          montant_Brut_EF: toNumber(benef.montant_Brut_EF),
          montant_Garanties_EF: toNumber(benef.montant_Garanties_EF),
          montant_Provisions_EF: toNumber(benef.montant_Provisions_EF),
          montant_Risques_Ponderes_EF: toNumber(benef.montant_Risques_Ponderes_EF),
          
          montant_Brut_EG: toNumber(benef.montant_Brut_EG),
          montant_Garanties_EG: toNumber(benef.montant_Garanties_EG),
          montant_Provisions_EG: toNumber(benef.montant_Provisions_EG),
          montant_Risques_Ponderes_EG: toNumber(benef.montant_Risques_Ponderes_EG),
        };
        
        let benefId;
        
        if (benef.id) {
          // Update existing beneficiaire
          await editBeneficiaire(id, benef.id, beneficiairePayload);
          benefId = benef.id;
        } else {
          // Create new beneficiaire
          const createdBenef = await addBeneficiaire(id, beneficiairePayload);
          benefId = createdBenef.id;
        }

        // 3️⃣ Update/Create Personnes liées
        for (let j = 0; j < personnes_liees.length; j++) {
          const pl = personnes_liees[j];
          
          const personneLieePayload = {
            ...pl,
            capital: toNumber(pl.capital),
          };
          
          if (pl.id) {
            // Update existing personne liee
            await editPersonneLiee(id, benefId, pl.id, personneLieePayload);
          } else {
            // Create new personne liee
            await addPersonneLiee(id, benefId, personneLieePayload);
          }
        }
      }

      setSaving(false);
      navigate("/documents/dgr");
    } catch (err) {
      console.error("Update failed:", err);
      alert(`Erreur lors de la mise à jour: ${err.message}`);
      setSaving(false);
    }
  };

  const renderStep = () => {
    if (loading) {
      return <div className="text-center p-8">Chargement...</div>;
    }

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
          Modifier la déclaration DGR
        </h1>

        {renderStep()}

        <StepNavigation
          step={step}
          setStep={setStep}
          beneficiairesCount={formData.beneficiaires.length}
        />

        <div className="flex justify-end">
          <button
            className="btn btn-primary mt-6" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default EditDGRPage;