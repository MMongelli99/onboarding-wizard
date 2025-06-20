import { useState, useEffect } from "react";
import WizardStep from "./WizardStep";

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [stepsConfig, setStepsConfig] = useState<Record<number, string[]>>({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/components")
      .then((res) => res.json())
      .then((data) => {
        const steps: Record<number, string[]> = {};
        for (const { kind, step } of data) {
          if (step === null) continue;
          if (!steps[step]) steps[step] = [];
          steps[step].push(kind);
        }
        setStepsConfig(steps);
      });
  }, []);

  const orderedSteps = [1, 2, 3]; // Always include step 1
  const currentStepKey = orderedSteps[step];

  const staticFirstStepFields = ["username", "password"];
  const dynamicFields = stepsConfig[currentStepKey] || [];
  const fields = currentStepKey === 1 ? staticFirstStepFields : dynamicFields;

  const handleNext = () =>
    setStep((prev) => Math.min(prev + 1, orderedSteps.length - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <WizardStep fields={fields} onNext={handleNext} onBack={handleBack} />
      <div className="mt-6">
        <div className="w-full h-1 bg-gray-700 rounded">
          <div
            className="h-1 bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${((step + 1) / orderedSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
