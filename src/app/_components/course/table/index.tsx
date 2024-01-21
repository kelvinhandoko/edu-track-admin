"use client";
import { api } from "@/trpc/react";
import React, { type FC } from "react";
import { DataTable } from "../../template/TableTemplate";
import courseColumns from "./column";
import { type Course } from "@/type/Course";

interface Iprops {
  initialData: Course[];
}

const CourseTable: FC<Iprops> = ({ initialData }) => {
  const { data } = api.lecturer.getCourses.useQuery(undefined, { initialData });
  return <DataTable data={data ?? []} columns={courseColumns} />;
};

export default CourseTable;
