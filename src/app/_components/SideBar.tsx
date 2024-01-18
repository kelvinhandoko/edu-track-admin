"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { BookmarkIcon, PersonIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SideBar = () => {
  const { data } = api.lecturer.find.useQuery();
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className="flex flex-1 flex-col items-center gap-4 border-r px-8">
      <div className="flex w-fit items-center gap-4 rounded-md border p-4 px-8">
        <Avatar>
          <AvatarImage src={data?.profile?.pictureUrl!} />
          <AvatarFallback>
            <PersonIcon className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <p className="font-bold">{data?.name}</p>
      </div>
      <p className="text-md mt-4 font-bold text-muted-foreground">main menu</p>
      <div className="flex w-full flex-col items-center">
        <Button
          onClick={() => router.push("/")}
          variant={pathName === "/" ? "secondary" : "outline"}
          className="w-fit p-4 px-8"
        >
          <BookmarkIcon className="mr-2 h-4 w-4" /> courses
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
