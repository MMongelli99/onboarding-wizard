import { useState, useEffect } from "react";
import { createUser, getFormData } from "../services";

type Field =
  | "email_address"
  | "password"
  | "birthdate"
  | "address"
  | "about_me";

function FieldInput({ field }: { field: Field }) {
  const [value, setValue] = useState<string>("");
  return (
    <div className="mb-4">
      <p className="text-red-500 text-sm mb-1">
        Please enter a valid email address
      </p>
      <input
        type="email"
        placeholder="email address"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function WizardStep({
  title,
  description,
  fields = [],
}: {
  title?: string;
  description?: string;
  fields?: Field[];
}) {
  return (
    <div>
      {title && <h1 className="text-2xl font-semibold mb-2">{title}</h1>}
      {description && <p className="text-gray-400 mb-6">{description}</p>}
      <div className="space-y-4 mb-6">
        {fields.map((field, idx) => (
          <FieldInput key={idx} field={field} />
        ))}
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

type WizardSteps = {
  children:
    | React.ReactElement<typeof WizardStep>
    | React.ReactElement<typeof WizardStep>[];
};

export function Wizard({ children }: WizardSteps) {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      {children}
      <div className="flex items-center">
        <button className="px-6 py-2 rounded transition bg-blue-500 hover:bg-blue-600 text-white">
          Back
        </button>
        <div className="flex-grow" />
        <button
          className="px-6 py-2 rounded transition bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => console.log(canSubmit)}
        >
          Next
        </button>
      </div>
      <div className="mt-6">
        <ProgressBar width={50} />
      </div>
    </div>
  );
}

/*
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

function getWizardStepIndex(): number {
  return Number(localStorage.getItem("wizard_step") ?? 0);
}

function setWizardStepIndex(index: number): void {
  localStorage.setItem("wizard_step", String(index));
}

function getUserId(): number {
  return Number(localStorage.getItem("user_id"));
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
}: FormFieldConfig & {
  onValidityChange: (valid: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    getFormData({
      userId: userId,
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
  isFirstStep,
  isLastStep,
}: {
  title: string;
  description: string;
  fields: FormFieldConfig[];
  isFirstStep: boolean;
  isLastStep: boolean;
  onStepChange?: () => void;
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
  const userId = getUserId();

  function handleNext() {
    setWizardStepIndex(getWizardStepIndex() + 1);
    console.log(getWizardStepIndex());
  }

  function handleBack() {
    setWizardStepIndex(getWizardStepIndex() - 1);
    console.log(getWizardStepIndex());
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>

      <div className="space-y-4 mb-6">
        {fields.map((field, i) => (
          <FormField
            key={i}
            {...field}
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

function CreateWizard({ wizardSteps }: { wizardSteps: React.ReactElement[] }) {
  // const [wizardData, setWizardData] = useState<WizardData>(wizardDataInit);

  const [userId, setUserId] = useState<number | null>(null);

  const [wizardStepIndex, setWizardStepIndex] =
    useState<number>(getWizardStepIndex);

  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  ((step + 1) / orderedSteps.length) * 100}

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
      {wizardSteps[wizardStepIndex]}
      <div className="mt-6">
        <ProgressBar width={progressPercentage} />
      </div>
    </div>
  );
}

export default function Wizard() {
  const wizardSteps: React.ReactElement[] = [
    <WizardStep
      title="Credentials"
      description="Enter your credentials."
      isFirstStep={true}
      isLastStep={false}
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
    />,
    <WizardStep
      title="hi"
      description="yo"
      isFirstStep={false}
      isLastStep={true}
      fields={[]}
    />,
  ];

  return <CreateWizard wizardSteps={wizardSteps} />;
}
*/
