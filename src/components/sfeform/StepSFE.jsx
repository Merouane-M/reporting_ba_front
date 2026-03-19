import { useState } from "react";
import FormattedNumberInputKDA from "../general/FormattedNumberInputKDA";
import Input from "../general/Input";

function StepSFE({
    beneficiaires,
    addBeneficiaire,
    updateBeneficiaire,
    removeBeneficiaire,
}) {
    const [errors, setErrors] = useState({});

    const validateNom = (value) => {
        if (/\d/.test(value)) {
            return "Le nom ne doit pas contenir de chiffres.";
        }
        return "";
    };
    const FinancialGroup = ({ title, children }) => (
        <div className="border border-sofiblue/30 rounded-lg p-4 bg-white shadow-sm">
            <h6 className="text-sm font-bold text-sofiblue mb-3 border-b pb-1">
                {title}
            </h6>

            <div className="grid grid-cols-2 gap-6">
                {children}
            </div>
        </div>
    );
    const validateNif = (value) => {
        if (!/^\d{15,20}$/.test(value)) {
            return "Le NIF doit contenir entre 15 et 20 chiffres.";
        }
        return "";
    };

    const formatDate = (date) => {
        if (!date) return "";
        try {
            return new Date(date).toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    const extractYear = (date) => {
        if (!date) return "";
        try {
            return new Date(date).getFullYear().toString();
        } catch {
            return "";
        }
    };

    const handleChange = (index, field, value) => {
        let error = "";

        if (field === "beneficiaire") error = validateNom(value);
        if (field === "nif") error = validateNif(value);

        setErrors((prev) => ({
            ...prev,
            [`${index}-${field}`]: error,
        }));

        updateBeneficiaire(index, field, value);
    };

    const NumericField = ({ label, value, onChange }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">{label}</label>
            <FormattedNumberInputKDA value={value} onChange={onChange} />
        </div>
    );

    return (
        <div className="space-y-8 bg-white rounded-xl shadow-lg p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-2xl font-bold text-sofiblue">
                    Bénéficiaires
                </h3>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addBeneficiaire}
                >
                    + Ajouter bénéficiaire
                </button>
            </div>

            {beneficiaires.map((b, index) => (
                <div
                    key={index}
                    className="border border-sofiblue rounded-xl p-6 bg-sofigrey/40 space-y-6 shadow-xl"
                >

                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-sofiblue">
                            Bénéficiaire #{index + 1}
                        </h4>

                        <button
                            type="button"
                            className="btn btn-danger text-sm"
                            onClick={() => removeBeneficiaire(index)}
                        >
                            Supprimer
                        </button>
                    </div>
                    <h5 className="text-sm font-bold text-white bg-sofiblue p-1 rounded">
                        Informations Bénéficiaire
                    </h5>

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-6 gap-5">

                        <Input
                            label="Entreprise Bénéficiaire"
                            value={b.entreprise_name || ""}
                            onChange={(val) =>
                                handleChange(index, "entreprise_name", val)
                            }
                            error={errors[`${index}-entreprise_name`]}
                        />

                        <Input
                            label="NIF"
                            value={b.nif || ""}
                            onChange={(val) => handleChange(index, "nif", val)}
                            error={errors[`${index}-nif`]}
                        />

                        <div>

                            <Input
                                label="Groupe"
                                value={b.group || ""}
                                onChange={(val) => handleChange(index, "group", val)}
                                error={errors[`${index}-group`]}
                            />
                        </div>

                        <div>

                            <Input
                                label="Encours des crédits"
                                value={b.Encours_Credits || ""}
                                onChange={(val) =>
                                    updateBeneficiaire(index, "Encours_Credits", val)
                                }
                            >
                            </Input>
                        </div>
                        <div>
                            <Input
                                label="Interets Reserves Annules"
                                value={b.InteretsReservesAnnules || ""}
                                onChange={(val) =>
                                    updateBeneficiaire(index, "InteretsReservesAnnules", val)
                                }
                            />
                        </div>

                    </div>

                    {/* FINANCIAL SECTION */}
                    <div className="border-t pt-4">

                        <h5 className="text-sm font-bold text-white bg-sofiblue p-1 rounded mb-4">
                            Informations financières
                        </h5>

                        <div className="grid grid-cols-2 gap-6">

                            <FinancialGroup title="Creances Classes">
                                <NumericField
                                    label="Montant "
                                    value={b.MontantCeancesClassees || ""}
                                    onChange={(val) =>
                                        updateBeneficiaire(index, "MontantCeancesClassees", val)
                                    }
                                />


                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-600">
                                        Catégorie
                                    </label>

                                    <select
                                        className="input border rounded p-2 w-full text-right"
                                        value={b.CategorieCreancesClassees ?? "C1"}
                                        onChange={(e) =>
                                            updateBeneficiaire(
                                                index,
                                                "CategorieCreancesClassees",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                        <option value="C3">C3</option>
                                    </select>
                                </div>

                            </FinancialGroup >
                            <FinancialGroup title="Credits Reechelonnes">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-600">
                                        Année déclassement
                                    </label>

                                    <input
                                        type="date"
                                        className="input border rounded p-2 w-full text-right"
                                        value={formatDate(b.DateCreditsReechelonnes)}
                                        onChange={(e) =>
                                            updateBeneficiaire(
                                                index,
                                                "DateCreditsReechelonnes",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <NumericField
                                    label="Montants"
                                    value={b.MontantsCreditsReechelonnes || ""}
                                    onChange={(val) =>
                                        updateBeneficiaire(index, "MontantsCreditsReechelonnes", val)
                                    }
                                />
                            </FinancialGroup >




                        </div>

                    </div>




                </div>
            ))}
        </div>
    );
}

export default StepSFE;