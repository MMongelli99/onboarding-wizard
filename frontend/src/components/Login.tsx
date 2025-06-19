type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Login({ onNext, onBack }: Props) {
  return (
    <div className="w-100">
      <h1 className="text-2xl font-semibold mb-2">Login</h1>
      <p className="text-gray-400 mb-6">Login to portal here.</p>

      <div className="space-y-3 mb-6">
        <input
          type="email"
          placeholder="your.email@website.com"
          className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="********"
          className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

      <div className="mt-6">
        <div className="w-full h-1 bg-gray-700 rounded">
          <div className="h-1 bg-blue-500 w-1/6 rounded" />
        </div>
      </div>
    </div>
  );
}
