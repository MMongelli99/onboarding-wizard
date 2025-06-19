import { useState } from "react";
import Wizard from "./components/Wizard";
import DataViewer from "./components/DatabaseViewer";
import Admin from "./components/Admin";

const routes = {
  "/": <Wizard />,
  "/data": <DataViewer />,
  "/admin": <Admin />,
} as const;

export default function App() {
  const [route, setRoute] = useState(
    window.location.pathname as keyof typeof routes,
  );

  const navigate = (path: keyof typeof routes) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-6 py-4 shadow-md flex space-x-4">
        <button onClick={() => navigate("/")} className="hover:text-blue-400">
          Onboarding
        </button>
        <button
          onClick={() => navigate("/data")}
          className="hover:text-blue-400"
        >
          Data
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="hover:text-blue-400"
        >
          Admin
        </button>
      </nav>

      <div className="flex justify-center p-6">
        {routes[route] ?? <div>404: Page Not Found</div>}
      </div>
    </div>
  );
}
