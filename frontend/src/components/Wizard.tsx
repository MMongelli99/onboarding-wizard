import { useState, useEffect } from "react";
import { createUser, getFormData } from "../services";

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type WizardData = {
  email_address: string;
  password: string;
  birthdate: string;
  address: Address;
  about_me: string;
};

const addressInit = { street: "", city: "", state: "", zip: "" };

const wizardDataInit = {
  email_address: "",
  password: "",
  birthdate: "",
  address: addressInit,
  about_me: "",
};

function getWizardStepNumber(): number {
  return Number(localStorage.getItem("wizard_step") ?? 1);
}

type FieldType = "email" | "text" | "password";

type FormFieldConfig = {
  type: FieldType;
  placeholder: string;
  dbFieldName: keyof WizardData;
  errorMessage: string;
  validate: (val: string) => boolean;
};

function FormField({
  type,
  placeholder,
  dbFieldName,
  errorMessage,
  validate,
  onValidityChange,
  userId,
}: FormFieldConfig & {
  onValidityChange: (valid: boolean) => void;
  userId: number;
}) {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    getFormData({
      userId,
      onSuccess: (data: unknown) => {
        const userData = data as WizardData;
        const dbValue: string = (userData[dbFieldName] ?? "") as string;
        setValue(dbValue);
        const isValid = validate(dbValue);
        setInvalid(!isValid);
        onValidityChange(isValid);
      },
      onError: (msg) => {
        console.error("Failed to load user data:", msg);
      },
    });
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    const isValid = validate(val);
    setInvalid(!isValid);
    onValidityChange(isValid);
  };

  return (
    <div className="mb-4">
      {invalid && <p className="text-red-500 text-sm mb-1">{errorMessage}</p>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function WizardStep({
  title,
  description,
  fields,
  handleBack,
  handleNext,
  isFirstStep,
  isLastStep,
  userId,
}: {
  title: string;
  description: string;
  fields: FormFieldConfig[];
  isFirstStep: boolean;
  isLastStep: boolean;
  handleBack?: () => void;
  handleNext?: () => void;
  userId: number;
}) {
  const [fieldValidities, setFieldValidities] = useState<boolean[]>(
    Array(fields.length).fill(false),
  );

  const updateFieldValidity = (index: number, isValid: boolean) => {
    setFieldValidities((prev) => {
      const updated = [...prev];
      updated[index] = isValid;
      return updated;
    });
  };

  const allValid = fieldValidities.every(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>

      <div className="space-y-4 mb-6">
        {fields.map((field, i) => (
          <FormField
            key={i}
            {...field}
            userId={userId}
            onValidityChange={(v) => updateFieldValidity(i, v)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        {!isFirstStep && (
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white"
          >
            Back
          </button>
        )}
        {!isLastStep && (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded transition bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!allValid}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ width }: { width: number }) {
  return (
    <div className="w-full h-1 bg-gray-700 rounded">
      <div
        className="h-1 bg-blue-500 rounded transition-all duration-300"
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  );
}

export default function Wizard() {
  const [wizardData, setWizardData] = useState<WizardData>(wizardDataInit);

  const [userId, setUserId] = useState<number | null>(null);

  const [wizardStepNumber, setWizardStepNumber] =
    useState<number>(getWizardStepNumber);

  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  /*((step + 1) / orderedSteps.length) * 100}*/

  useEffect(() => {
    const existingUserId = localStorage.getItem("user_id");
    if (existingUserId) {
      setUserId(Number(existingUserId));
    } else {
      // Create user if not already in localStorage
      createUser()
        .then((res) => res.json())
        .then((data) => {
          const userId = data.id;
          localStorage.setItem("user_id", userId);
          setUserId(userId);
        })
        .catch((err) => {
          console.error("Failed to create user:", err);
        });
    }
  }, []);

  if (userId === null) {
    return <p className="text-white">Loading form...</p>;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <WizardStep
        title="Credentials"
        description="Enter your credentials."
        isFirstStep={true}
        isLastStep={true}
        handleNext={() => console.log("next")}
        userId={userId}
        fields={[
          {
            type: "email",
            placeholder: "Email address",
            dbFieldName: "email_address",
            errorMessage: "Please enter a valid email",
            validate: (val) => /\S+@\S+\.\S+/.test(val),
          },
          {
            type: "password",
            placeholder: "Password",
            dbFieldName: "password",
            errorMessage: "Please enter a password",
            validate: (val) => val.length > 0,
          },
        ]}
      />
      <div className="mt-6">
        <ProgressBar width={progressPercentage} />
      </div>
    </div>
  );
}
