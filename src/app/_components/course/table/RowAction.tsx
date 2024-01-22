import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { toast } from "sonner";

interface Iprops {
  id: string;
}

const CourseRowActions: FC<Iprops> = ({ id }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { mutateAsync: deleteCourse } = api.course.delete.useMutation();
  const handleDelete = async () => {
    try {
      const res = await deleteCourse(id);

      if (res.code === 200) {
        toast.success(res.message);
        await utils.lecturer.invalidate();
      }
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="mx-auto aspect-square p-2">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`courseForm?type=update&id=${id}`)}
        >
          edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CourseRowActions;
