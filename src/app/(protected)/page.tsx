import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import CourseTable from "../_components/course/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/server";

export default async function Home() {
  const courses = await api.lecturer.getCourses.query();
  return (
    <main className="flex w-full flex-col  justify-center gap-4">
      <Link href="/courseForm?type=create" className="ml-auto" passHref>
        <Button variant="outline" className="p-2">
          <PlusIcon className="mr-4 h-6 w-6" /> new courses
        </Button>
      </Link>

      <CourseTable initialData={courses} />
    </main>
  );
}
