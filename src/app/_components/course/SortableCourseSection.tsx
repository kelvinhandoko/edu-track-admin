import React, { type MouseEvent, useState, type FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";

interface IProps {
  data: Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>;
  id: UniqueIdentifier;
  onClick: () => void;
}

const SortAbleCourseSection: FC<IProps> = ({ data, id, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `${id}`,
      transition: {
        duration: 150, // milliseconds
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Extend listeners with mouse down and up events
  const extendedListeners = {
    ...listeners,
    onMouseDown: (e: MouseEvent<HTMLButtonElement>) => {
      setIsGrabbing(true);
      if (listeners?.onMouseDown) listeners.onMouseDown(e);
    },
    onMouseUp: (e: MouseEvent<HTMLButtonElement>) => {
      setIsGrabbing(false);
      if (listeners?.onMouseUp) listeners.onMouseUp(e);
    },
  };

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className="flex items-center justify-between border bg-primary-foreground p-4"
      style={style}
      {...attributes}
    >
      <p>{data.title}</p>

      <Button
        {...extendedListeners}
        type="button"
        variant="outline"
        className={`${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <DragHandleDots1Icon />
      </Button>
    </div>
  );
};

export default SortAbleCourseSection;
