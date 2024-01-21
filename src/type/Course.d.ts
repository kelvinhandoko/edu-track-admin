import { type api } from "@/trpc/server";
import { TypeOf } from "zod";

type Course = {
  id: string;
  name: string;
  price: number;
  backgroundUrl?: string;
  lecturer: Lecturer;
  CourseSection: CourseSection[];
  createdAt: Date;
  updatedAt: Date;
};

type CourseSection = {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
};

type CoursePayload = {
  backgroundUrl: string;
  categoryId: string;
  name: string;
  price: number;
  sections: Array<
    Omit<CourseSection, "id"> & Partial<Pick<CourseSection, "id">>
  >;
  id?: string;
};

type GetDetailCourse = Awaited<ReturnType<typeof api.course.getDetail.query>>;
