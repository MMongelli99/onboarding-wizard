import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";

const Draggable = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-2 m-2 bg-blue-500 text-white rounded cursor-move"
    >
      {id}
    </div>
  );
};

const Droppable = ({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const bgColor = isOver ? "bg-green-300" : "bg-gray-500";

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] p-4 m-2 rounded border border-dashed border-gray-500 ${bgColor}`}
    >
      <p className="font-semibold mb-2">{id}</p>
      {children}
    </div>
  );
};

const Admin = () => {
  const [wizardSteps, setWizardSteps] = useState<Record<string, Set<string>>>(
    {},
  );

  const [components, setComponents] = useState<Array<string>>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/components")
      .then((res) => res.json())
      .then((data) => {
        const dbComponents = data;

        setComponents(
          dbComponents.reduce(
            (componentKinds, { kind }) => componentKinds.concat(kind),
            [],
          ),
        );

        const wizardSteps: Record<string, Set<string>> = dbComponents.reduce(
          (config, { kind, step }) => {
            if (!config[step]) {
              config[step] = new Set();
            }
            config[step].add(kind);
            return config;
          },
          {},
        );

        setWizardSteps(wizardSteps);
      })
      .catch((err) => console.error("Failed to fetch", err));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active) {
      const stepId = over.id;
      const componentId = active.id;

      setWizardSteps((prev) => {
        const updated = { ...prev };
        const currentSet = new Set(updated[stepId]);
        currentSet.add(componentId);
        updated[stepId] = currentSet;
        return updated;
      });
    }
  };

  return (
    <div className="p-8 min-h-screen text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <h2 className="text-2xl font-bold mb-4">
        Onboarding Wizard Configuration
      </h2>
      <p className="m-4">
        Please drag and drop the components to determine their position in the
        onboarding flow.
      </p>

      <h3 className="text-2xl mb-2">Components:</h3>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="m-4 flex space-x-8 mb-8">
          {components.map((component) => (
            <Draggable key={component} id={component} />
          ))}
        </div>

        <h3 className="text-2xl mb-2">Wizard Steps:</h3>
        <div className="m-4 flex space-x-8">
          {Object.entries(wizardSteps).map(([step, components]) => (
            <Droppable key={step} id={step}>
              {[...components].map((component, idx) => (
                <div
                  key={`${step}-${component}-${idx}`}
                  className="p-2 mb-2 bg-white text-black rounded shadow"
                >
                  {component}
                </div>
              ))}
            </Droppable>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Admin;
