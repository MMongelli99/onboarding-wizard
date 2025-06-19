type WizardStepKind = "username" | "password" | "birthdate" | "aboutme";

const wizardSteps: Record<WizardStepKind, React.ReactElement> = {
  username: (
    <div className="flex flex-col">
      <span className="m-2">Email</span>
      <input
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
        type="password"
        placeholder="********"
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  birthdate: (
    <div className="flex flex-col">
      <span className="m-2">Birthday</span>
      <input
        type="date"
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
  aboutme: (
    <div className="flex flex-col">
      <span className="m-2">About Me</span>
      <textarea
        placeholder="Tell us about yourself..."
        className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ),
};

type Props = {
  title: String;
  description: String;
  fields: WizardStepKind[];
  onNext: () => void;
  onBack: () => void;
};

export default function WizardStep({ title, fields, onNext, onBack }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">Please fill out the following.</p>

      <div className="space-y-3 mb-6">
        {fields.map((field, idx) => (
          <div key={`${field}-${idx}`}>{wizardSteps[field]}</div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          Back
        </button>
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
