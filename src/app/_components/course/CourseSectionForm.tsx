/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactPlayer from "react-player";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState, type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { type CourseSection } from "@/type/Course";

interface Iprops {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onSubmit: (
    data: Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>,
    index?: number,
  ) => void;
  data?: Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>;
  type: "create" | "update";
}

const CourseSectionForm: FC<Iprops> = ({
  isOpen,
  onClose,
  onSubmit,
  onToggle,
  data,
  type,
}) => {
  const form = useForm<
    Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>
  >({
    defaultValues: data,
  });
  const [isFinishInput, setIsFinishInput] = useState(false);
  const handleDelete = () => {
    form.setValue("videoUrl", "");
    setIsFinishInput(false);
  };
  const handleSubmit: SubmitHandler<
    Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>
  > = (data) => {
    onSubmit({ ...data });
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (data) {
      form.setValue("title", data.title);
      form.setValue("description", data.description);
      form.setValue("id", data.id);
      form.setValue("videoUrl", data.videoUrl);
    }
  }, [data, form]);

  useEffect(() => {
    if (type === "create") {
      form.reset();
      setIsFinishInput(false);
    }
  }, [type, form]);

  const onOpenChange = () => {
    onToggle();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(100%,1080px)] overflow-scroll">
        <DialogHeader>
          <DialogTitle>course sections setup</DialogTitle>
          <DialogDescription>
            add your course sections detail here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className=" grid w-full grid-cols-1  gap-4 overflow-scroll sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                  <FormLabel>sections title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter the section title here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                  <FormLabel>sections description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="enter the section description here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="col-[1/-1]  flex flex-col gap-2 rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>sections video</FormLabel>
                    <Button
                      onClick={handleDelete}
                      className="aspect-square p-0"
                      type="button"
                      variant="ghost"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <FormControl>
                    {isFinishInput ? (
                      <div className="mx-auto w-1/2">
                        <AspectRatio ratio={16 / 9}>
                          <ReactPlayer
                            width="100%"
                            height="100%"
                            url={form.watch("videoUrl")}
                            controls
                            config={{
                              youtube: {
                                playerVars: { showinfo: 1 },
                              },
                            }}
                          />
                        </AspectRatio>
                      </div>
                    ) : (
                      <Input
                        placeholder="add youtube video url here"
                        {...field}
                        onBlur={() => setIsFinishInput(true)}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="col-[1/-1] ml-auto w-fit">
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseSectionForm;
