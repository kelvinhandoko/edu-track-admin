import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import CourseTable from "../_components/course/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/server";

export default async function Home() {
  const courses = await api.lecturer.getCourses.query();
  return (
    <main className="flex w-full flex-col justify-center gap-4  duration-1000 animate-in fade-in">
      <div className="flex justify-between">
        <div className="flex gap-1 text-xl font-bold capitalize">
          <h1>courses</h1>
          <span className="text-muted-foreground">{courses.length}</span>
        </div>
        <Link href="/courseForm?type=create" className="ml-auto">
          <Button variant="outline" className="p-2">
            <PlusIcon className="mr-4 h-6 w-6" /> new courses
          </Button>
        </Link>
      </div>
      <CourseTable initialData={courses} />
    </main>
  );
}
