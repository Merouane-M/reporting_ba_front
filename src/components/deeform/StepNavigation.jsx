function StepNavigation({ step, setStep, maxStep }) {
  const steps = ["Date", "S1000", "3001", "3002"];

  return (
    <div className="flex gap-2 mt-8 border-t pt-4">
      {steps.map((label, index) => (
        <button
          key={index}
          onClick={() => setStep(index)}
          className={`px-4 py-2 rounded-t-md text-sm font-semibold ${
            step === index
              ? "bg-sofiblue text-white"
              : "bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default StepNavigation;
