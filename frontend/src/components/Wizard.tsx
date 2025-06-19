import { useState } from "react";
import WizardStep from "./WizardStep";

export default function Wizard() {
  const [step, setStep] = useState(0);

  const handleNext = () =>
    setStep((currStep) =>
      currStep + 1 <= steps.length - 1 ? step + 1 : steps.length - 1,
    );
  const handleBack = () =>
    setStep((currStep) => (currStep - 1 >= 0 ? step - 1 : 0));

  function makeWizardStep(title, fields) {
    return (
      <WizardStep
        title={title}
        fields={fields}
        onNext={handleNext}
        onBack={handleBack}
      />
    );
  }

  const steps = [
    makeWizardStep("Step 1", ["username", "password"]),
    makeWizardStep("Step 2", ["birthdate"]),
  ];

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      {steps[step]}
    </div>
  );
}
