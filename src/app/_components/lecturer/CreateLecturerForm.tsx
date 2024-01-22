"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { type LecturerPayload } from "@/type/Lecturer";
import { ChevronLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateLecturerForm = () => {
  const form = useForm<LecturerPayload>();
  const { mutateAsync } = api.lecturer.create.useMutation();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();

  const handleNext = () =>
    // set current step to next step and check if it was 0  then set it to 0
    setStep((cur) => {
      if (cur === 1) return cur;
      return cur + 1;
    });
  const handlePrev = () =>
    setStep((cur) => {
      if (cur === 0) return cur;
      return cur - 1;
    });

  const onSubmit: SubmitHandler<LecturerPayload> = async (data) => {
    try {
      handleNext();
      setIsLoading(true);
      const res = await mutateAsync(data);
      setSuccess(true);
      setCount(3);
      if (res?.code === 201) {
        toast.success(res.message);
      }

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (count !== 0) {
      intervalId = setInterval(() => {
        setCount((cur) => (cur > 0 ? cur - 1 : 0)); // Decrease count but stop at 0
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Clear interval on component unmount or when count is set to null again
    };
  }, [count]);
  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {step !== 0 && !success ? (
        <Button
          type="button"
          variant="outline"
          className="aspect-square w-fit p-2"
        >
          <ChevronLeftIcon onClick={handlePrev} />
        </Button>
      ) : null}

      {step === 0 ? (
        <div className="flex flex-col gap-4 animate-in fade-in-5">
          <Label className="text-lg font-bold capitalize">
            hi, what do we call you as lecturer?{" "}
          </Label>
          <Input
            {...form.register("name")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNext();
              }
            }}
          />
        </div>
      ) : null}
      {step === 1 ? (
        <>
          {success ? (
            <p>we will redirect you in {count}</p>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in-5">
              <Label className="text-lg font-bold capitalize">
                what is your bio?{" "}
              </Label>

              <Textarea {...form.register("bio")} />
              <Button type="submit">
                {isLoading ? (
                  <>
                    {" "}
                    <ReloadIcon className="animate-spin" /> loading...{" "}
                  </>
                ) : (
                  "submit"
                )}
              </Button>
            </div>
          )}
        </>
      ) : null}
    </form>
  );
};

export default CreateLecturerForm;
