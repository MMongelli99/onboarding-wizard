import { useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { getWizardComponents, updateWizardComponent } from "../services";

type WizardStep = {
  step: number;
  title: string;
};

type WizardComponent = {
  step: number;
  kind: string;
};

export default function Admin() {
  const steps: WizardStep[] = [
    { step: -1, title: "Unused" },
    { step: 2, title: "Step 2" },
    { step: 3, title: "Step 3" },
  ];

  const [wizardComponents, setWizardComponents] = useState<
    Array<WizardComponent>
  >([
    { step: -1, kind: "birthdate" },
    { step: -1, kind: "address" },
    { step: -1, kind: "about_me" },
  ]);

  useEffect(() => {
    getWizardComponents({
      onSuccess: (data) => {
        const storedValues = (data as Array<Record<string, unknown>>).map(
          (component) => {
            const step = component.step as number;
            const kind = component.kind as string;
            return { step, kind };
          },
        );
        setWizardComponents(storedValues);
      },
      onError: (errMsg) => {
        console.error("Failed to load wizard components:", errMsg);
      },
    });
  }, []);

  return (
    <div className="flex-col">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <span>
          Configure the onboarding wizard by dragging the components below into
          their desired steps in the workflow.{" "}
        </span>
        <br />
        <span>Unused components will not appear in the wizard.</span>
      </div>
      <div className="flex">
        {steps.map(({ step: stepI, title }, i) => (
          <div
            key={title}
            className={`${title === "Unused" ? "bg-gray-600" : "bg-gray-800"} rounded-lg p-5 m-3 h-64 w-48`}
          >
            <span className="text-3xl font-semibold">{title}</span>
            <div className="mt-4">
              {wizardComponents.map(
                ({ step: stepJ, kind }, j) =>
                  stepI === stepJ && (
                    <button key={kind} className="text-white bg-gray-300 my-1">
                      {kind}
                    </button>
                  ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
