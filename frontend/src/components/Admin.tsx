import { useState, useEffect } from "react";
import { Draggable, Droppable } from "./DragAndDrop";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { getWizardComponents, updateWizardComponent } from "../services";

export default function Admin() {
  return <div>admin</div>;
}

/*
type wizardComponentData = { wizardStepNumber: string };

export default function Admin() {
  type WizardStepsConfig = Record<
    string, // wizard step number
    string[] // components present in step of wizard
  >;
  const unusedComponentsKey = -1;
  const wizardStepsConfigInit = {
    [unusedComponentsKey]: [] as string[], // unused components
  };
  const [wizardStepsConfig, setWizardStepsConfig] = useState<WizardStepsConfig>(
    wizardStepsConfigInit,
  );

  // get wizard steps configuration from db
  useEffect(() => {
    function handleSuccess(data: unknown) {
      console.log("wizard steps config:", wizardStepsConfig);
      const updatedWizardStepsConfig = (data as { kind: string; step: number }[]).reduce(
          (acc: WizardStepsConfig, { kind, step }) => {
            const componentName = kind;
            const wizardStepNumber = step;
            if (!acc[wizardStepNumber]) acc[wizardStepNumber] = [];
            // prevent duplicates
            acc[wizardStepNumber].push(componentName);
            acc[wizardStepNumber] = [...new Set(acc[wizardStepNumber])];
            return acc;
          },
          wizardStepsConfigInit,
        );
      console.log("updated wizard steps config:", updatedWizardStepsConfig);
      setWizardStepsConfig(updatedWizardStepsConfig);
    }
    getWizardComponents({
      onSuccess: handleSuccess,
      onError: (errMsg) => {
        console.error("Failed to fetch wizard components:", errMsg);
      },
    });
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const {
      active, // active item being dragged
      over, // area item has been dropped over
    } = event;
    if (!over || !active) return;

    const draggedComponentName = String(active.id);

    // wizard step numbers
    const fromStep = (active.data.current as unknown as wizardComponentData)
      .wizardStepNumber;
    const toStep = String(over.id);

    if (fromStep === toStep) return;

    setWizardStepsConfig((prev: WizardStepsConfig) => {
      const updated = { ...prev };

      // remove component from previous wizard step
      updated[fromStep] = updated[fromStep].filter(
        (componentName) => componentName !== draggedComponentName,
      );

      // add component to new wizard step
      updated[toStep] = [
        ...new Set([...(updated[toStep] ?? []), draggedComponentName]),
      ];

      return updated;
    });

    updateWizardComponent({
      kind: draggedComponentName,
      step: Number(toStep),
    }).catch((err) => console.error("Failed to update step", err));
  }

  return (
    <div className="p-8 min-h-screen text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <h2 className="text-2xl font-bold mb-4">
        Onboarding Wizard Configuration
      </h2>
      <ul>
        <li className="m-4">
          &bull; Drag and drop components between steps of the onboarding
          wizard.
        </li>
        <li className="m-4">
          &bull; Omit a component from the wizard by leaving it in the
          "Components" area.
        </li>
        <li className="m-4">
          &bull; Each step of the wizard must have one component.
        </li>
      </ul>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-row space-x-12">
          <div className="w-1/2">
            <h3 className="text-2xl mb-2">Wizard Components:</h3>
            <div className="flex flex-col space-y-6">
              <Droppable id={String(unusedComponentsKey)}>
                {[
                  ...wizardStepsConfig[unusedComponentsKey].map(
                    (componentName) => (
                      <Draggable
                        displayName={componentName}
                        key={componentName}
                        id={componentName}
                        data={
                          {
                            wizardStepNumber: String(unusedComponentsKey),
                          } as wizardComponentData
                        }
                      ></Draggable>
                    ),
                  ),
                ]}
              </Droppable>
            </div>
          </div>
          <div className="w-1/2">
            <h3 className="text-2xl mb-2">Wizard Steps:</h3>
            <div className="flex flex-col space-y-6">
              {Object.keys(wizardStepsConfig).map((wizardStepNumber) => {
                if (Number(wizardStepNumber) === unusedComponentsKey) return;
                return (
                  <Droppable
                    displayName={`Step ${wizardStepNumber}`}
                    key={wizardStepNumber}
                    id={wizardStepNumber}
                  >
                    {[...wizardStepsConfig[wizardStepNumber]].map(
                      (componentName) => {
                        const isOnlyComponentInWizardStep =
                          wizardStepsConfig[wizardStepNumber].length === 1;
                        return (
                          <Draggable
                            displayName={componentName}
                            key={componentName}
                            id={componentName}
                            disabled={isOnlyComponentInWizardStep}
                            data={
                              {
                                wizardStepNumber: wizardStepNumber,
                              } as wizardComponentData
                            }
                          ></Draggable>
                        );
                      },
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
*/
