import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { getWizardComponents, updateWizardComponent } from "../services";

const Draggable = ({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled,
  });
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "move",
  };

  return (
    <div
      ref={setNodeRef}
      {...(!disabled ? listeners : {})}
      {...attributes}
      style={style}
      className="p-2 m-2 bg-blue-500 text-white rounded"
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
  const [slots, setSlots] = useState<Record<string, Set<string>>>({
    Components: new Set(),
    "Step 2": new Set(),
    "Step 3": new Set(),
  });

  useEffect(() => {
    getWizardComponents({
      onSuccess: (data) => {
        const initial: Record<string, Set<string>> = {
          Components: new Set(),
          "Step 2": new Set(),
          "Step 3": new Set(),
        };

        for (const { kind, step } of data as Array<{
          kind: string;
          step: number;
        }>) {
          if (step === 2) initial["Step 2"].add(kind);
          else if (step === 3) initial["Step 3"].add(kind);
          else initial["Components"].add(kind);
        }

        setSlots(initial);
      },
      onError: (errMsg) => {
        console.error("Failed to fetch components:", errMsg);
      },
    });
  }, []);

  const findContainer = (id: string) => {
    return (
      Object.entries(slots).find(([_, items]) => items.has(id))?.[0] ||
      "Components"
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active) return;

    const fromId = findContainer(active.id);
    const toId = over.id;

    if (fromId === toId) return;

    setSlots((prev) => {
      const updated = { ...prev };

      // Remove from old container
      updated[fromId] = new Set(
        [...updated[fromId]].filter((x) => x !== active.id),
      );

      // Add to new container
      updated[toId] = new Set([...updated[toId], active.id]);

      return updated;
    });

    // PATCH backend to update step field
    const newStep =
      toId === "Components" ? null : parseInt(toId.replace(/\D/g, ""), 10);

    updateWizardComponent({ kind: active.id, step: newStep }).catch((err) =>
      console.error("Failed to update step", err),
    );
  };

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
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-row space-x-12">
          {/* Components Area */}
          <div className="w-1/2">
            <h3 className="text-2xl mb-2">Components:</h3>
            <Droppable id="Components">
              {[...slots["Components"]].map((component) => (
                <Draggable key={component} id={component} />
              ))}
            </Droppable>
          </div>

          {/* Wizard Steps Area */}
          <div className="w-1/2">
            <h3 className="text-2xl mb-2">Wizard Steps:</h3>
            <div className="flex flex-col space-y-6">
              {["Step 2", "Step 3"].map((step) => (
                <Droppable key={step} id={step}>
                  {[...slots[step]].map((component) => {
                    const isOnlyOne = slots[step].size === 1;
                    return (
                      <Draggable
                        key={component}
                        id={component}
                        disabled={isOnlyOne}
                      />
                    );
                  })}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </DndContext>{" "}
    </div>
  );
};

export default Admin;
