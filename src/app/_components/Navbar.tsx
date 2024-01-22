/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { auth } from "@/config/firebase";
import { api } from "@/trpc/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "./SideBar";
import { List } from "lucide-react";

const Navbar = () => {
  const { data } = api.lecturer.find.useQuery();
  const router = useRouter();
  async function handleSignOut() {
    //Sign out with the Firebase client
    await signOut(auth);

    //Clear the cookies in the server
    const response = await fetch(`/api/signOut`, {
      method: "POST",
    });

    if (response.status === 200) {
      router.push("/login");
    }
  }
  return (
    <div className=" flex w-full items-center justify-between border-b p-8">
      <Sheet>
        <SheetTrigger asChild className="flex sm:hidden">
          <Button className="aspect-square p-2" variant="outline">
            <List />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SideBar />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <svg
          width="38"
          height="36"
          viewBox="0 0 38 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="react-icons/bs/BsFillPuzzleFill">
            <path
              id="Vector"
              d="M7.73297 8.47344C7.68596 8.01793 7.74072 7.5582 7.89372 7.1238C8.04672 6.68939 8.29458 6.28991 8.62138 5.95103C8.94818 5.61214 9.34668 5.34134 9.79129 5.15603C10.2359 4.97072 10.7168 4.87499 11.203 4.875H16.7695C17.0777 4.875 17.3733 4.99023 17.5913 5.19535C17.8092 5.40047 17.9316 5.67867 17.9316 5.96875V6.80437C17.9316 8.32687 16.7765 9.39 15.9049 10.0178C15.8 10.088 15.7095 10.1754 15.6376 10.2759C15.626 10.293 15.6166 10.3114 15.6097 10.3306L15.6074 10.3438V10.3503L15.6144 10.3722C15.6237 10.3941 15.6469 10.4334 15.6981 10.4881C15.8759 10.6667 16.0891 10.8108 16.3256 10.9125C16.9787 11.2188 17.9549 11.4375 19.0938 11.4375C20.2373 11.4375 21.2134 11.2188 21.8596 10.9125C22.0969 10.8111 22.3109 10.6669 22.4894 10.4881C22.5236 10.453 22.5518 10.4132 22.5731 10.37L22.5801 10.3481V10.3306C22.5732 10.3114 22.5639 10.293 22.5522 10.2759C22.4804 10.1754 22.3898 10.088 22.2849 10.0178C21.4133 9.39 20.2582 8.32687 20.2582 6.80437V5.96875C20.2582 5.67905 20.3803 5.40118 20.5977 5.19612C20.8152 4.99107 21.1102 4.87558 21.418 4.875H26.9845C27.4707 4.87499 27.9516 4.97072 28.3962 5.15603C28.8408 5.34134 29.2393 5.61214 29.5661 5.95103C29.8929 6.28991 30.1408 6.68939 30.2938 7.1238C30.4468 7.5582 30.5015 8.01793 30.4545 8.47344L29.8897 14.7188H30.4406C30.8938 14.7188 31.4168 14.3972 32.0094 13.6687C32.4975 13.0694 33.2366 12.5312 34.2012 12.5312C35.5213 12.5312 36.4022 13.5091 36.8833 14.4169C37.4016 15.3903 37.6875 16.6591 37.6875 18C37.6875 19.3409 37.4016 20.6097 36.8833 21.5831C36.4022 22.4909 35.5213 23.4688 34.2012 23.4688C33.2366 23.4688 32.4975 22.9306 32.0094 22.3312C31.4168 21.6028 30.8938 21.2812 30.4406 21.2812H29.8897L30.4545 27.5266C30.5015 27.9821 30.4468 28.4418 30.2938 28.8762C30.1408 29.3106 29.8929 29.7101 29.5661 30.049C29.2393 30.3879 28.8408 30.6587 28.3962 30.844C27.9516 31.0293 27.4707 31.125 26.9845 31.125H21.418C21.1098 31.125 20.8142 31.0098 20.5962 30.8046C20.3783 30.5995 20.2559 30.3213 20.2559 30.0312V29.1956C20.2559 27.6731 21.411 26.61 22.2826 25.9822C22.3875 25.912 22.478 25.8246 22.5499 25.7241C22.5615 25.707 22.5709 25.6886 22.5778 25.6694L22.5801 25.6562V25.6497L22.5731 25.6278C22.5516 25.5854 22.5233 25.5464 22.4894 25.5119C22.3116 25.3333 22.0984 25.1891 21.8619 25.0875C21.2088 24.7812 20.2326 24.5625 19.0938 24.5625C17.9526 24.5625 16.9741 24.7812 16.3279 25.0875C16.0906 25.1889 15.8766 25.3331 15.6981 25.5119C15.664 25.547 15.6357 25.5869 15.6144 25.63L15.6074 25.6519V25.6562L15.6097 25.6694C15.6166 25.6886 15.626 25.707 15.6376 25.7241C15.6748 25.7831 15.7538 25.8728 15.9049 25.9822C16.7765 26.61 17.9316 27.6731 17.9316 29.1956V30.0312C17.9316 30.3213 17.8092 30.5995 17.5913 30.8046C17.3733 31.0098 17.0777 31.125 16.7695 31.125H11.203C10.7168 31.125 10.2359 31.0293 9.79129 30.844C9.34668 30.6587 8.94818 30.3879 8.62138 30.049C8.29458 29.7101 8.04672 29.3106 7.89372 28.8762C7.74072 28.4418 7.68596 27.9821 7.73297 27.5266L8.30008 21.2812H7.74691C7.29369 21.2812 6.77074 21.6028 6.17807 22.3312C5.68998 22.9306 4.95088 23.4688 3.98633 23.4688C2.66617 23.4688 1.78529 22.4909 1.30418 21.5831C0.785879 20.6097 0.5 19.3409 0.5 18C0.5 16.6591 0.785879 15.3903 1.30418 14.4169C1.78529 13.5091 2.66617 12.5312 3.98633 12.5312C4.95088 12.5312 5.68998 13.0694 6.17807 13.6687C6.77074 14.3972 7.29369 14.7188 7.74691 14.7188H8.30008L7.73297 8.47344Z"
              fill="#6A00FF"
            />
          </g>
        </svg>
        <h1 className="hidden text-2xl font-bold sm:flex">Edutrack.</h1>
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarImage src={data?.profile?.pictureUrl!} />
              <AvatarFallback>
                <PersonIcon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-fit">
            <Button variant="outline" onClick={handleSignOut}>
              log out
            </Button>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
