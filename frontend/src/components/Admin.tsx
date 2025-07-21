import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { getWizardComponents, updateWizardComponent } from "../services";

type WizardStep = {
  step: number;
  title: string;
};

type WizardComponent = {
  step: number;
  kind: string;
};

function ComponentDraggable({
  wizardComponent,
  disabled,
}: {
  wizardComponent: WizardComponent;
  disabled: boolean;
}) {
  const { step, kind } = wizardComponent;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: kind,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return disabled ? (
    <button
      key={kind}
      className="text-gray-500 bg-gray-300 my-1"
      disabled={true}
    >
      {kind}
    </button>
  ) : (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      key={kind}
      className="text-white bg-gray-300 my-1"
      style={style}
    >
      {kind}
    </button>
  );
}

function StepDroppable({
  wizardStep,
  children,
}: {
  wizardStep: WizardStep;
  children:
    | React.ReactElement<typeof ComponentDraggable>
    | React.ReactElement<typeof ComponentDraggable>[];
}) {
  const { step, title } = wizardStep;
  const { setNodeRef } = useDroppable({ id: step });
  return (
    <div
      ref={setNodeRef}
      key={title}
      className={`${title === "Unused" ? "bg-gray-600" : "bg-gray-800"} rounded-lg p-5 m-3 h-64 w-48`}
    >
      <span className="text-3xl font-semibold">{title}</span>
      <div className="mt-4">{children} </div>
    </div>
  );
}

export default function Admin() {
  const steps: WizardStep[] = [
    { step: -1, title: "Unused" },
    { step: 2, title: "Step 2" },
    { step: 3, title: "Step 3" },
  ];

  const [wizardComponents, setWizardComponents] = useState<WizardComponent[]>([
    { step: -1, kind: "birthdate" },
    { step: -1, kind: "address" },
    { step: -1, kind: "about_me" },
  ]);

  useEffect(() => {
    getWizardComponents({
      onSuccess: (data) => {
        const storedValues = (data as Record<string, unknown>[]).map(
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const kind = active.id as string;
    const updatedStep = over.id as number;

    updateWizardComponent({ step: updatedStep, kind });

    setWizardComponents(
      wizardComponents.map(({ step: s, kind: k }) =>
        kind === k ? { step: updatedStep, kind: k } : { step: s, kind: k },
      ),
    );
  }

  return (
    <div className="flex-col">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <span>
          Configure the onboarding wizard by dragging the components below into
          their desired steps in the workflow.
        </span>
        <br />
        <span>Unused components will not appear in the wizard.</span>
      </div>
      <div className="flex">
        <DndContext onDragEnd={handleDragEnd}>
          {steps.map((wizardStep, i) => (
            <StepDroppable key={i} wizardStep={wizardStep}>
              {wizardComponents
                .filter(
                  (wizardComponent) => wizardStep.step === wizardComponent.step,
                )
                .map((wizardComponent, j) => (
                  <ComponentDraggable
                    key={j}
                    wizardComponent={wizardComponent}
                    disabled={
                      wizardStep.step !== -1 &&
                      wizardComponents.filter(
                        (wizardComponent) =>
                          wizardStep.step === wizardComponent.step,
                      ).length === 1
                    }
                  />
                ))}
            </StepDroppable>
          ))}
        </DndContext>
      </div>
    </div>
  );
}
