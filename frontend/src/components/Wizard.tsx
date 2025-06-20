import { useState, useEffect } from "react";
import WizardStep from "./WizardStep";

export default function Wizard() {
  const [formData, setFormData] = useState({
    email_address: "",
    password: "",
    birthdate: "",
    address: "",
    about_me: "",
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [step, setStep] = useState(() => {
    const stored = localStorage.getItem("wizard_step");
    return stored ? Number(stored) : 0;
  });

  const [stepsConfig, setStepsConfig] = useState<Record<number, string[]>>({});
  const [complete, setComplete] = useState(false);

  const goToStep = (stepIndex: number) => {
    localStorage.setItem("wizard_step", String(stepIndex));
    setStep(stepIndex);
  };

  const orderedSteps = [1, 2, 3];
  const currentStepKey = orderedSteps[step];
  const staticFirstStepFields = ["email_address", "password"];
  const dynamicFields = stepsConfig[currentStepKey] || [];
  const fields = currentStepKey === 1 ? staticFirstStepFields : dynamicFields;

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) {
      setUserId(Number(storedId));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:10000/api/components")
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

  const setFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const persistFields = (fields: string[]) => {
    if (!userId) return;
    const updates: Record<string, string> = {};
    for (const field of fields) {
      updates[field] = formData[field];
    }

    fetch(`http://localhost:10000/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch((err) => console.error("Failed to update fields", err));
  };

  const handleNext = () => {
    const updates: Record<string, string> = {};
    for (const field of fields) {
      updates[field] = formData[field];
    }

    if (!userId) {
      fetch("http://localhost:10000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: "", password: "" }),
      })
        .then((res) => res.json())
        .then((data) => {
          const newId = data.id;
          setUserId(newId);
          localStorage.setItem("user_id", String(newId));
          fetch(`http://localhost:10000/api/users/${newId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          }).then(() => {
            if (step + 1 < orderedSteps.length) {
              goToStep(step + 1);
            } else {
              setComplete(true);
              localStorage.removeItem("wizard_step");
            }
          });
        });
    } else {
      persistFields(fields);
      if (step + 1 < orderedSteps.length) {
        goToStep(step + 1);
      } else {
        setComplete(true);
        localStorage.removeItem("wizard_step");
      }
    }
  };

  const handleBack = () => {
    persistFields(fields);
    goToStep(Math.max(step - 1, 0));
  };

  if (complete) {
    return (
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Onboarding Complete</h1>
        <p className="text-gray-400 mb-6">Thank you for your submission.</p>

        <button
          onClick={() => {
            goToStep(orderedSteps.length - 1);
            setComplete(false);
          }}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <WizardStep
        fields={fields}
        onNext={handleNext}
        onBack={handleBack}
        formData={formData}
        updateField={setFormField}
        isFirstStep={step === 0}
      />
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
