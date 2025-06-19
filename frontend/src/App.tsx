import Wizard from "./components/Wizard";
import DataViewer from "./components/DatabaseViewer";
import AdminWizardConfig from "./components/Admin";

type Route = "/" | "/data" | "/admin";

const pages: Record<Route, React.ReactElement> = {
  "/": <Wizard />,
  "/data": <DataViewer />,
  "/admin": <AdminWizardConfig />,
};

export default function App() {
  const route = window.location.pathname;
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {pages[route] ?? <div className="p-8">404</div>}
    </div>
  );
}
