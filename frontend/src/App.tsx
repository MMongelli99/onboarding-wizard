import Wizard from "./components/Wizard";
import DataViewer from "./components/DatabaseViewer";

type Route = "/" | "/data";

const pages: Record<Route, React.ReactElement> = {
  "/": <Wizard />,
  "/data": <DataViewer />,
};

export default function App() {
  const route = window.location.pathname;
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {pages[route]}
    </div>
  );
}
