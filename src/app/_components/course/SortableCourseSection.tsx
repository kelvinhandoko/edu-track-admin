import React, { type MouseEvent, useState, type FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import { type CourseSection } from "@/type/Course";

interface IProps {
  data: Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>;
  id: UniqueIdentifier;
  onClick: () => void;
  handleDelete: (e: MouseEvent<HTMLButtonElement>) => void;
}

const SortAbleCourseSection: FC<IProps> = ({
  data,
  id,
  onClick,
  handleDelete,
}) => {
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
      <div className="flex gap-2">
        <Button
          {...extendedListeners}
          type="button"
          variant="outline"
          className={`${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <DragHandleDots1Icon />
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={handleDelete}
          className="aspect-square p-2"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

export default SortAbleCourseSection;
