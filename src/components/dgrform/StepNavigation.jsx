function StepNavigationDGR({ step, setStep, beneficiairesCount }) {
  // Build dynamic steps
  const steps = [
    "Date",
    "MOD G1000",
    ...Array.from(
      { length: beneficiairesCount },
      (_, i) => `MOD G2000 -${i + 1}`
    ),
  ];

  return (
    <div className="flex gap-2 mt-8 border-t pt-4 flex-wrap">
      {steps.map((label, index) => (
        <button
          key={index}
          onClick={() => setStep(index)}
          className={`px-4 py-2 rounded-t-md text-sm font-semibold transition ${
            step === index
              ? "bg-sofiblue text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default StepNavigationDGR;
