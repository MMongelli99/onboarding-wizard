import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import DatabaseViewer from "./components/DatabaseViewer";
import Admin from "./components/Admin";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 px-6 py-4 shadow-md flex space-x-4">
          <Link to="/" className="!text-white">
            Onboarding
          </Link>
          <Link to="/data" className="!text-white">
            Data
          </Link>
          <Link to="/admin" className="!text-white">
            Admin
          </Link>
        </nav>
        <div className="flex justify-center p-6">
          <Routes>
            <Route path="/" element={<div>wizard</div>} />
            <Route path="/data" element={<DatabaseViewer />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
