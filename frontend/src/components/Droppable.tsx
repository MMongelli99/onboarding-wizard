import React from "react";
import { useDroppable } from "@dnd-kit/core";

type DroppableProps = {
  children: React.ReactNode;
};

export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
