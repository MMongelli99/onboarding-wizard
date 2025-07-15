import { useState, useContext, useEffect } from "react";
import { createUser, getFormData, updateUser } from "../services";
import {
  WizardContext,
  FieldInputValues,
  FieldInputValidities,
} from "../contexts/WizardContext";

type SimpleField = "email_address" | "password" | "birthdate" | "about_me";
type ComplexField = "address";
export type Field = SimpleField | ComplexField;

type FieldType = "text" | "textarea" | "email" | "password" | "date";

type FieldInitializer = {
  type: FieldType;
  placeholder?: string;
  errorMessage: string;
  isValid: (value: string) => boolean;
};

const fieldInitializers: Record<SimpleField, FieldInitializer> = {
  email_address: {
    type: "email",
    placeholder: "email address",
    errorMessage: "Please enter a valid email address",
    isValid: (value: string) => /\S+@\S+\.\S+/.test(value),
  },
  password: {
    type: "password",
    placeholder: "password",
    errorMessage: "Please enter a password",
    isValid: (value: string) => value !== "",
  },
  birthdate: {
    type: "date",
    errorMessage: "Please enter your date of birth",
    isValid: (value: string) => value !== "",
  },
  about_me: {
    type: "textarea",
    placeholder: "about you...",
    errorMessage: "Please tell us about yourself",
    isValid: (value: string) => value !== "",
  },
};

