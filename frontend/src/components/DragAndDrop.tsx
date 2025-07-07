import { useDraggable, useDroppable } from "@dnd-kit/core";

export function Draggable({
  displayName,
  id,
  disabled = false,
  data,
}: {
  displayName?: string;
  id: string;
  disabled?: boolean;
  data?: Record<string, unknown>;
}) {
  // an item which can be dragged into a Droppable container
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled,
    data: data,
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
      {displayName ?? ""}
    </div>
  );
}

export function Droppable({
  displayName,
  id,
  children,
}: {
  displayName?: string;
  id: string;
  children?: React.ReactNode;
}) {
  // a container into which draggable items can be dropped
  const { isOver, setNodeRef } = useDroppable({ id });
  const bgColor = isOver ? "bg-green-300" : "bg-gray-500";

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[90px] p-4 m-2 rounded border border-dashed border-gray-500 ${bgColor}`}
    >
      {displayName && <p className="font-semibold mb-2">{displayName}</p>}
      {children}
    </div>
  );
}
