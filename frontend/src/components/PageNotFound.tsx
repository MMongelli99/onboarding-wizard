import { useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  return (
    <div className="text-center text-white p-8">
      <h1 className="text-3xl font-bold mb-4">404: Page Not Found</h1>
      <p className="text-gray-400">
        No match for <code>{location.pathname}</code>
      </p>
    </div>
  );
}
