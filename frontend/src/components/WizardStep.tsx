type WizardStepKind =
  | "email_address"
  | "password"
  | "birthdate"
  | "address"
  | "about_me";

type Props = {
  fields: WizardStepKind[];
  onNext: () => void;
  onBack: () => void;
  formData: Record<string, string>;
  updateField: (field: string, value: string) => void;
  isFirstStep: boolean;
};

const getWizardSteps = (
  formData: Record<string, string>,
  updateField: (field: string, value: string) => void,
): Record<WizardStepKind, React.ReactElement> => ({
  email_address: (
    <div className="flex flex-col">
      <span className="m-2">Email</span>
      <input
        value={formData.email_address}
        onChange={(e) => updateField("email_address", e.target.value)}
        type="email"
        placeholder="your.email@website.com"
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  password: (
    <div className="flex flex-col">
      <span className="m-2">Password</span>
      <input
        value={formData.password}
        onChange={(e) => updateField("password", e.target.value)}
        type="password"
        placeholder="********"
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  address: (
    <div className="flex flex-col">
      <span className="m-2">Address</span>
      <input
        value={formData.address}
        onChange={(e) => updateField("address", e.target.value)}
        type="text"
        placeholder="address"
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  birthdate: (
    <div className="flex flex-col">
      <span className="m-2">Birthday</span>
      <input
        value={formData.birthdate}
        onChange={(e) => updateField("birthdate", e.target.value)}
        type="date"
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  about_me: (
    <div className="flex flex-col">
      <span className="m-2">About Me</span>
      <textarea
        value={formData.about_me ?? ""}
        onChange={(e) => updateField("about_me", e.target.value)}
        placeholder="Tell us about yourself..."
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
});

export default function WizardStep({
  fields,
  onNext,
  onBack,
  formData,
  updateField,
  isFirstStep,
}: Props) {
  const wizardSteps = getWizardSteps(formData, updateField);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Onboarding</h1>
      <p className="text-gray-400 mb-6">Please fill out the following.</p>
      <div className="space-y-3 mb-6">
        {fields.map((field, idx) => (
          <div key={`${field}-${idx}`}>{wizardSteps[field]}</div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        {!isFirstStep ? (
          <button onClick={onBack} className="text-gray-400 hover:text-white">
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
