"use client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FirebaseError } from "firebase/app";

import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  //hooks

  const router = useRouter();
  const [show, setShow] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const form = useForm<RegisterUserPayload>({ reValidateMode: "onBlur" });

  // data fetching n mutation

  const handleClick = () => setShow(!show);
  // on submit handler
  const onSubmit: SubmitHandler<RegisterUserPayload> = async ({
    email,
    password,
  }) => {
    try {
      setIsloading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);

      fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await res.user.getIdToken()}`,
        },
        body: JSON.stringify({
          name: res.user.displayName,
          profilePicture: res.user.photoURL,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      toast.success("login success");

      toast.success("login register");

      setIsloading(false);
    } catch (error: unknown) {
      if (error instanceof TRPCClientError || error instanceof FirebaseError) {
        toast.error(error.message);
      } else {
        toast.error("something went wrong");
      }

      setIsloading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await res.user.getIdToken()}`,
        },
        body: JSON.stringify({
          name: res.user.displayName,
          profilePicture: res.user.photoURL,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className=" flex flex-col items-center justify-center">
        <CardTitle className="text-3xl">LOGIN</CardTitle>
        <CardDescription>
          Enter your email below to create your account .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            autoComplete="off"
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "invalid email" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your email here"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="enter your password here"
                        type={show ? "text" : "password"}
                        {...field}
                      />
                      <Button onClick={handleClick} variant="outline">
                        {show ? <EyeOpenIcon /> : <EyeClosedIcon />}
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-primary capitalize" type="submit">
          login
        </Button>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Button className="w-2/3" variant="outline" onClick={handleGoogleLogin}>
          <FcGoogle className=" mr-2 h-4 w-4" /> continue with google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
