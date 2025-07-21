import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PageNotFound from "./components/PageNotFound";
import DatabaseViewer from "./components/DatabaseViewer";
import Admin from "./components/Admin";
import { Wizard, WizardStep, Field } from "./components/Wizard";
import { getWizardComponents } from "./services";

type WizardComponent = {
  id: number;
  kind: string;
  step: number;
};

type WizardSteps = Record<string, string[]>;

function OnboardingWizard() {
  const [wizardComponents, setWizardComponents] = useState<WizardComponent[]>(
    [],
  );
  useEffect(() => {
    getWizardComponents({
      onSuccess: (data: unknown) => {
        setWizardComponents(data as WizardComponent[]);
      },
      onError: (errMsg) => {
        console.error();
      },
    });
  }, []);
  const wizardSteps: WizardSteps = wizardComponents.reduce(
    (wizardSteps, wizardComponent) => {
      const stepKey = String(wizardComponent.step);

      if (stepKey in wizardSteps) {
        wizardSteps[stepKey].push(wizardComponent.kind);
      } else {
        wizardSteps[stepKey] = [wizardComponent.kind];
      }

      return wizardSteps;
    },
    {} as WizardSteps,
  );
  return wizardComponents.length ? (
    <Wizard>
      {[
        <WizardStep
          title="Start Onboarding"
          description="Please set your credentials."
          fields={["email_address", "password"]}
        />,
        ...Object.entries(wizardSteps)
          .filter(([step, kinds]) => Number(step) !== -1)
          .map(([step, kinds]) => (
            <WizardStep
              key={step}
              title={`Step ${step}`}
              description="Please fill out the following fields."
              fields={kinds as Field[]}
            />
          )),
        <WizardStep
          title="Onboarding Complete!"
          description={`We've received all your info! 
                      You may go Back if you wish to edit any fields.`}
        />,
      ]}
    </Wizard>
  ) : (
    <p>Loading onboarding wizard...</p>
  );
}

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
            <Route path="/" element={<OnboardingWizard />} />
            <Route path="/data" element={<DatabaseViewer />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
