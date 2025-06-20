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
  const [step, setStep] = useState(0);
  const [stepsConfig, setStepsConfig] = useState<Record<number, string[]>>({});

  const orderedSteps = [1, 2, 3];
  const staticFirstStepFields = ["email_address", "password"];
  const currentStepKey = orderedSteps[step];
  const dynamicFields = stepsConfig[currentStepKey] || [];
  const fields = currentStepKey === 1 ? staticFirstStepFields : dynamicFields;

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) {
      setUserId(Number(storedId));
    }
  }, []);

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

  const setFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const persistFields = (fields: string[]) => {
    if (!userId) return;
    const updates: Record<string, string> = {};
    for (const field of fields) {
      updates[field] = formData[field];
    }

    fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
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
      fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: "", password: "" }),
      })
        .then((res) => res.json())
        .then((data) => {
          const newId = data.id;
          setUserId(newId);
          localStorage.setItem("user_id", String(newId));

          fetch(`http://127.0.0.1:5000/api/users/${newId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          }).then(() => {
            setStep((prev) => Math.min(prev + 1, orderedSteps.length - 1));
          });
        });
    } else {
      persistFields(fields);
      setStep((prev) => Math.min(prev + 1, orderedSteps.length - 1));
    }
  };
  const handleBack = () => {
    persistFields(fields);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <WizardStep
        fields={fields}
        onNext={handleNext}
        onBack={handleBack}
        formData={formData}
        updateField={setFormField}
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
