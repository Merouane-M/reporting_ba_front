import { useState, useEffect } from "react";

function StepDate({ formData, updateField, frequency = "Annuelle" }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  // Define periods and labels based on frequency
  const getPeriodOptions = () => {
    switch (frequency) {
      case "Annuelle":
      case "Semestrielle":
        return {
          periods: ["S1", "S2"],
          labels: ["1er Semestre (30 Juin)", "2ème Semestre (31 Décembre)"],
          type: "semester"
        };
      case "Trimestrielle":
        return {
          periods: ["Q1", "Q2", "Q3", "Q4"],
          labels: ["1er Trimestre (31 Mars)", "2ème Trimestre (30 Juin)", "3ème Trimestre (30 Septembre)", "4ème Trimestre (31 Décembre)"],
          type: "quarter"
        };
      case "Mensuelle":
        return {
          periods: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
          labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
          type: "month"
        };
      case "Bimensuelle":
        return {
          periods: ["01-02", "03-04", "05-06", "07-08", "09-10", "11-12"],
          labels: ["Janvier-Février", "Mars-Avril", "Mai-Juin", "Juillet-Août", "Septembre-Octobre", "Novembre-Décembre"],
          type: "bimonth"
        };
      default:
        return {
          periods: ["S1", "S2"],
          labels: ["1er Semestre (30 Juin)", "2ème Semestre (31 Décembre)"],
          type: "semester"
        };
    }
  };

  const periodOptions = getPeriodOptions();

  // Parse existing date_arrete (YYYY-MM-DD)
  useEffect(() => {
    if (formData.date_arrete) {
      const parts = formData.date_arrete.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        setSelectedYear(year);

        if (periodOptions.type === "semester") {
          if (month === "06") setSelectedPeriod("S1");
          if (month === "12") setSelectedPeriod("S2");
        } else if (periodOptions.type === "quarter") {
          if (month === "03") setSelectedPeriod("Q1");
          if (month === "06") setSelectedPeriod("Q2");
          if (month === "09") setSelectedPeriod("Q3");
          if (month === "12") setSelectedPeriod("Q4");
        } else if (periodOptions.type === "month") {
          setSelectedPeriod(month);
        } else if (periodOptions.type === "bimonth") {
          if (["01", "02"].includes(month)) setSelectedPeriod("01-02");
          if (["03", "04"].includes(month)) setSelectedPeriod("03-04");
          if (["05", "06"].includes(month)) setSelectedPeriod("05-06");
          if (["07", "08"].includes(month)) setSelectedPeriod("07-08");
          if (["09", "10"].includes(month)) setSelectedPeriod("09-10");
          if (["11", "12"].includes(month)) setSelectedPeriod("11-12");
        }
      }
    }
  }, [formData.date_arrete, periodOptions.type]);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (selectedPeriod) {
      generateDate(year, selectedPeriod);
    }
  };

  const handlePeriodChange = (e) => {
    const period = e.target.value;
    setSelectedPeriod(period);

    if (selectedYear) {
      generateDate(selectedYear, period);
    }
  };

  const generateDate = (year, period) => {
    let formattedDate = "";

    if (periodOptions.type === "semester") {
      if (period === "S1") {
        formattedDate = `${year}-06-30`;
      }
      if (period === "S2") {
        formattedDate = `${year}-12-31`;
      }
    } else if (periodOptions.type === "quarter") {
      if (period === "Q1") {
        formattedDate = `${year}-03-31`;
      }
      if (period === "Q2") {
        formattedDate = `${year}-06-30`;
      }
      if (period === "Q3") {
        formattedDate = `${year}-09-30`;
      }
      if (period === "Q4") {
        formattedDate = `${year}-12-31`;
      }
    } else if (periodOptions.type === "month") {
      const month = period;
      const lastDay = new Date(year, month, 0).getDate();
      formattedDate = `${year}-${month.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
    } else if (periodOptions.type === "bimonth") {
      const [startMonth, endMonth] = period.split("-");
      const lastDay = new Date(year, endMonth, 0).getDate();
      formattedDate = `${year}-${endMonth.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
    }

    updateField("date_arrete", formattedDate);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);

  return (
    <div className="bg-white flex justify-center rounded-lg shadow p-6 w-full">
      <div className="flex flex-col gap-3">

        <label className="text-xl font-bold text-sofiblue">
          Date d'arrêté
        </label>

        <p className="text-sm text-gray-500">
          Sélectionnez une année et une période ({frequency.toLowerCase()}).
        </p>

        <div className="flex gap-3">

          {/* Year */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md p-3 w-32 focus:outline-none focus:ring-2 focus:ring-sofiblue"
          >
            <option value="">Année</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Period */}
          <select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="border border-gray-300 rounded-md p-3 w-40 focus:outline-none focus:ring-2 focus:ring-sofiblue"
          >
            <option value="">{periodOptions.type === "month" ? "Mois" : periodOptions.type === "bimonth" ? "Période" : "Période"}</option>
            {periodOptions.periods.map((period, index) => (
              <option key={period} value={period}>
                {periodOptions.labels[index]}
              </option>
            ))}
          </select>

        </div>

        {formData.date_arrete && (
          <div className="mt-3 bg-sofiblue text-white rounded-md px-4 py-2 text-sm font-semibold w-fit">
            Date générée : {formData.date_arrete}
          </div>
        )}

      </div>
    </div>
  );
}

export default StepDate;