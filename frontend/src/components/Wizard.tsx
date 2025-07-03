import { useState, useEffect } from "react";
import WizardStep from "./WizardStep";
import {
  getFormData,
  getWizardComponents,
  updateUser,
  setCredentials,
} from "../services";

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type FormData = {
  email_address: string;
  password: string;
  birthdate: string;
  address: Address;
  about_me: string;
};

export default function Wizard() {
  const [formData, setFormData] = useState<FormData>({
    email_address: "",
    password: "",
    birthdate: "",
    address: { street: "", city: "", state: "", zip: "" },
    about_me: "",
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [step, setStep] = useState(() => {
    const stored = localStorage.getItem("wizard_step");
    return stored ? Number(stored) : 0;
  });

  const [stepsConfig, setStepsConfig] = useState<Record<number, string[]>>({});
  const [complete, setComplete] = useState(false);

  const orderedSteps = [1, 2, 3];
  const currentStepKey = orderedSteps[step];
  const staticFirstStepFields = ["email_address", "password"];
  const dynamicFields = stepsConfig[currentStepKey] || [];
  const fields = currentStepKey === 1 ? staticFirstStepFields : dynamicFields;

  const goToStep = (stepIndex: number) => {
    localStorage.setItem("wizard_step", String(stepIndex));
    setStep(stepIndex);
  };

  const populateForm = (data: any) => {
    setFormData({
      email_address: data.email_address || "",
      password: data.password || "",
      birthdate: data.birthdate || "",
      address: data.address || { street: "", city: "", state: "", zip: "" },
      about_me: data.about_me || "",
    });
  };

  const syncFormWithDB = (handler?: () => void) => {
    if (!userId) return;

    const updates: Record<string, string> = {
      email_address: formData.email_address,
      password: formData.password,
      birthdate: formData.birthdate,
      address: JSON.stringify(formData.address),
      about_me: formData.about_me,
    };

    updateUser({ userID: userId, updates })
      .then(() => {
        getFormData({
          newUserID: userId,
          onSuccess: populateForm,
          onError: (err) => console.error("Failed to reload", err),
        });
        handler?.();
      })
      .catch((err) => console.error("Update failed", err));
  };

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) {
      const id = Number(storedId);
      setUserId(id);
      getFormData({
        newUserID: id,
        onSuccess: populateForm,
        onError: (err) => console.error("Failed to load form data", err),
      });
    } else {
      setCredentials({ email_address: "", password: "" })
        .then((res) => res.json())
        .then((data) => {
          const newId = data.id;
          setUserId(newId);
          localStorage.setItem("user_id", String(newId));
          updateUser({
            userID: newId,
            updates: {
              address: JSON.stringify({
                street: "",
                city: "",
                state: "",
                zip: "",
              }),
            },
          });
        });
    }
  }, []);

  useEffect(() => {
    getWizardComponents({
      onSuccess: (data) => {
        const steps: Record<number, string[]> = {};
        for (const { kind, step } of data) {
          if (step === null) continue;
          if (!steps[step]) steps[step] = [];
          steps[step].push(kind);
        }
        setStepsConfig(steps);
      },
      onError: (errMsg) => console.error(errMsg),
    });
  }, []);

  const setFormField = (
    field: keyof FormData,
    value: string,
    subfield?: keyof Address,
  ) => {
    setFormData((prev) => {
      if (field === "address" && subfield) {
        return {
          ...prev,
          address: { ...prev.address, [subfield]: value },
        };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const handleNext = () => {
    syncFormWithDB(() => {
      if (step + 1 < orderedSteps.length) {
        goToStep(step + 1);
      } else {
        setComplete(true);
        localStorage.removeItem("wizard_step");
      }
    });
  };

  const handleBack = () => {
    syncFormWithDB(() => {
      goToStep(Math.max(step - 1, 0));
    });
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
