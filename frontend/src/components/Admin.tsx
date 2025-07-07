import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { getWizardComponents, updateWizardComponent } from "../services";

export default function Admin() {
  type WizardSteps = Record<
    number, // wizard step number
    string[] // components present in step of wizard
  >;
  const wizardStepsInit = {
    0: [] as string[], // unused components
  };
  const [wizardSteps, setWizardSteps] = useState<WizardSteps>(wizardStepsInit);

  // get wizard steps configuration from db
  useEffect(() => {
    function handleSuccess(data: unknown) {
      setWizardSteps(
        (data as { kind: string; step: number }[]).reduce(
          (acc: WizardSteps, { kind, step }) => {
            const componentName = kind;
            const wizardStepNumber = step;
            if (!acc[wizardStepNumber]) acc[wizardStepNumber] = [];
            // prevent duplicates
            acc[wizardStepNumber].push(componentName);
            acc[wizardStepNumber] = [...new Set(acc[wizardStepNumber])];
            return acc;
          },
          wizardStepsInit,
        ),
      );
    }
    getWizardComponents({
      onSuccess: handleSuccess,
      onError: (errMsg) => {
        console.error("Failed to fetch wizard components:", errMsg);
      },
    });
  }, []);

  return (
    <div className="p-8 min-h-screen text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <h2 className="text-2xl font-bold mb-4">
        Onboarding Wizard Configuration
      </h2>
      <ul>
        <li className="m-4">
          • Drag and drop components between steps of the onboarding wizard.
        </li>
        <li className="m-4">
          • Omit a component from the wizard by leaving it in the "Components"
          area.
        </li>
        <li className="m-4">
          • Each step of the wizard must have one component.
        </li>
      </ul>
      <p>{JSON.stringify(wizardSteps)}</p>
    </div>
  );
}
