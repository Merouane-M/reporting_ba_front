import BeneficiaireInfo from "./BeneficiaireInfo";
import FinancialTable from "./FinancialTable";
import PersonnesLieesTable from "./PersonnesLieesTable";

function StepBeneficiaire(props) {
  return (
    <div className="space-y-8">
      <BeneficiaireInfo
        index={props.index}
        data={props.data}
        updateBeneficiaire={props.updateBeneficiaire}
      />

      <FinancialTable
        index={props.index}
        data={props.data}
        updateBeneficiaire={props.updateBeneficiaire}
      />

      <PersonnesLieesTable
        index={props.index}
        data={props.data}
        addPersonneLiee={props.addPersonneLiee}
        updatePersonneLiee={props.updatePersonneLiee}
        deletePersonneLiee={props.deletePersonneLiee}
      />
    </div>
  );
}

export default StepBeneficiaire;
