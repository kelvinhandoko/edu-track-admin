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
import { CaretSortIcon, GridIcon, UploadIcon } from "@radix-ui/react-icons";
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useState,
  type FC,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { List, UploadCloud, X } from "lucide-react";
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
interface Iprops {
  type: "create" | "update";
}

const CourseForm: FC<Iprops> = ({ type }) => {
  const { data: categories } = api.category.findMany.useQuery();
  const form = useForm<CoursePayload>();
  const [imageFile, setImageFile] = useState<File>();
  const [preview, setPreview] = useState<string>("");
  const { isOpen, onClose, onToggle } = useDisclosure();
  const ref = useRef<HTMLButtonElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Accepted files:", acceptedFiles); // Debugging line
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

  // create delete image handler
  const deleteImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setImageFile(undefined);
    setPreview("");
  };

  return (
    <Form {...form}>
      <form autoComplete="off" className="flex flex-col gap-12 p-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold capitalize">course setup</h2>
          <Button>publish</Button>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>course title</FormLabel>
                  <FormControl>
                    <Input placeholder="enter the title here" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
