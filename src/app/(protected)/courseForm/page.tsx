import CourseForm from "@/app/_components/course/CourseForm";
import { NextPage, NextPageContext, type Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "create courses",
};

const page = ({ searchParams }: { searchParams: Record<string, string> }) => {
  return <CourseForm type={searchParams.type as "create" | "update"} />;
};

export default page;
