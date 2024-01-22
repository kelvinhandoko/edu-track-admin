"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { BookmarkIcon, PersonIcon } from "@radix-ui/react-icons";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SideBar = () => {
  const { data, isFetching } = api.lecturer.find.useQuery();
  const pathName = usePathname();
  return (
    <div className="flex flex-1 flex-col items-center gap-4 p-0 sm:border-r sm:px-8">
      {isFetching ? (
        <Skeleton className=" h-24 w-36 rounded-md border p-4 px-8" />
      ) : (
        <div className="flex w-fit items-center gap-4 rounded-md border p-4 px-8">
          <Avatar>
            <AvatarImage src={data?.profile?.pictureUrl!} />
            <AvatarFallback>
              <PersonIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <p className="font-bold">{data?.name}</p>
        </div>
      )}

      <p className="text-md mt-4 font-bold text-muted-foreground">main menu</p>
      <div className="flex w-full flex-col items-center gap-4">
        <Link href="/" className="w-full">
          <Button
            variant={pathName === "/" ? "secondary" : "outline"}
            className="w-full p-4 px-8 sm:w-fit"
          >
            <BookmarkIcon className="mr-2 h-4 w-4" /> courses
          </Button>
        </Link>
        <Link href="/setting" className="w-full">
          <Button
            variant={pathName === "/setting" ? "secondary" : "outline"}
            className="w-full p-4 px-8 sm:w-fit"
          >
            <Settings className="mr-2 h-4 w-4" /> setting
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
