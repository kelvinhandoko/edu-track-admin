"use client";
import { api } from "@/trpc/react";
import React from "react";
import { DataTable } from "../../template/TableTemplate";
import courseColumns from "./column";

interface Iprops {
  initialData: Course[];
}

const CourseTable = () => {
  const { data } = api.lecturer.getCourses.useQuery();
  return <DataTable data={data ?? []} columns={courseColumns} />;
};

export default CourseTable;
