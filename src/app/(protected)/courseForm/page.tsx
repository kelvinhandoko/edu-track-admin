import CourseForm from "@/app/_components/course/CourseForm";
import { api } from "@/trpc/server";
import { NextPage, NextPageContext, type Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "create courses",
};

const page = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const data = await api.course.getDetail.query(searchParams.id);
  return (
    <CourseForm
      type={searchParams.type as "create" | "update"}
      id={searchParams.id}
      initialData={data}
    />
  );
};

export default page;