function FieldInput({ field }: { field: SimpleField }) {
  const context = useContext(WizardContext);
  if (!context) throw new Error("WizardContext not available");

  const {
    userId,
    fieldInputValues,
    setFieldInputValues,
    fieldInputValidities,
    setFieldInputValidities,
  } = context;

  const fieldInitializer = fieldInitializers[field];

  const [value, setValue] = useState<string>("");

  const [isValid, setIsValid] = useState<boolean>(
    fieldInitializer.isValid(value),
  );

  useEffect(() => {
    if (userId) {
      getFormData({
        userId: userId as number,
        onSuccess: (data) => {
          const storedValues = data as Record<string, unknown>;
          const storedValue = storedValues[field]
            ? String(storedValues[field])
            : "";
          const storedValidity = fieldInitializer.isValid(storedValue);
          setValue(storedValue);
          setIsValid(storedValidity);
          setFieldInputValues({
            ...fieldInputValues,
            [field]: storedValue,
          });
          setFieldInputValidities({
            ...fieldInputValidities,
            [field]: storedValidity,
          });
        },
        onError: (errMsg) => {
          console.log(`Failed to load data for "${field}" field:`, errMsg);
        },
      });
    }
  }, [userId]);

  function createFieldInputElement({
    fieldInitializer,
    valueInitializer,
  }: {
    fieldInitializer: FieldInitializer;
    valueInitializer: string;
  }) {
    function onChange(
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
      const updatedValue = event.target.value;
      const updatedValidity = fieldInitializer.isValid(updatedValue);
      setValue(updatedValue);
      setIsValid(updatedValidity);
      setFieldInputValues({
        ...fieldInputValues,
        [field]: updatedValue,
      });
      setFieldInputValidities({
        ...fieldInputValidities,
        [field]: updatedValidity,
      });
    }

    if (["email", "password", "text", "date"].includes(fieldInitializer.type)) {
      return (
        <input
          type={fieldInitializer.type}
          placeholder={fieldInitializer.placeholder}
          value={valueInitializer}
          onChange={onChange}
          className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }

    if (["textarea"].includes(fieldInitializer.type)) {
      return (
        <div className="flex flex-col">
          <span className="m-2">About Me</span>
          <textarea
            value={valueInitializer}
            onChange={onChange}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }
  }

  return (
    <div className="mb-4">
      {!isValid && (
        <p className="text-red-500 text-sm mb-1">
          {fieldInitializer.errorMessage}
        </p>
      )}
      {createFieldInputElement({ fieldInitializer, valueInitializer: value })}
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
  const context = useContext(WizardContext);

  if (!context) {
    throw new Error(
      "WizardContext is undefined. Make sure your component is wrapped in a <WizardContext.Provider>.",
    );
  }
  const { setFieldInputValues, setFieldInputValidities } = context;
  useEffect(() => {
    setFieldInputValues({});
    setFieldInputValidities({});
  }, []);
  return (
    <div>
      {title && <h1 className="text-2xl font-semibold mb-2">{title}</h1>}
      {description && <p className="text-gray-400 mb-6">{description}</p>}
      <div className="space-y-4 mb-6">
        {fields.map((field, idx) =>
          field === "address" ? (
            <div>hi</div>
          ) : (
            <FieldInput key={idx} field={field} />
          ),
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
          width: `${width * 100}%`,
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
  const wizardSteps = Array.isArray(children) ? children : [children];

  const [userId, setUserId] = useState<number | null>(null);

  const [wizardStepIndex, setWizardStepIndex] = useState<number | null>(0);

  const localStorageKeys = {
    userId: "user_id",
    wizardStepIndex: "wizard_step_index",
  };

  useEffect(() => {
    const storedUserId =
      localStorage.getItem(localStorageKeys.userId) !== null
        ? Number(localStorage.getItem(localStorageKeys.userId))
        : null;

    function createAndStoreUserId(): void {
      createUser()
        .then((res) => res.json())
        .then((data) => {
          const userId = data.id;
          localStorage.setItem(localStorageKeys.userId, userId);
          setUserId(userId);
        })
        .catch((err) => {
          console.error("Failed to create user:", err);
        });
    }

    if (storedUserId !== null) {
      getFormData({
        userId: storedUserId,
        onSuccess: () => {
          localStorage.setItem(localStorageKeys.userId, String(storedUserId));
          setUserId(storedUserId);
        },
        onError: () => {
          createAndStoreUserId();
        },
      });
    } else {
      createAndStoreUserId();
    }

    const storedWizardStepIndex =
      localStorage.getItem(localStorageKeys.wizardStepIndex) !== null
        ? Number(localStorage.getItem(localStorageKeys.wizardStepIndex))
        : null;

    console.log(storedWizardStepIndex);

    if (storedWizardStepIndex !== null) {
      setWizardStepIndex(
        Number(localStorage.getItem(localStorageKeys.wizardStepIndex)),
      );
    } else {
      localStorage.setItem(localStorageKeys.wizardStepIndex, String(0));
      setWizardStepIndex(0);
    }
  }, []);

  const [fieldInputValues, setFieldInputValues] = useState<FieldInputValues>(
    {},
  );

  const [fieldInputValidities, setFieldInputValidities] =
    useState<FieldInputValidities>({});

  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  useEffect(() => {
    setCanSubmit(
      Object.keys(fieldInputValidities).length === 0
        ? false
        : Object.values(fieldInputValidities).every(Boolean),
    );
  }, [fieldInputValidities]);

  return (
    <WizardContext.Provider
      value={{
        userId,
        setUserId,
        fieldInputValues,
        setFieldInputValues,
        fieldInputValidities,
        setFieldInputValidities,
        wizardStepIndex,
        setWizardStepIndex,
      }}
    >
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        {wizardSteps[wizardStepIndex as number]}
        <div className="flex items-center">
          {(wizardStepIndex as number) > 0 && (
            <button
              className="px-6 py-2 rounded transition bg-blue-500 hover:bg-blue-600 text-white"
              disabled={userId !== null && !canSubmit}
              onClick={() => {
                if (userId) {
                  const nonNullUserId = userId as number;
                  updateUser({ userId, updates: fieldInputValues });
                  localStorage.setItem(
                    localStorageKeys.wizardStepIndex,
                    String((wizardStepIndex as number) - 1),
                  );
                  setWizardStepIndex((wizardStepIndex as number) - 1);
                }
              }}
            >
              Back
            </button>
          )}
          <div className="flex-grow" />
          {(wizardStepIndex as number) < wizardSteps.length - 1 && (
            <button
              className={`px-6 py-2 rounded transition bg-blue-500 hover:bg-blue-600 ${
                canSubmit ? "text-white" : "text-gray-500"
              }`}
              disabled={userId !== null && !canSubmit}
              onClick={() => {
                if (userId) {
                  const nonNullUserId = userId as number;
                  updateUser({ userId, updates: fieldInputValues });
                  localStorage.setItem(
                    localStorageKeys.wizardStepIndex,
                    String((wizardStepIndex as number) + 1),
                  );

                  setWizardStepIndex((wizardStepIndex as number) + 1);
                }
              }}
            >
              Next
            </button>
          )}
        </div>
        <div className="mt-6">
          <ProgressBar
            width={((wizardStepIndex as number) + 1) / wizardSteps.length}
          />
        </div>
      </div>
    </WizardContext.Provider>
  );
}
