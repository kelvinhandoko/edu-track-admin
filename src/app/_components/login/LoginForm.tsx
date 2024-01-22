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
import { EyeClosedIcon, EyeOpenIcon, ReloadIcon } from "@radix-ui/react-icons";
import { FirebaseError } from "firebase/app";

import { FcGoogle } from "react-icons/fc";
import { set } from "date-fns";

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

      setIsloading(false);
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        return;
      }
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            toast.error("user not found");
            break;
          case "auth/invalid-credential":
            toast.error("wrong email or password");
            break;
          default:
            toast.error("something went wrong");
            break;
        }
      }
    } finally {
      setIsloading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsloading(true);
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
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="flex h-fit flex-col gap-2">
          <CardHeader className=" flex flex-col items-center justify-center">
            <CardTitle className="text-3xl">LOGIN</CardTitle>
            <CardDescription>
              Enter your email below to create your account .
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary capitalize" type="submit">
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> loading
                </>
              ) : (
                "login"
              )}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              className="w-2/3"
              variant="outline"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> loading
                </>
              ) : (
                <>
                  <FcGoogle className=" mr-2 h-4 w-4" /> continue with google
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LoginForm;
