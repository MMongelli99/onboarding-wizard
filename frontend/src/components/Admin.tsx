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
  const [slots, setSlots] = useState<Record<string, Set<string>>>({
    Components: new Set(),
    "Step 2": new Set(),
    "Step 3": new Set(),
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/components")
      .then((res) => res.json())
      .then((data) => {
        const initial: Record<string, Set<string>> = {
          Components: new Set(),
          "Step 2": new Set(),
          "Step 3": new Set(),
        };

        for (const { kind, step } of data) {
          if (step === 2) initial["Step 2"].add(kind);
          else if (step === 3) initial["Step 3"].add(kind);
          else initial["Components"].add(kind);
        }

        setSlots(initial);
      })
      .catch((err) => console.error("Failed to fetch", err));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active) return;

    const draggedId = active.id as string;
    const destination = over.id as string;

    // Remove draggedId from all slots
    const updated: Record<string, Set<string>> = {};
    for (const [slotName, items] of Object.entries(slots)) {
      updated[slotName] = new Set(
        [...items].filter((item) => item !== draggedId),
      );
    }

    // Add it to the new destination
    updated[destination].add(draggedId);
    setSlots(updated);
  };

  return (
    <div className="p-8 min-h-screen text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <h2 className="text-2xl font-bold mb-4">
        Onboarding Wizard Configuration
      </h2>
      <p className="m-4">
        Drag and drop components between "Components" and Wizard Steps.
      </p>
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
                  {[...slots[step]].map((component) => (
                    <Draggable key={component} id={component} />
                  ))}
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
