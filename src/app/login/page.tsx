import React from "react";
import LoginForm from "../_components/login/LoginForm";

const page = () => {
  return (
    <main className="mx-auto flex h-[100dvh] w-[min(96%,1080px)] items-center justify-center ">
      <LoginForm />
    </main>
  );
};

export default page;
