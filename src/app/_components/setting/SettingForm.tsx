"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { type LecturerPayload, type FindLecturer } from "@/type/Lecturer";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TRPCClientError } from "@trpc/client";
import React, { useEffect, useState, type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  initialData: FindLecturer;
}

const SettingForm: FC<IProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, isFetching } = api.lecturer.find.useQuery(undefined, {
    initialData,
  });
  const utils = api.useUtils();
  const { mutateAsync: updateLecturer } = api.lecturer.update.useMutation();
  const form = useForm<LecturerPayload>();
  const onSubmit: SubmitHandler<LecturerPayload> = async (data) => {
    try {
      setIsLoading(true);
      const res = await updateLecturer({ bio: data.bio, name: data.name });
      console.log(res);
      if (res?.code === 200) {
        toast.success(res.message);
        await utils.lecturer.find.invalidate();
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error("something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    form.reset(data);
  }, [data, form]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-12 p-2 duration-1000 animate-in fade-in "
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Setting</h1>
          <p className="text-sm text-muted-foreground">
            change your profile information
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "lecturer name is required" }}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
              <FormLabel>lecturer name</FormLabel>
              <FormControl>
                {isFetching ? (
                  <Skeleton className="z-20 h-24 w-full rounded-md border bg-primary-foreground" />
                ) : (
                  <Input
                    placeholder="what do we call you as lecturer?"
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 rounded-md bg-muted p-4">
              <FormLabel>your bio</FormLabel>
              <FormControl>
                {isFetching ? (
                  <Skeleton className="z-20 h-24 w-full rounded-md border bg-primary-foreground" />
                ) : (
                  <Textarea placeholder="your bio?" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="ml-auto w-fit" disabled={isLoading}>
          {isLoading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> loading
            </>
          ) : (
            "save"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SettingForm;
