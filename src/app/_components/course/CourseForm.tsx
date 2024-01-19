/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { CaretSortIcon, GridIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useState,
  type FC,
  useRef,
} from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { AlertCircle, List, PlusIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import useDisclosure from "@/hooks/useDisclosure";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortAbleCourseSection from "./SortableCourseSection";
import CourseSectionForm from "./CourseSectionForm";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import {
  getDownloadURL,
  ref as firebaseRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/config/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TRPCClientError } from "@trpc/client";

interface Iprops {
  type: "create" | "update";
}

const CourseForm: FC<Iprops> = ({ type }) => {
  const { data: categories } = api.category.findMany.useQuery();
  const form = useForm<CoursePayload>();
  const [imageFile, setImageFile] = useState<File>();
  const [preview, setPreview] = useState<string>("");
  const { isOpen, onClose, onToggle } = useDisclosure();
  const router = useRouter();
  const { mutateAsync: createCourse } = api.course.create.useMutation();
  const { mutateAsync: updateImage } = api.course.updateImages.useMutation();
  const {
    isOpen: isSectionOpen,
    onClose: onSectionClose,
    onToggle: onSectionToggle,
  } = useDisclosure();

  const [sectionType, setSectionType] = useState<"create" | "update">("create");

  const ref = useRef<HTMLButtonElement>(null);

  const [currentSection, setCurrentSection] = useState<
    (Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>) | undefined
  >(undefined);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    } else {
      console.log("No files accepted"); // Debugging line
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { append, fields, swap, update } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const [isLoading, setIsLoading] = useState(false);

  // create delete image handler
  const deleteImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setImageFile(undefined);
    setPreview("");
  };

  // useeffect for preview image use url.createObjectURL and revoked it
  useEffect(() => {
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile));
    }
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [imageFile]);

  const handleAddSection = (
    data: Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>,
  ) => {
    if (sectionType === "create") {
      append(data);
    } else {
      const index = fields.findIndex(
        (field) => field.id === currentSection?.id,
      );

      update(index, data);
    }
    onSectionToggle();
  };

  const handleCurrentSection = (
    data: Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>,
  ) => {
    setSectionType("update");
    setCurrentSection(data);
    onSectionToggle();
  };

  const handleAddClick = () => {
    setCurrentSection(undefined);
    setSectionType("create");
    onSectionToggle();
  };

  const onSubmit: SubmitHandler<CoursePayload> = async (data) => {
    try {
      setIsLoading(true);
      const res = await createCourse({
        ...data,
        sections: data.sections.map((section, index) => ({
          ...section,
          position: index,
          isFree: true,
          isPublished: true,
        })),
      });
      if (res?.code === 200) {
        const uploadedFile = async () => {
          const storageRef = firebaseRef(
            storage,
            `courses/${res.data.id}/thumbnail`,
          );
          const uploadTask = uploadBytes(storageRef, imageFile!);
          const snapShot = await uploadTask;
          return await getDownloadURL(snapShot.ref);
        };
        await updateImage({
          id: res.data.id,
          backgroundUrl: await uploadedFile(),
        });

        toast.success(res.message);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col gap-12 p-2 duration-1000 animate-in fade-in "
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold capitalize">course setup</h2>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait
                </>
              ) : (
                <>publish</>
              )}
            </Button>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-2">
                <GridIcon />
                <p>customize your courses</p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                    <FormLabel>course title</FormLabel>
                    <FormControl>
                      <Input placeholder="enter the title here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backgroundUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                    <FormLabel>course thumbnail</FormLabel>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className="flex flex-1 cursor-pointer items-center justify-center rounded-md  p-2 transition-all "
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <div className="flex w-full flex-col items-center justify-center gap-4">
                            <p className="text-center">drag it here ...</p>
                          </div>
                        ) : (
                          <div className="flex w-full flex-col items-center justify-center gap-4">
                            {preview ? (
                              <AspectRatio ratio={16 / 9} className="relative">
                                <Image
                                  src={preview}
                                  alt="Image"
                                  fill
                                  className="rounded-md object-contain"
                                />
                                <Button
                                  onClick={deleteImage}
                                  type="button"
                                  className="absolute right-0 top-0 p-2"
                                  variant="ghost"
                                >
                                  <X />
                                </Button>
                              </AspectRatio>
                            ) : (
                              <>
                                <UploadCloud className="h-8 w-8" />
                                <p className="text-center text-blue-500">
                                  Choose files or drag and drop
                                </p>
                                <p>image (max 4MB)</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      16:9 aspect rasio recommended
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                    <FormLabel>select category</FormLabel>
                    <Popover open={isOpen} onOpenChange={onToggle}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {categories?.find(
                              (category) => category.id === field.value,
                            )?.name ?? "Select category"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        style={{ width: `${ref.current?.clientWidth}px` }}
                      >
                        <Command className={cn("p-2")}>
                          <CommandInput placeholder="Search category..." />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories?.map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", category.id);
                                  onClose();
                                }}
                              >
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* right side */}
            <div className="flex flex-1  flex-col gap-4">
              <div className="flex items-center gap-2">
                <List />
                <p>customize Chapters</p>
              </div>
              <FormField
                control={form.control}
                name="sections"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between ">
                      <FormLabel>course sections</FormLabel>
                      <Button
                        type="button"
                        onClick={handleAddClick}
                        className="aspect-square p-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormControl>
                      <DndContext
                        modifiers={[
                          restrictToVerticalAxis,
                          restrictToParentElement,
                        ]}
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={fields?.map((data, index) => data.id) ?? []}
                          strategy={verticalListSortingStrategy}
                        >
                          {fields.map((data, index) => (
                            <SortAbleCourseSection
                              onClick={() => handleCurrentSection(data)}
                              key={data.title}
                              data={data}
                              id={data.id}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </FormControl>
                    <FormDescription>
                      rearrage the section if needed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
                    <FormLabel>prices</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter the title here"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-2 text-orange-600">
                      <AlertCircle /> add price is not avaiable now
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <CourseSectionForm
        onToggle={onSectionToggle}
        onSubmit={handleAddSection}
        isOpen={isSectionOpen}
        onClose={onClose}
        data={currentSection}
        type={sectionType}
      />
    </>
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldId = fields.findIndex((data) => data.id === active.id);
      const newId = fields.findIndex((data) => data.id === over?.id);
      swap(oldId, newId);
    }
  }
};

export default CourseForm;
