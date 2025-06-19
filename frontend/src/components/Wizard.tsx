import { useState } from "react";
import Login from "./Login";

export default function Wizard() {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step + 1);

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      {step === 1 && <Login onNext={handleNext} onBack={handleBack} />}
    </div>
  );
}
