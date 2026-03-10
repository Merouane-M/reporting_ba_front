import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDocument } from "../services/document.service";
import StepDate from "../components/dcsform/StepDate";
import StepNavigation from "../components/dcsform/StepNavigation";
import StepM100 from "../components/dcsform/StepM100.jsx";

function CreateDCSPage () {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const [formData, setFormData]= useState({
        CodeDeclaration: "DCS",
        Frequence: "Quarterly"
    });

    const updateField = (key, value) => {
        setFormData((prev)=>({
            ...prev,
            [key]: value,
        }));
    };
    const handleSubmit = async () => {
        try{
            await addDocument("DCS", formData);
            navigate("/documents/dcs")

        }catch (error){
            console.error("creation failed:", error);

        }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <StepDate formData={formData} updateField={updateField}/>;
            case 1:
                return <StepM100 formData={formData} updateField={updateField}/>; 
            case 2:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 3:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 4:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 5:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 6:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 7:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 8:
                return <StepDate formData={formData} updateField={updateField}/>;       
            case 9:
                return <StepDate formData={formData} updateField={updateField}/>;       
            default:
                return null;
        }
    }
return (
    < >
      <div className="w-4/5 mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex flex-row justify-between">

        <h1 className="text-2xl font-bold text-sofiblue mb-6">
          Nouvelle déclaration DCS
        </h1>

        <p className="text-base font-semibold text-sofiblue"> Unité en KDA milliers de dinars</p>
      </div>

        {renderStep()}

        <StepNavigation
          step={step}
          setStep={setStep}
          maxStep={8}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/documents/dee")}
          >
            Annuler
          </button>


            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Soumettre
            </button>

        </div>
      </div>
    </ >
)
}

export default CreateDCSPage ;