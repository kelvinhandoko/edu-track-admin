import SettingForm from "@/app/_components/setting/SettingForm";
import { api } from "@/trpc/server";
import React from "react";

const page = async () => {
  const data = await api.lecturer.find.query();
  return <SettingForm initialData={data} />;
};

export default page;
