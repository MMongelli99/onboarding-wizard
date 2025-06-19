import React, { useState } from "react";
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
  const [slots, setSlots] = useState<Record<string, string[]>>({
    "2nd Step": [],
    "3rd Step": [],
  });

  const items = ["Birthday", "Address", "About Me"];

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over) {
      setSlots((prev) => {
        const updated = { ...prev };
        updated[over.id] = [...updated[over.id], active.id];
        return updated;
      });
    }
  };

  return (
    <div className="p-8 min-h-screen">
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
          {items.map((item) => (
            <Draggable key={item} id={item} />
          ))}
        </div>

        <h3 className="text-2xl mb-2">Wizard Steps:</h3>
        <div className="m-4 flex space-x-8">
          {Object.entries(slots).map(([slotName, slotItems]) => (
            <Droppable key={slotName} id={slotName}>
              {slotItems.map((item, idx) => (
                <div
                  key={`${slotName}-${item}-${idx}`}
                  className="p-2 mb-2 bg-white text-black rounded shadow"
                >
                  {item}
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
