import React from "react";
import { useDroppable } from "@dnd-kit/core";

type DroppableProps = {
  id: string;
  children: React.ReactNode;
};

export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      className="bg-gray-800 p-8 rounded-xl shadow-lg w-full"
      ref={setNodeRef}
      style={style}
    >
      {props.children}
    </div>
  );
}
